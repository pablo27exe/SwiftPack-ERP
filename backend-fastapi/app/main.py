from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importar los routers
from app.api import cotizacion, rastreo

app = FastAPI(
    title="SwiftPack ERP API",
    description="API del Sistema de Gestión ERP para SwiftPack",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers
app.include_router(cotizacion.router, prefix="/api/cotizacion", tags=["Cotización"])
app.include_router(rastreo.router, prefix="/api/rastreo", tags=["Rastreo"])

@app.get("/")
def root():
    return {"message": "Bienvenido a SwiftPack ERP API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}