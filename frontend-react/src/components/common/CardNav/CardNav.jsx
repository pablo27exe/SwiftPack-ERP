import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { GoArrowUpRight } from 'react-icons/go';
import { useAuth } from '../../../context/AuthContext';
import './CardNav.css';

const CardNav = ({
  logo,
  logoAlt = 'SwiftPack Logo',
  items,
  className = '',
  ease = 'power3.out',
  baseColor = '#ffffff',
  menuColor = '#11519c',
  buttonBgColor = '#ef5a07',
  buttonTextColor = '#ffffff'
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    if (isExpanded) toggleMenu();
  };

  const handleButtonClick = () => {
    if (isAuthenticated) {
      if (user?.rol === 'admin' || user?.rol === 'operador') {
        navigate('/admin/dashboard');
      } else if (user?.rol === 'cliente') {
        navigate('/cliente/dashboard');
      }
    } else {
      navigate('/login');
    }
    if (isExpanded) toggleMenu();
  };

  // Filtrar items según el rol del usuario
  const getFilteredItems = () => {
    if (!items) return [];
    
    // Si no está autenticado, mostrar solo items públicos
    if (!isAuthenticated) {
      return items.filter(item => item.roles?.includes('public') || !item.roles);
    }
    
    // Si está autenticado, filtrar por su rol
    return items.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(user?.rol);
    });
  };

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  const getButtonText = () => {
    if (isAuthenticated) {
      if (user?.rol === 'admin' || user?.rol === 'operador') return 'Panel Admin';
      if (user?.rol === 'cliente') return 'Mi Cuenta';
    }
    return 'Iniciar Sesión';
  };

  const filteredItems = getFilteredItems();

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Cerrar menú' : 'Abrir menú'}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            <Link to="/" onClick={() => isExpanded && toggleMenu()}>
              {logo ? (
                <img src={logo} alt={logoAlt} className="logo" />
              ) : (
                <span className="logo-text">SwiftPack</span>
              )}
            </Link>
          </div>

          <button
            type="button"
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={handleButtonClick}
          >
            {getButtonText()}
          </button>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {filteredItems.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <Link
                    key={`${lnk.label}-${i}`}
                    to={lnk.href}
                    className="nav-card-link"
                    aria-label={lnk.ariaLabel}
                    onClick={() => isExpanded && toggleMenu()}
                  >
                    <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                    {lnk.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          {/* Botón de cerrar sesión dentro del menú (solo para autenticados) */}
          {isAuthenticated && (
            <div className="nav-card nav-card-logout" style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>
              <div className="nav-card-label">Cuenta</div>
              <div className="nav-card-links">
                <button
                  onClick={handleLogout}
                  className="nav-card-link"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: 0, color: 'inherit' }}
                >
                  <GoArrowUpRight className="nav-card-link-icon" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;