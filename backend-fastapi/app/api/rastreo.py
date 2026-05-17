# app/api/rastreo.py
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/{guia}")
def rastrear_envio(guia: str):
    # Temporal: datos mock
    return {
        "numero_guia": guia,
        "estado": "en_transito",
        "origen": "CDMX",
        "destino": "GDL",
        "fecha_estimada": "2026-05-20",
        "historial": [
            {"estado": "recibido", "fecha": "2026-05-16 10:00", "ubicacion": "CDMX"},
            {"estado": "en_transito", "fecha": "2026-05-16 14:00", "ubicacion": "Querétaro"}
        ]
    }