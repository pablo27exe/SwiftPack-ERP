# app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    nombre = Column(String, nullable=False)
    telefono = Column(String, nullable=True)
    direccion = Column(String, nullable=True)
    rol = Column(String, default="cliente")  # cliente, admin, operador
    activo = Column(Boolean, default=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())

class Direccion(Base):
    __tablename__ = "direcciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, index=True, nullable=False)
    alias = Column(String, nullable=False)
    calle = Column(String, nullable=False)
    ciudad = Column(String, nullable=False)
    codigo_postal = Column(String, nullable=False)
    es_remitente = Column(Boolean, default=False)
    es_destinatario = Column(Boolean, default=False)