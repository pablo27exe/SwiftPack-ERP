# app/api/cotizacion.py
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class CotizacionRequest(BaseModel):
    origen: str
    destino: str
    peso: float
    tipo_servicio: str = "estandar"  # estandar, express, programado

@router.post("/calcular")
def calcular_cotizacion(data: CotizacionRequest):
    # Lógica temporal (después la reemplazarás con reglas de negocio)
    tarifa_base = 100 if data.tipo_servicio == "estandar" else 200
    costo_por_kg = 25
    total = tarifa_base + (data.peso * costo_por_kg)
    
    return {
        "total": total,
        "moneda": "MXN",
        "tipo_servicio": data.tipo_servicio,
        "desglose": {
            "tarifa_base": tarifa_base,
            "costo_por_kg": costo_por_kg,
            "peso": data.peso
        }
    }