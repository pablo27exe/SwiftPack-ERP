# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Schemas para Auth
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    nombre: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    rol: str
    activo: bool

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    nombre: str
    telefono: Optional[str] = None

# Schemas para Perfil
class PerfilUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    email: Optional[EmailStr] = None

# Schemas para Direcciones
class DireccionCreate(BaseModel):
    alias: str
    calle: str
    ciudad: str
    codigo_postal: str
    es_remitente: bool = False
    es_destinatario: bool = False

class DireccionUpdate(BaseModel):
    alias: Optional[str] = None
    calle: Optional[str] = None
    ciudad: Optional[str] = None
    codigo_postal: Optional[str] = None
    es_remitente: Optional[bool] = None
    es_destinatario: Optional[bool] = None

class DireccionResponse(DireccionCreate):
    id: int
    usuario_id: int
    
    class Config:
        from_attributes = True
        
# Schemas para Tarifas
class TarifaBase(BaseModel):
    tipo_servicio: str
    origen_zona: str
    destino_zona: str
    costo_base: float
    costo_por_kg: float

class TarifaCreate(TarifaBase):
    pass

class TarifaUpdate(BaseModel):
    tipo_servicio: Optional[str] = None
    origen_zona: Optional[str] = None
    destino_zona: Optional[str] = None
    costo_base: Optional[float] = None
    costo_por_kg: Optional[float] = None
    activo: Optional[bool] = None

class TarifaResponse(TarifaBase):
    id: int
    activo: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        
# Schemas para Envíos
class EnvioBase(BaseModel):
    origen: str
    destino: str
    peso: float
    tipo_servicio: str = "estandar"
    remitente_nombre: str
    remitente_direccion: str
    destinatario_nombre: str
    destinatario_direccion: str

class EnvioCreate(EnvioBase):
    pass

class EnvioUpdate(BaseModel):
    estado: Optional[str] = None
    fecha_entrega: Optional[datetime] = None

class EnvioResponse(EnvioBase):
    id: int
    numero_guia: str
    usuario_id: Optional[int] = None
    estado: str
    costo: float
    fecha_registro: datetime
    fecha_actualizacion: Optional[datetime] = None
    fecha_entrega: Optional[datetime] = None

    class Config:
        from_attributes = True

class EnvioClienteResponse(EnvioResponse):
    pass

# Schemas para Empleados
class EmpleadoBase(BaseModel):
    nombre: str
    email: EmailStr
    puesto: str
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    salario: Optional[float] = None
    fecha_contratacion: Optional[datetime] = None

class EmpleadoCreate(EmpleadoBase):
    pass

class EmpleadoUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    puesto: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    salario: Optional[float] = None
    fecha_contratacion: Optional[datetime] = None
    activo: Optional[bool] = None

class EmpleadoResponse(EmpleadoBase):
    id: int
    activo: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Schemas para Asistencia
class AsistenciaCreate(BaseModel):
    tipo: str  # entrada o salida
    ubicacion: Optional[str] = None

class AsistenciaResponse(BaseModel):
    id: int
    empleado_id: int
    tipo: str
    fecha_hora: datetime
    ubicacion: Optional[str] = None

    class Config:
        from_attributes = True
        
class EstadoUpdate(BaseModel):
    estado: str