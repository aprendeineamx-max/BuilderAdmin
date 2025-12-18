# 🏫 INEA.mx - Plataforma LMS con Tutores IA

> **Sistema de Gestión de Aprendizaje** para el Instituto Nacional para la Educación de los Adultos

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-Private-blue.svg)]()

---

## 📋 Descripción

Plataforma educativa integrada con **Inteligencia Artificial** para generar contenido educativo automáticamente y proporcionar tutores virtuales en tiempo real.

### 🎯 Características Principales

- **🤖 Tutores IA** - Generación automática de clases usando Gemini, Groq y SambaNova
- **📊 Panel de Administración** - Dashboard Next.js para gestionar infraestructura VPS
- **🔄 Automatización n8n** - Flujos de trabajo para generación de contenido
- **🗄️ Backend Directus** - CMS headless con PostgreSQL
- **🔒 Alta Disponibilidad** - Sistema Mirror con 3 VPS

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        INEA.mx Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│   │ VPS Support │   │  VPS Main   │   │ VPS Mirror  │          │
│   │  (2GB RAM)  │   │ (12GB RAM)  │   │ (12GB RAM)  │          │
│   ├─────────────┤   ├─────────────┤   ├─────────────┤          │
│   │ • n8n       │   │ • Directus  │   │ • Directus  │          │
│   │ • VPS Panel │   │ • PostgreSQL│   │ • PostgreSQL│          │
│   │ • Dokploy   │   │ • Redis     │   │ • Backup    │          │
│   └─────────────┘   └─────────────┘   └─────────────┘          │
│           │                 │                 │                 │
│           └────────────┬────┴─────────────────┘                 │
│                        │                                        │
│              ┌─────────▼─────────┐                              │
│              │   AI Services    │                               │
│              │  Gemini | Groq   │                               │
│              │    SambaNova     │                               │
│              └──────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| **Frontend** | Next.js 16 |
| **Backend API** | Directus CMS |
| **Base de Datos** | PostgreSQL + PostGIS |
| **Cache** | Redis |
| **Automatización** | n8n |
| **Contenedores** | Docker + Dokploy |
| **IA** | Google Gemini, Groq, SambaNova |

---

## 📁 Estructura del Proyecto

```
inea.mx/
├── vps-manager/              # Panel de administración Next.js
│   ├── src/
│   │   ├── app/api/          # API Routes (status, backup)
│   │   └── components/       # React Components
│   ├── vps-config.ts         # Configuración de servidores
│   └── Dockerfile
├── manage_vps.js             # CLI para gestión VPS
├── n8n_bridge.js             # Bridge API para n8n
├── workflow_gemini_class.json # Workflow generador de clases
└── README.md
```

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 20+
- Docker
- Acceso SSH a los VPS

### Configuración Local

```bash
# Clonar repositorio
git clone https://github.com/aprendeineamx-max/BuilderAdmin.git
cd BuilderAdmin

# Instalar dependencias del panel
cd vps-manager
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Iniciar en desarrollo
npm run dev
```

---

## 🔗 URLs de Servicios

| Servicio | URL | Puerto |
|----------|-----|--------|
| VPS Manager Panel | http://216.238.70.204:3005 | 3005 |
| n8n Workflows | http://216.238.70.204:5678 | 5678 |
| Directus CMS | http://64.177.81.23:8055 | 8055 |
| Dokploy Support | http://216.238.70.204:3000 | 3000 |
| Dokploy Main | http://64.177.81.23:3000 | 3000 |

---

## 📖 Documentación

- [Guía de Arquitectura](./docs/ARCHITECTURE.md)
- [Integración de APIs](./docs/INTEGRATION.md)
- [Configuración de IA](./docs/AI_SETUP.md)

---

## 🤝 Contribución

Este es un proyecto privado. Para contribuir, contacta al equipo de desarrollo.

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2025 INEA.mx

---

> **Desarrollado con ❤️ para la educación de adultos en México**
