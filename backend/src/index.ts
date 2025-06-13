import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/database';
import assetRoutes from './routes/assetRoutes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/assets', assetRoutes);

// Ruta de estado
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'FinTrack API operativa' });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    await initializeDatabase();
    const server = app.listen(port, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${port}`);
      console.log(`📊 API de FinTrack disponible en http://localhost:${port}/api`);
    });
    return server;
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

// Iniciar el servidor si este archivo es ejecutado directamente
if (require.main === module) {
  startServer();
}

// Exportar app y startServer
export { app, startServer };
export default app;
