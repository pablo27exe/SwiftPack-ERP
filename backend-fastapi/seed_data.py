# seed_data.py
from app.database import SessionLocal, engine
from app.models import Base, Usuario
from app.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Crear usuario admin
admin = Usuario(
    email="admin@swiftpack.com",
    password_hash=get_password_hash("admin123"),
    nombre="Administrador",
    rol="admin",
    activo=True
)

# Crear usuario cliente
cliente = Usuario(
    email="cliente@swiftpack.com",
    password_hash=get_password_hash("cliente123"),
    nombre="Cliente Prueba",
    rol="cliente",
    activo=True
)

db.add(admin)
db.add(cliente)
db.commit()
db.close()

print("Usuarios creados:")
print("   admin@swiftpack.com / admin123")
print("   cliente@swiftpack.com / cliente123")