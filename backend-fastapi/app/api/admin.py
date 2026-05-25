from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models import Usuario, Envio, Direccion, Tarifa, Empleado, Asistencia
from app.schemas import UserResponse, PerfilUpdate, EstadoUpdate
from app.auth import get_current_user
from app.schemas import PerfilUpdate, TarifaCreate, TarifaUpdate, TarifaResponse, AsistenciaCreate, AsistenciaResponse

from fastapi.responses import StreamingResponse
import csv
from io import StringIO

router = APIRouter()

# ========== Verificación de rol admin ==========
def verificar_admin(current_user: dict):
    if current_user.get("rol") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador"
        )
    return True

# ========== 1. KPIs / Dashboard ==========
@router.get("/kpis")
def obtener_kpis(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    total_clientes = db.query(Usuario).filter(Usuario.rol == "cliente").count()
    total_envios = db.query(Envio).count()
    envios_pendientes = db.query(Envio).filter(Envio.estado == "pendiente").count()
    envios_transito = db.query(Envio).filter(Envio.estado == "en_transito").count()
    envios_entregados = db.query(Envio).filter(Envio.estado == "entregado").count()
    ingresos_hoy = total_envios * 150
    
    return {
        "total_clientes": total_clientes,
        "total_envios": total_envios,
        "envios_pendientes": envios_pendientes,
        "envios_transito": envios_transito,
        "envios_entregados": envios_entregados,
        "ingresos_hoy": ingresos_hoy,
        "repartidores_activos": 5,
        "ultimos_envios": []
    }

# ========== 2. Gestión de Envíos ==========
@router.get("/envios")
def listar_envios_admin(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    verificar_admin(current_user)
    envios = db.query(Envio).offset(skip).limit(limit).all()
    return envios

@router.patch("/envios/{envio_id}/estado")
def actualizar_estado_envio_admin(
    envio_id: int,
    estado_data: EstadoUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    envio = db.query(Envio).filter(Envio.id == envio_id).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    
    envio.estado = estado_data.estado
    if estado_data.estado == "entregado":
        envio.fecha_entrega = datetime.now()
    
    db.commit()
    db.refresh(envio)
    
    return {"message": "Estado actualizado", "estado": envio.estado}

@router.delete("/envios/{envio_id}")
def eliminar_envio_admin(
    envio_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    envio = db.query(Envio).filter(Envio.id == envio_id).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    
    db.delete(envio)
    db.commit()
    
    return {"message": "Envío eliminado correctamente"}

# ========== Verificación de rol admin ==========
def verificar_admin(current_user: dict):
    if current_user.get("rol") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador"
        )
    return True

# ========== 1. KPIs / Dashboard ==========
@router.get("/kpis")
def obtener_kpis(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    # Contar clientes
    total_clientes = db.query(Usuario).filter(Usuario.rol == "cliente").count()
    
    # Contar envíos por estado
    total_envios = db.query(Envio).count()
    envios_pendientes = db.query(Envio).filter(Envio.estado == "pendiente").count()
    envios_transito = db.query(Envio).filter(Envio.estado == "en_transito").count()
    envios_entregados = db.query(Envio).filter(Envio.estado == "entregado").count()
    
    # Calcular ingresos aproximados (simulado)
    ingresos_hoy = total_envios * 150  # Valor aproximado
    
    return {
        "total_clientes": total_clientes,
        "total_envios": total_envios,
        "envios_pendientes": envios_pendientes,
        "envios_transito": envios_transito,
        "envios_entregados": envios_entregados,
        "ingresos_hoy": ingresos_hoy,
        "repartidores_activos": 5,  # Por ahora fijo
        "ultimos_envios": []  # Se puede implementar después
    }

# ========== 2. Gestión de Envíos ==========
@router.get("/envios")
def listar_envios_admin(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    verificar_admin(current_user)
    
    envios = db.query(Envio).offset(skip).limit(limit).all()
    return envios

@router.delete("/envios/{envio_id}")
def eliminar_envio_admin(
    envio_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    envio = db.query(Envio).filter(Envio.id == envio_id).first()
    if not envio:
        raise HTTPException(status_code=404, detail="Envío no encontrado")
    
    db.delete(envio)
    db.commit()
    
    return {"message": "Envío eliminado correctamente"}

# ========== 3. Gestión de Clientes ==========
@router.get("/clientes", response_model=List[UserResponse])
def listar_clientes_admin(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    clientes = db.query(Usuario).filter(Usuario.rol == "cliente").all()
    return clientes

@router.post("/clientes", response_model=UserResponse)
def crear_cliente_admin(
    cliente_data: PerfilUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    # Verificar si el email ya existe
    existing = db.query(Usuario).filter(Usuario.email == cliente_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    from app.auth import get_password_hash
    
    nuevo_cliente = Usuario(
        email=cliente_data.email,
        password_hash=get_password_hash("cliente123"),  # Contraseña por defecto
        nombre=cliente_data.nombre,
        telefono=cliente_data.telefono,
        direccion=cliente_data.direccion,
        rol="cliente",
        activo=True
    )
    
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    
    return nuevo_cliente

@router.put("/clientes/{cliente_id}", response_model=UserResponse)
def actualizar_cliente_admin(
    cliente_id: int,
    cliente_data: PerfilUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    cliente = db.query(Usuario).filter(Usuario.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    if cliente_data.nombre is not None:
        cliente.nombre = cliente_data.nombre
    if cliente_data.telefono is not None:
        cliente.telefono = cliente_data.telefono
    if cliente_data.direccion is not None:
        cliente.direccion = cliente_data.direccion
    if cliente_data.email is not None:
        existing = db.query(Usuario).filter(Usuario.email == cliente_data.email).first()
        if existing and existing.id != cliente_id:
            raise HTTPException(status_code=400, detail="El email ya está en uso")
        cliente.email = cliente_data.email
    
    db.commit()
    db.refresh(cliente)
    
    return cliente

@router.delete("/clientes/{cliente_id}")
def eliminar_cliente_admin(
    cliente_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    verificar_admin(current_user)
    
    cliente = db.query(Usuario).filter(Usuario.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    # No eliminar al propio admin
    if cliente.email == current_user.get("sub"):
        raise HTTPException(status_code=400, detail="No puedes eliminarte a ti mismo")
    
    db.delete(cliente)
    db.commit()
    
    return {"message": "Cliente eliminado correctamente"}

# ========== 4. Gestión de Tarifas ==========
from app.models import Tarifa
from app.schemas import TarifaCreate, TarifaUpdate, TarifaResponse

@router.get("/tarifas", response_model=List[TarifaResponse])
def listar_tarifas(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    activo: Optional[bool] = None
):
    """Lista todas las tarifas (opcionalmente filtrar por activo)"""
    verificar_admin(current_user)
    
    query = db.query(Tarifa)
    if activo is not None:
        query = query.filter(Tarifa.activo == activo)
    
    return query.all()

@router.post("/tarifas", response_model=TarifaResponse)
def crear_tarifa(
    tarifa: TarifaCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crea una nueva tarifa"""
    verificar_admin(current_user)
    
    nueva_tarifa = Tarifa(
        tipo_servicio=tarifa.tipo_servicio,
        origen_zona=tarifa.origen_zona,
        destino_zona=tarifa.destino_zona,
        costo_base=tarifa.costo_base,
        costo_por_kg=tarifa.costo_por_kg,
        activo=True
    )
    
    db.add(nueva_tarifa)
    db.commit()
    db.refresh(nueva_tarifa)
    
    return nueva_tarifa

@router.put("/tarifas/{tarifa_id}", response_model=TarifaResponse)
def actualizar_tarifa(
    tarifa_id: int,
    tarifa_update: TarifaUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualiza una tarifa existente"""
    verificar_admin(current_user)
    
    tarifa = db.query(Tarifa).filter(Tarifa.id == tarifa_id).first()
    if not tarifa:
        raise HTTPException(status_code=404, detail="Tarifa no encontrada")
    
    # Actualizar solo los campos proporcionados
    update_data = tarifa_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tarifa, field, value)
    
    db.commit()
    db.refresh(tarifa)
    
    return tarifa

@router.delete("/tarifas/{tarifa_id}")
def eliminar_tarifa(
    tarifa_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Elimina una tarifa (borrado físico)"""
    verificar_admin(current_user)
    
    tarifa = db.query(Tarifa).filter(Tarifa.id == tarifa_id).first()
    if not tarifa:
        raise HTTPException(status_code=404, detail="Tarifa no encontrada")
    
    db.delete(tarifa)
    db.commit()
    
    return {"message": "Tarifa eliminada correctamente"}

@router.patch("/tarifas/{tarifa_id}/toggle")
def toggle_tarifa(
    tarifa_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Activar/desactivar una tarifa (borrado lógico)"""
    verificar_admin(current_user)
    
    tarifa = db.query(Tarifa).filter(Tarifa.id == tarifa_id).first()
    if not tarifa:
        raise HTTPException(status_code=404, detail="Tarifa no encontrada")
    
    tarifa.activo = not tarifa.activo
    db.commit()
    db.refresh(tarifa)
    
    return {"id": tarifa.id, "activo": tarifa.activo}



# ========== 5. Gestión de Empleados y Asistencia ==========
from app.models import Empleado, Asistencia
from app.schemas import EmpleadoCreate, EmpleadoUpdate, EmpleadoResponse, AsistenciaCreate, AsistenciaResponse

@router.get("/empleados", response_model=List[EmpleadoResponse])
def listar_empleados(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    activo: Optional[bool] = None
):
    """Lista todos los empleados"""
    verificar_admin(current_user)
    
    query = db.query(Empleado)
    if activo is not None:
        query = query.filter(Empleado.activo == activo)
    
    return query.all()

@router.post("/empleados", response_model=EmpleadoResponse)
def crear_empleado(
    empleado: EmpleadoCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crea un nuevo empleado"""
    verificar_admin(current_user)
    
    # Verificar email único
    existing = db.query(Empleado).filter(Empleado.email == empleado.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    nuevo_empleado = Empleado(
        nombre=empleado.nombre,
        email=empleado.email,
        puesto=empleado.puesto,
        telefono=empleado.telefono,
        direccion=empleado.direccion,
        salario=empleado.salario,
        fecha_contratacion=empleado.fecha_contratacion,
        activo=True
    )
    
    db.add(nuevo_empleado)
    db.commit()
    db.refresh(nuevo_empleado)
    
    return nuevo_empleado

@router.put("/empleados/{empleado_id}", response_model=EmpleadoResponse)
def actualizar_empleado(
    empleado_id: int,
    empleado_update: EmpleadoUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualiza un empleado existente"""
    verificar_admin(current_user)
    
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    # Actualizar solo los campos proporcionados
    update_data = empleado_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(empleado, field, value)
    
    db.commit()
    db.refresh(empleado)
    
    return empleado

@router.delete("/empleados/{empleado_id}")
def eliminar_empleado(
    empleado_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Elimina un empleado (borrado físico)"""
    verificar_admin(current_user)
    
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    db.delete(empleado)
    db.commit()
    
    return {"message": "Empleado eliminado correctamente"}

# ========== Asistencia ==========

@router.post("/empleados/{empleado_id}/asistencia", response_model=AsistenciaResponse)
def registrar_asistencia(
    empleado_id: int,
    asistencia: AsistenciaCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Registra entrada o salida de un empleado"""
    verificar_admin(current_user)
    
    # Verificar que el empleado existe
    empleado = db.query(Empleado).filter(Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    nueva_asistencia = Asistencia(
        empleado_id=empleado_id,
        tipo=asistencia.tipo,
        ubicacion=asistencia.ubicacion
    )
    
    db.add(nueva_asistencia)
    db.commit()
    db.refresh(nueva_asistencia)
    
    return nueva_asistencia

@router.get("/empleados/{empleado_id}/asistencias", response_model=List[AsistenciaResponse])
def listar_asistencias(
    empleado_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    fecha_desde: Optional[datetime] = None,
    fecha_hasta: Optional[datetime] = None
):
    """Lista las asistencias de un empleado"""
    verificar_admin(current_user)
    
    query = db.query(Asistencia).filter(Asistencia.empleado_id == empleado_id)
    
    if fecha_desde:
        query = query.filter(Asistencia.fecha_hora >= fecha_desde)
    if fecha_hasta:
        query = query.filter(Asistencia.fecha_hora <= fecha_hasta)
    
    return query.order_by(Asistencia.fecha_hora.desc()).all()

# ========== 6. Reportes ==========
from fastapi.responses import StreamingResponse
import csv
from io import StringIO
from datetime import datetime

@router.get("/reportes/envios")
def reporte_envios_csv(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    fecha_desde: Optional[datetime] = None,
    fecha_hasta: Optional[datetime] = None,
    estado: Optional[str] = None
):
    """Genera reporte de envíos en formato CSV"""
    verificar_admin(current_user)
    
    # Construir consulta
    query = db.query(Envio)
    
    if fecha_desde:
        query = query.filter(Envio.fecha_registro >= fecha_desde)
    if fecha_hasta:
        query = query.filter(Envio.fecha_registro <= fecha_hasta)
    if estado:
        query = query.filter(Envio.estado == estado)
    
    envios = query.all()
    
    # Crear archivo CSV en memoria
    output = StringIO()
    writer = csv.writer(output)
    
    # Escribir encabezados
    writer.writerow([
        "ID", "Número de Guía", "Usuario ID", "Origen", "Destino",
        "Peso (kg)", "Tipo Servicio", "Estado", "Costo", 
        "Remitente", "Destinatario", "Fecha Registro", "Fecha Entrega"
    ])
    
    # Escribir datos
    for envio in envios:
        writer.writerow([
            envio.id,
            envio.numero_guia,
            envio.usuario_id or "N/A",
            envio.origen,
            envio.destino,
            envio.peso,
            envio.tipo_servicio,
            envio.estado,
            envio.costo,
            envio.remitente_nombre,
            envio.destinatario_nombre,
            envio.fecha_registro.strftime("%Y-%m-%d %H:%M") if envio.fecha_registro else "",
            envio.fecha_entrega.strftime("%Y-%m-%d %H:%M") if envio.fecha_entrega else ""
        ])
    
    # Preparar respuesta
    output.seek(0)
    filename = f"reporte_envios_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reportes/clientes")
def reporte_clientes_csv(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Genera reporte de clientes en formato CSV"""
    verificar_admin(current_user)
    
    clientes = db.query(Usuario).filter(Usuario.rol == "cliente").all()
    
    # Crear archivo CSV en memoria
    output = StringIO()
    writer = csv.writer(output)
    
    # Escribir encabezados
    writer.writerow([
        "ID", "Nombre", "Email", "Teléfono", "Dirección", 
        "Activo", "Fecha Registro"
    ])
    
    # Escribir datos
    for cliente in clientes:
        writer.writerow([
            cliente.id,
            cliente.nombre,
            cliente.email,
            cliente.telefono or "N/A",
            cliente.direccion or "N/A",
            "Sí" if cliente.activo else "No",
            cliente.fecha_registro.strftime("%Y-%m-%d %H:%M") if cliente.fecha_registro else ""
        ])
    
    output.seek(0)
    filename = f"reporte_clientes_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reportes/ingresos")
def reporte_ingresos_csv(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
    fecha_desde: Optional[datetime] = None,
    fecha_hasta: Optional[datetime] = None
):
    """Genera reporte de ingresos en formato CSV"""
    verificar_admin(current_user)
    
    query = db.query(Envio)
    
    if fecha_desde:
        query = query.filter(Envio.fecha_registro >= fecha_desde)
    if fecha_hasta:
        query = query.filter(Envio.fecha_registro <= fecha_hasta)
    
    envios = query.all()
    
    # Calcular estadísticas
    total_ingresos = sum(e.costo for e in envios)
    total_envios = len(envios)
    ingresos_por_tipo = {}
    ingresos_por_dia = {}
    
    for envio in envios:
        # Por tipo de servicio
        tipo = envio.tipo_servicio
        ingresos_por_tipo[tipo] = ingresos_por_tipo.get(tipo, 0) + envio.costo
        
        # Por día
        dia = envio.fecha_registro.strftime("%Y-%m-%d")
        ingresos_por_dia[dia] = ingresos_por_dia.get(dia, 0) + envio.costo
    
    # Crear archivo CSV en memoria
    output = StringIO()
    writer = csv.writer(output)
    
    # Resumen general
    writer.writerow(["REPORTE DE INGRESOS"])
    writer.writerow(["Fecha generación", datetime.now().strftime("%Y-%m-%d %H:%M:%S")])
    writer.writerow(["Total de envíos", total_envios])
    writer.writerow(["Total de ingresos", f"${total_ingresos:,.2f}"])
    writer.writerow([])
    
    # Ingresos por tipo de servicio
    writer.writerow(["INGRESOS POR TIPO DE SERVICIO"])
    writer.writerow(["Tipo de Servicio", "Ingresos"])
    for tipo, monto in ingresos_por_tipo.items():
        writer.writerow([tipo, f"${monto:,.2f}"])
    
    writer.writerow([])
    
    # Ingresos por día
    writer.writerow(["INGRESOS POR DÍA"])
    writer.writerow(["Fecha", "Ingresos"])
    for dia, monto in sorted(ingresos_por_dia.items()):
        writer.writerow([dia, f"${monto:,.2f}"])
    
    output.seek(0)
    filename = f"reporte_ingresos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )