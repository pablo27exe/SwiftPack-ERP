# app/api/clientes.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Usuario
from app.schemas import PerfilUpdate
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