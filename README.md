# ArtLab

Suite de generación de arte con IA. Dashboard React + Backend SDXL/Qwen en Colab.

## Estructura

```
artlab-dashboard/    → Frontend React + TypeScript + Vite
notebooks/           → Backend Colab (FastAPI + SDXL + Qwen GGUF)
```

## Dashboard

```bash
cd artlab-dashboard
npm install
npm run dev
```

Requiere Node 18+. Corre en `http://localhost:5173`.

Configura la URL del backend en Settings → Conexión (o en `.env` como `VITE_API_URL`).

## Backend (Colab)

1. Abre `notebooks/artlab_backend.ipynb` en Google Colab
2. Runtime → Cambiar tipo → **T4 GPU**
3. Ejecuta todo
4. Copia la URL de ngrok
5. Pégala en el Dashboard → Settings → Conexión

### Modelos

| Componente | Modelo | Formato |
|-----------|--------|---------|
| Generación | SDXL 1.0 (Balanced-AiO merge) | `.safetensors` (6.46 GB) |
| Chat | Qwen 2.5 7B Instruct | GGUF (Q4_K_M, ~4.5 GB) |

Los modelos se descargan automáticamente desde HuggingFace o Drive.
VRAM Manager gestiona el swap (solo un modelo activo en T4 16 GB).

## Endpoints del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servidor y modelos |
| GET | `/system` | Recursos (RAM/VRAM/Disk) |
| GET | `/models` | Lista de modelos |
| POST | `/models/{id}/load` | Cargar modelo en VRAM |
| POST | `/models/{id}/unload` | Descargar modelo |
| POST | `/chat` | Chat con Qwen |
| POST | `/generate` | Generar imagen con SDXL |
| POST | `/sync/push` | Sincronizar datos |
| GET | `/sync/pull` | Obtener datos sincronizados |
| WS | `/sync/ws` | WebSocket para sync en tiempo real |
