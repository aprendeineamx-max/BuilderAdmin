# 🚀 INEA.mx LMS - Roadmap Expandido (Ultra Proyecto)
> **Actualizado:** 19 Diciembre 2025  
> **Versión:** 2.0 - Roadmap Completo

---

## 📊 Vista General del Proyecto

```mermaid
gantt
    title INEA.mx LMS - Roadmap 2024-2025
    dateFormat  YYYY-MM-DD
    section Fundación
    Fase 1: Infra Base       :done, f1, 2024-12-01, 15d
    Fase 2: Backend + AI     :done, f2, 2024-12-16, 5d
    section Core
    Fase 3: Frontend LMS     :active, f3, 2024-12-19, 14d
    Fase 4: Contenido Masivo :f4, after f3, 7d
    section Expansión
    Fase 5: Autenticación    :f5, after f4, 5d
    Fase 6: Producción       :f6, after f5, 10d
    section Avanzado
    Fase 7: Analytics        :f7, after f6, 7d
    Fase 8: Mobile App       :f8, after f7, 14d
    section Premium
    Fase 9: Monetización     :f9, after f8, 7d
    Fase 10: AI Avanzada     :f10, after f9, 14d
```

---

## ✅ FASES COMPLETADAS

### Fase 1: Fundación ✅ 100%
- [x] Infraestructura 3-VPS (Support, Main, Mirror)
- [x] VPS Manager Panel (http://216.238.70.204:3005)
- [x] n8n Automation (4 workflows)
- [x] Directus CMS + PostgreSQL + Redis
- [x] Alta Disponibilidad (Mirror VPS)
- [x] GitHub Repo BuilderAdmin

### Fase 2: Backend + AI ✅ 100%
- [x] Supabase instalado (Studio :3001, API :8000)
- [x] Tabla clases_generadas configurada
- [x] Chat Tutor API con Groq (Llama 3.3 70B)
- [x] Integración SambaNova para generación
- [x] API keys seguras (.env.local)
- [x] Documentación completa (secrets.md)

---

## 🔄 FASES EN PROGRESO

### Fase 3: Frontend LMS 🔄 85%

**Estado actual:**
- [x] Landing Page (dark premium theme)
- [x] Login/Register (UI completa)
- [x] Dashboard con progreso
- [x] Chat Tutor interactivo
- [x] Cursos con filtros (Supabase)
- [x] Clase View dinámica
- [ ] Perfil de usuario
- [ ] Sistema de progreso real
- [ ] Quizzes interactivos funcionales

**Próximas mejoras:**
- [ ] Animaciones y transiciones
- [ ] Dark/Light mode toggle
- [ ] Diseño responsive mejorado
- [ ] PWA support (offline mode)

---

## 📋 FASES PENDIENTES

### Fase 4: Contenido Educativo Masivo ⏳

**Objetivo:** Biblioteca completa de clases INEA

**Módulos a crear:**

| Módulo | Clases | Prioridad |
|--------|--------|-----------|
| Matemáticas | 20 | 🔴 Alta |
| Lectura/Escritura | 15 | 🔴 Alta |
| Ciencias Naturales | 12 | 🟠 Media |
| Ciencias Sociales | 12 | 🟠 Media |
| Formación Cívica | 8 | 🟡 Baja |
| Educación Financiera | 6 | 🟡 Baja |

**Tareas:**
- [ ] Script batch para generación masiva
- [ ] Template JSON estandarizado para clases
- [ ] Sistema de versionado de contenido
- [ ] Editor de contenido para admin
- [ ] Quizzes auto-generados por IA
- [ ] Recursos multimedia (imágenes, audio)

---

### Fase 5: Autenticación y Usuarios ⏳

**Objetivo:** Sistema de usuarios completo

**Tareas:**
- [ ] Supabase Auth integrado en frontend
- [ ] Registro con email verification
- [ ] Login social (Google, Facebook)
- [ ] Roles: estudiante, tutor, admin
- [ ] Perfil de usuario editable
- [ ] Sistema de progreso por estudiante
- [ ] Historial de clases completadas
- [ ] Certificados digitales

**Tabla usuarios Supabase:**
```sql
CREATE TABLE usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nombre text NOT NULL,
  nivel text DEFAULT 'primaria',
  progreso jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
```

---

### Fase 6: Producción y Deployment ⏳

**Objetivo:** Sistema listo para usuarios reales

**Infraestructura:**
- [ ] Dominio personalizado (aprendeinea.mx)
- [ ] SSL/TLS con Let's Encrypt
- [ ] Nginx reverse proxy
- [ ] Docker Compose para frontend
- [ ] CI/CD con GitHub Actions
- [ ] Auto-deploy en push a main

**Performance:**
- [ ] CDN para assets (Cloudflare)
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading de componentes

**Monitoreo:**
- [ ] Uptime monitoring
- [ ] Error tracking (Sentry)
- [ ] Logs centralizados

---

### Fase 7: Analytics y Reportes ⏳

**Objetivo:** Métricas para toma de decisiones

**Dashboard Admin:**
- [ ] Usuarios activos (diario/semanal)
- [ ] Clases más populares
- [ ] Tiempo promedio por clase
- [ ] Tasa de completación de cursos
- [ ] Preguntas frecuentes al tutor
- [ ] Performance del Chat IA

**Tablas para analytics:**
```sql
CREATE TABLE eventos_usuario (
  id serial PRIMARY KEY,
  usuario_id uuid REFERENCES usuarios(id),
  tipo text NOT NULL, -- 'clase_vista', 'quiz_completado', 'chat_mensaje'
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE sesiones (
  id serial PRIMARY KEY,
  usuario_id uuid REFERENCES usuarios(id),
  inicio timestamptz NOT NULL,
  fin timestamptz,
  paginas_visitadas jsonb
);
```

---

### Fase 8: Aplicación Móvil ⏳

**Objetivo:** App nativa para Android/iOS

**Tecnología:** React Native + Expo

**Funcionalidades:**
- [ ] Todas las funciones del web
- [ ] Notificaciones push
- [ ] Modo offline (descargar clases)
- [ ] Audio de lecciones
- [ ] Reconocimiento de voz para tutor
- [ ] Widgets de progreso

**Publicación:**
- [ ] Google Play Store
- [ ] Apple App Store
- [ ] APK directa para Android

---

### Fase 9: Monetización (Opcional) ⏳

**Objetivo:** Modelo de sostenibilidad

**Opciones:**
1. **Freemium:**
   - Básico: 5 clases/mes gratis
   - Premium: Acceso ilimitado
   
2. **Institucional:**
   - Licencias para escuelas
   - Reportes personalizados
   
3. **Certificaciones:**
   - Certificado básico: gratis
   - Certificado verificado: con costo

**Integraciones de pago:**
- [ ] Stripe (tarjetas)
- [ ] MercadoPago (México)
- [ ] PayPal

---

### Fase 10: IA Avanzada ⏳

**Objetivo:** Features de IA de siguiente nivel

**Funcionalidades:**
- [ ] **Tutor adaptativo:** Ajusta dificultad según estudiante
- [ ] **Generación de exámenes:** Crea evaluaciones personalizadas
- [ ] **Análisis de escritura:** Retroalimentación en redacción
- [ ] **Reconocimiento de voz:** Dictado y pronunciación
- [ ] **Resúmenes automáticos:** De lecciones largas
- [ ] **Traducción:** Contenido en lenguas indígenas

**Modelos a integrar:**
- Groq Whisper (voz a texto)
- Gemini Pro Vision (análisis de imágenes)
- Claude Sonnet (análisis profundo)

---

## 🎯 MEJORAS CONTINUAS

### UX/UI
- [ ] Animaciones de micro-interacción
- [ ] Temas personalizables
- [ ] Accesibilidad WCAG 2.1
- [ ] Soporte para lectores de pantalla
- [ ] Alto contraste

### Performance
- [ ] Server-side rendering optimizado
- [ ] Edge functions para APIs
- [ ] WebSocket para chat en tiempo real
- [ ] Caché inteligente

### Seguridad
- [ ] Rate limiting
- [ ] CAPTCHA en registro
- [ ] 2FA opcional
- [ ] Auditoría de accesos
- [ ] Backup automático diario

---

## 📅 Timeline Estimado

| Fase | Duración | Fecha Estimada |
|------|----------|----------------|
| 3. Frontend | 2 semanas | Dic 2024 |
| 4. Contenido | 1 semana | Ene 2025 |
| 5. Auth | 5 días | Ene 2025 |
| 6. Producción | 10 días | Ene 2025 |
| 7. Analytics | 1 semana | Feb 2025 |
| 8. Mobile | 2 semanas | Feb-Mar 2025 |
| 9. Monetización | 1 semana | Mar 2025 |
| 10. IA Avanzada | 2 semanas | Mar-Abr 2025 |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend Web | Next.js 15, TypeScript, Tailwind |
| Frontend Mobile | React Native, Expo |
| Backend API | Supabase, Next.js API Routes |
| Base de Datos | PostgreSQL (Supabase) |
| Autenticación | Supabase Auth |
| AI Chat | Groq (Llama 3.3 70B) |
| AI Generación | SambaNova (Llama 3.3 70B) |
| Workflows | n8n |
| CMS | Directus |
| Hosting | VPS (Vultr), Docker |
| CI/CD | GitHub Actions |
| CDN | Cloudflare |

---

## 📞 Recursos Actuales

| Recurso | URL |
|---------|-----|
| Frontend Dev | http://localhost:3000 |
| VPS Panel | http://216.238.70.204:3005 |
| n8n | http://216.238.70.204:5678 |
| Supabase Studio | http://64.177.81.23:3001 |
| Supabase API | http://64.177.81.23:8000 |
| GitHub | github.com/aprendeineamx-max/BuilderAdmin |

---

> **Nota:** Este roadmap es flexible. Las prioridades pueden cambiar según feedback de usuarios y necesidades del proyecto.
