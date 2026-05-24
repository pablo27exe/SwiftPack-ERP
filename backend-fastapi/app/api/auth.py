# app/api/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from app.schemas import LoginRequest, LoginResponse, RegisterRequest, UserResponse
from app.auth import verify_password, get_password_hash, create_access_token, get_current_user
router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Buscar usuario por email
    usuario = db.query(Usuario).filter(Usuario.email == request.email).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    if not verify_password(request.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inactivo"
        )
    
    # Crear token
    access_token = create_access_token(data={"sub": usuario.email, "rol": usuario.rol})
    
    return LoginResponse(
        access_token=access_token,
        user={
            "id": usuario.id,
            "email": usuario.email,
            "nombre": usuario.nombre,
            "telefono": usuario.telefono,
            "direccion": usuario.direccion,
            "rol": usuario.rol
        }
    )

@router.post("/register", response_model=UserResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Verificar si el email ya existe
    existing = db.query(Usuario).filter(Usuario.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Crear nuevo usuario
    nuevo_usuario = Usuario(
        email=request.email,
        password_hash=get_password_hash(request.password),
        nombre=request.nombre,
        telefono=request.telefono,
        rol="cliente",
        activo=True
    )
    
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    return UserResponse(
        id=nuevo_usuario.id,
        email=nuevo_usuario.email,
        nombre=nuevo_usuario.nombre,
        telefono=nuevo_usuario.telefono,
        direccion=nuevo_usuario.direccion,
        rol=nuevo_usuario.rol,
        activo=nuevo_usuario.activo
    )

@router.get("/me")
def get_current_user(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == current_user["sub"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return {
        "id": usuario.id,
        "email": usuario.email,
        "nombre": usuario.nombre,
        "telefono": usuario.telefono,
        "direccion": usuario.direccion,
        "rol": usuario.rol
    }