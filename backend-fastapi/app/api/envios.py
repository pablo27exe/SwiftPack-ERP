from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()

class EnvioRequest(BaseModel):
    origen: str
    destino: str
    peso: float
    remitente_nombre: str
    remitente_direccion: str
    destinatario_nombre: str
    destinatario_direccion: str
    tipo_servicio: str = "estandar"

class EnvioResponse(BaseModel):
    id: str
    numero_guia: str
    origen: str
    destino: str
    peso: float
    estado: str
    fecha_registro: datetime
    costo: float

# Base de datos temporal (después la reemplazarás con PostgreSQL)
envios_db = []

@router.post("/", response_model=EnvioResponse)
def registrar_envio(data: EnvioRequest):
    # Calcular costo
    tarifa_base = 100 if data.tipo_servicio == "estandar" else 200
    costo = tarifa_base + (data.peso * 25)
    
    # Generar número de guía único
    numero_guia = str(uuid.uuid4()).replace("-", "")[:12].upper()
    
    nuevo_envio = {
        "id": str(len(envios_db) + 1),
        "numero_guia": numero_guia,
        "origen": data.origen,
        "destino": data.destino,
        "peso": data.peso,
        "estado": "pendiente",
        "fecha_registro": datetime.now(),
        "costo": costo,
        "remitente_nombre": data.remitente_nombre,
        "destinatario_nombre": data.destinatario_nombre
    }
    
    envios_db.append(nuevo_envio)
    return nuevo_envio

@router.get("/")
def listar_envios():
    return envios_db

@router.get("/{guia}")
def obtener_envio_por_guia(guia: str):
    for envio in envios_db:
        if envio["numero_guia"] == guia:
            return envio
    raise HTTPException(status_code=404, detail="Envío no encontrado")

@router.patch("/{envio_id}/estado")
def actualizar_estado(envio_id: str, estado: str):
    for envio in envios_db:
        if envio["id"] == envio_id:
            envio["estado"] = estado
            return {"message": "Estado actualizado", "estado": estado}
    raise HTTPException(status_code=404, detail="Envío no encontrado")