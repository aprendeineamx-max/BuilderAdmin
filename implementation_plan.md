# Arquitectura Definitiva: Dual-VPS & AI Learning Ecosystem

Incorporamos el nuevo **VPS NVMe de 12GB RAM** para crear una infraestructura de nivel empresarial, dividiendo cargas para máxima estabilidad.

## 1. Estrategia Multi-Servidor

| Servidor | Rol | Especificaciones | Servicios Instalados (Docker/Dokploy) |
| :--- | :--- | :--- | :--- |
| **VPS 1 (Support)** | Automatización y Soporte | 2GB RAM / 1 vCPU | • **n8n:** Orquestador de flujos de IA.<br>• **Chatwoot:** Chat de soporte omnicanal.<br>• **Redis:** Cache compartido simple. |
| **VPS 2 (Main)** | **LMS Core & AI Brain** | **12GB RAM / 4 vCPU** | • **PostgreSQL:** DB Principal (Cursos, Usuarios).<br>• **Directus:** Backend Headless y API LMS.<br>• **Next.js:** Frontend del alumno (Diseño Premium).<br>• **AI Workers (Python):** Agentes Gemini/Groq generando clases. |

## 2. Integración de Agentes con IA ("AI Tutors")
Utilizaremos tus llaves (Gemini, Groq, OpenRouter, BrowserUse) para crear **"Agentes Activos"** dentro del LMS.

### Flujo de Trabajo del "Maestro Virtual":
1.  **Generación de Contenido:** El *Agente Creador* (usando n8n en VPS 1 + Gemini Pro en VPS 2) monitorea tendencias o recibe un temario.
2.  **Creación de Clases:** Genera automáticamente:
    *   Texto de la lección (Markdown en Directus).
    *   Quizzes de evaluación.
    *   Busca referencias externas usando **BrowserUse**.
3.  **Tutoría en Tiempo Real:** Un chat embebido en Next.js conecta con el **Agente Tutor** (Groq Llama 3 para velocidad) que conoce el contexto exacto de la lección que el alumno está viendo.

## 3. Gestión de Secretos (API Keys)
> [!IMPORTANT]
> Tus API Keys serán inyectadas como **Variables de Entorno** en Dokploy (VPS 2). Nunca se guardarán en código plano.
> *   `GOOGLE_API_KEY`
> *   `GROQ_API_KEY`
> *   `BROWSER_USE_KEY`

## 4. Próximos Pasos (Inmediatos)
1.  **Provisionar VPS 2 (Main):** Instalar Docker + Dokploy en el servidor de 12GB RAM.
2.  **Actualizar Panel Local:** Modificar `manage_vps.js` para controlar ambos servidores (`npm start connect main` / `npm start connect support`).
3.  **Desplegar Stack Base:** Instalar n8n en VPS 1 y Directus en VPS 2.

---
## 5. Panel de Gestión Unificado (User Request)
**Objetivo:** Crear una interfaz web propia (usando Next.js + API Node) para gestionar la infraestructura sin tocar la terminal.

### Funcionalidades:
1.  **Dashboard Multi-Servidor:** Ver estado (CPU/RAM/Disco) de Support, Main y Mirror.
2.  **Gestor de Backups:**
    *   Botón "Backup Completo" (Todo el VPS).
    *   Botón "Backup Selectivo" (Solo DB, Solo n8n, etc.).
    *   Selector de Ruta de Descarga Personalizada.
3.  **Clonación Inteligente:**
    *   Botón "Clonar Main a Mirror" (Ejecuta todo el proceso realizado manualmente hoy).
4.  **Terminal Web (Opcional):** Ejecutar comandos simples desde el navegador.

### Stack Tecnológico:
*   **Frontend:** Next.js (Dashboard Admin).
*   **Backend:** Node.js Express (Ejecutándose en VPS Support o Main) con acceso SSH Keys a los otros nodos.
*   **Seguridad:** Autenticación vía NextAuth (integrado con usuarios de Directus).

---
**Plan validado.** VPS 3 clonado exitosamente. Procediendo a diseñar el Panel.

## 6. Entregables Completados (Fase IA)
### [NEW] [n8n_bridge.js](file:///C:/Users/Administrator/Desktop/inea.mx/n8n_bridge.js)
- Script de control CLI para n8n (API Bridge).
### [NEW] [workflow_gemini_class.json](file:///C:/Users/Administrator/Desktop/inea.mx/workflow_gemini_class.json)
- Cerebro IA "Class Generator" configurado y validado.


