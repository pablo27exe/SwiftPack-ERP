# app/api/clientes.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario, Direccion
from app.schemas import PerfilUpdate, DireccionCreate, DireccionUpdate, DireccionResponse
from app.auth import get_current_user

router = APIRouter()

@router.get("/perfil")
def obtener_perfil(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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

@router.put("/perfil")
def actualizar_perfil(
    data: PerfilUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(Usuario.email == current_user["sub"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if data.nombre is not None:
        usuario.nombre = data.nombre
    if data.telefono is not None:
        usuario.telefono = data.telefono
    if data.direccion is not None:
        usuario.direccion = data.direccion
    if data.email is not None:
        # Verificar que el nuevo email no esté en uso
        existing = db.query(Usuario).filter(Usuario.email == data.email).first()
        if existing and existing.id != usuario.id:
            raise HTTPException(status_code=400, detail="El email ya está en uso")
        usuario.email = data.email
    
    db.commit()
    db.refresh(usuario)
    
    return {
        "id": usuario.id,
        "email": usuario.email,
        "nombre": usuario.nombre,
        "telefono": usuario.telefono,
        "direccion": usuario.direccion,
        "rol": usuario.rol
    }
    
# ========== CRUD de Direcciones ==========

@router.get("/direcciones", response_model=list[DireccionResponse])
def listar_direcciones(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista todas las direcciones del usuario autenticado"""
    direcciones = db.query(Direccion).filter(
        Direccion.usuario_id == current_user["id"]
    ).all()
    return direcciones

@router.post("/direcciones", response_model=DireccionResponse)
def crear_direccion(
    direccion: DireccionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crea una nueva dirección para el usuario autenticado"""
    nueva_direccion = Direccion(
        usuario_id=current_user["id"],
        alias=direccion.alias,
        calle=direccion.calle,
        ciudad=direccion.ciudad,
        codigo_postal=direccion.codigo_postal,
        es_remitente=direccion.es_remitente,
        es_destinatario=direccion.es_destinatario
    )
    
    db.add(nueva_direccion)
    db.commit()
    db.refresh(nueva_direccion)
    return nueva_direccion

@router.put("/direcciones/{direccion_id}", response_model=DireccionResponse)
def actualizar_direccion(
    direccion_id: int,
    direccion_update: DireccionUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualiza una dirección existente"""
    direccion = db.query(Direccion).filter(
        Direccion.id == direccion_id,
        Direccion.usuario_id == current_user["id"]
    ).first()
    
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    
    # Actualizar solo los campos proporcionados
    update_data = direccion_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(direccion, field, value)
    
    db.commit()
    db.refresh(direccion)
    return direccion

@router.delete("/direcciones/{direccion_id}")
def eliminar_direccion(
    direccion_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Elimina una dirección"""
    direccion = db.query(Direccion).filter(
        Direccion.id == direccion_id,
        Direccion.usuario_id == current_user["id"]
    ).first()
    
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    
    db.delete(direccion)
    db.commit()
    
    return {"message": "Dirección eliminada correctamente"}