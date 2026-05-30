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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
class Envio(Base):
    __tablename__ = "envios"

    id = Column(Integer, primary_key=True, index=True)
    numero_guia = Column(String, unique=True, index=True, nullable=False)
    usuario_id = Column(Integer, nullable=True, index=True)  # Puede ser null si no está registrado
    repartidor_id = Column(Integer, nullable=True, index=True) 
    origen = Column(String, nullable=False)
    destino = Column(String, nullable=False)
    peso = Column(Float, nullable=False)
    tipo_servicio = Column(String, default="estandar")  # estandar, express, programado
    estado = Column(String, default="pendiente")  # pendiente, en_transito, entregado
    costo = Column(Float, nullable=False)
    remitente_nombre = Column(String, nullable=False)
    remitente_direccion = Column(String, nullable=False)
    destinatario_nombre = Column(String, nullable=False)
    destinatario_direccion = Column(String, nullable=False)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    fecha_entrega = Column(DateTime(timezone=True), nullable=True)
    
class Tarifa(Base):
    __tablename__ = "tarifas"

    id = Column(Integer, primary_key=True, index=True)
    tipo_servicio = Column(String, nullable=False)  # estandar, express, programado
    origen_zona = Column(String, nullable=False)
    destino_zona = Column(String, nullable=False)
    costo_base = Column(Float, nullable=False)
    costo_por_kg = Column(Float, nullable=False)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    puesto = Column(String, nullable=False)
    telefono = Column(String, nullable=True)
    direccion = Column(String, nullable=True)
    salario = Column(Float, nullable=True)
    fecha_contratacion = Column(DateTime(timezone=True), nullable=True)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Asistencia(Base):
    __tablename__ = "asistencias"

    id = Column(Integer, primary_key=True, index=True)
    empleado_id = Column(Integer, nullable=False, index=True)
    tipo = Column(String, nullable=False)  # entrada, salida
    fecha_hora = Column(DateTime(timezone=True), server_default=func.now())
    ubicacion = Column(String, nullable=True)  # GPS o sucursal
    
