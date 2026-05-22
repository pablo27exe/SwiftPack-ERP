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

class DireccionResponse(DireccionCreate):
    id: int
    usuario_id: int