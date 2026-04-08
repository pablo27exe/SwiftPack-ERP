# SwiftPack ERP

## Cada integrante hace esto UNA SOLA VEZ
- git clone https://github.com/tu-usuario/swiftpack-erp.git
- cd swiftpack-erp
- docker-compose up --build

  

## Iniciar backend 
```bash 
cd backend-fastapi 
venv\Scripts\activate 
uvicorn app.main:app --reload --port 8000 
``` 
 
## Iniciar frontend 
```bash 
cd frontend-react 
npm run dev 
```

# 1. Asegurarse de tener la última versión
git pull origin main

# 2. Crear rama para su feature
git checkout -b feature/cotizacion

# 3. Editar código (crear sus páginas en React)
- Usar Cursor o su editor de código favorito
- Los cambios se guardan en su computadora NORMALMENTE

# 4. Mientras desarrolla, Docker sigue corriendo
- El frontend se actualiza automáticamente (hot reload)
- Solo guardar el archivo y ver el cambio en el navegador

# 5. Cuando termina la página, sube sus cambios
git add .
git commit -m "Agrega página de cotización con formulario"
git push origin feature/cotizacion

# 6. Crear Pull Request en GitHub (desde la web)
 Pablo revisa y hace merge a main
