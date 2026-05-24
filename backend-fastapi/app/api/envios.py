# app/api/envios.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from app.database import get_db
from app.models import Envio, Usuario
from app.schemas import EnvioCreate, EnvioUpdate, EnvioResponse
from app.auth import get_current_user

router = APIRouter()

def generar_numero_guia():
    """Genera un número de guía único"""
    return uuid.uuid4().hex[:12].upper()

def calcular_costo(origen: str, destino: str, peso: float, tipo_servicio: str) -> float:
    """Calcula el costo del envío (lógica temporal)"""
    tarifa_base = 100 if tipo_servicio == "estandar" else 200
    return tarifa_base + (peso * 25)

# ========== Endpoints para clientes ==========

@router.post("/", response_model=EnvioResponse)
def registrar_envio(
    envio: EnvioCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Registra un nuevo envío (cliente autenticado)"""
    
    # Buscar el usuario en la BD
    usuario = db.query(Usuario).filter(Usuario.email == current_user["sub"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Generar número de guía
    numero_guia = generar_numero_guia()
    
    # Calcular costo
    costo = calcular_costo(envio.origen, envio.destino, envio.peso, envio.tipo_servicio)
    
    # Crear nuevo envío
    nuevo_envio = Envio(
        numero_guia=numero_guia,
        usuario_id=usuario.id,
        origen=envio.origen,
        destino=envio.destino,
        peso=envio.peso,
        tipo_servicio=envio.tipo_servicio,
        estado="pendiente",
        costo=costo,
        remitente_nombre=envio.remitente_nombre,
        remitente_direccion=envio.remitente_direccion,
        destinatario_nombre=envio.destinatario_nombre,
        destinatario_direccion=envio.destinatario_direccion
    )
    
    db.add(nuevo_envio)
    db.commit()
    db.refresh(nuevo_envio)
    
    return nuevo_envio

@router.get("/", response_model=List[EnvioResponse])
def listar_mis_envios(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """Lista los envíos del cliente autenticado"""
    
    usuario = db.query(Usuario).filter(Usuario.email == current_user["sub"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    envios = db.query(Envio).filter(Envio.usuario_id == usuario.id).offset(skip).limit(limit).all()
    return envios

@router.get("/{guia}")
def obtener_envio_por_guia(
    guia: str,
    db: Session = Depends(get_db)
):
    """Obtiene un envío por número de guía (público, para rastreo)"""
    
    envio = db.query(Envio).filter(Envio.numero_guia == guia).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    
    return {
        "numero_guia": envio.numero_guia,
        "estado": envio.estado,
        "origen": envio.origen,
        "destino": envio.destino,
        "fecha_registro": envio.fecha_registro,
        "fecha_entrega": envio.fecha_entrega,
        "remitente": envio.remitente_nombre,
        "destinatario": envio.destinatario_nombre
    }

@router.patch("/{envio_id}/estado")
def actualizar_estado(
    envio_id: int,
    estado: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualiza el estado de un envío (solo admin/operador)"""
    
    # Verificar que sea admin o operador
    if current_user.get("rol") not in ["admin", "operador"]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    envio = db.query(Envio).filter(Envio.id == envio_id).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    
    envio.estado = estado
    if estado == "entregado":
        envio.fecha_entrega = datetime.now()
    
    db.commit()
    db.refresh(envio)
    
    return {"message": "Estado actualizado", "estado": envio.estado}