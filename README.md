# FinTrack AI

Una aplicación personal de seguimiento y análisis de inversiones financieras. Monitoriza tu cartera, simula escenarios futuros y recibe recomendaciones inteligentes basadas en datos para hacer crecer tu patrimonio.

## Descripción

FinTrack AI es una herramienta diseñada para inversores individuales que desean tener un control completo de sus activos financieros. Basada en la estructura del marco de gestión de activos, permite seguir diferentes categorías de inversiones (efectivo, renta variable, criptomonedas, inmobiliario, etc.) y analizar su evolución en el tiempo.

### Características principales

- 📊 **Registro de activos por categoría**: Gestiona diferentes tipos de activos con sus propiedades específicas.
- 📈 **Evolución temporal**: Visualiza cómo cambia el valor de tus inversiones a lo largo del tiempo.
- 💹 **Cálculo de rendimientos**: Analiza ganancias/pérdidas acumuladas y por período.
- 🎯 **Distribución actual vs. objetivo**: Compara tu asignación de activos con tu estrategia ideal.
- ⚠️ **Alertas de rebalanceo**: Recibe notificaciones cuando tu cartera se desvía de tus objetivos.
- 📝 **Importación/Exportación**: Compatibilidad con Excel para migrar datos existentes.

## Tecnologías

- **Frontend**: React con TypeScript
- **Backend**: Node.js con Express
- **Base de datos**: SQLite
- **Gráficos**: Recharts/Chart.js

## Estructura del proyecto

```
fintrack-ai/
├── frontend/         # Aplicación React
├── backend/          # API REST con Express
└── docs/             # Documentación
    ├── development-workflow.md  # Flujos de desarrollo y CI/CD
    └── ui-best-practices.md     # Buenas prácticas de UI
```

## Instalación

### Requisitos previos

- Node.js (v16+)
- npm o yarn

### Configuración

1. Clonar el repositorio
```bash
git clone https://github.com/yourusername/fintrack-ai.git
cd fintrack-ai
```

2. Instalar dependencias del backend
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

4. Iniciar el backend (desde la carpeta backend)
```bash
npm run dev
```

5. Iniciar el frontend (desde la carpeta frontend)
```bash
npm start
```

## Licencia

MIT
