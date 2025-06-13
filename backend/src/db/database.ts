import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || './db/fintrack.sqlite';
const dbDir = path.dirname(dbPath);

/**
 * Asegura que el directorio de la base de datos exista
 */
const ensureDbDirectory = async (): Promise<void> => {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`📁 Directorio de base de datos creado: ${dbDir}`);
  }
};

/**
 * Inicializa las tablas de la base de datos
 */
const createTables = async (db: Database): Promise<void> => {
  console.log('🔧 Creando tablas si no existen...');
  
  // Tabla de Categorías de Activos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS asset_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      target_percentage REAL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Tabla de Activos
  await db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      platform TEXT,
      current_value REAL NOT NULL,
      initial_value REAL NOT NULL,
      currency TEXT DEFAULT 'EUR',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES asset_categories (id)
    )
  `);
  
  // Tabla de Histórico de Valores
  await db.exec(`
    CREATE TABLE IF NOT EXISTS asset_values (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_id INTEGER NOT NULL,
      value REAL NOT NULL,
      date TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (asset_id) REFERENCES assets (id)
    )
  `);

  console.log('✅ Tablas creadas correctamente');
};

/**
 * Inserta categorías predeterminadas si no existen en la base de datos
 */
const insertDefaultCategories = async (db: Database): Promise<void> => {
  const categories = [
    { name: 'Efectivo', target_percentage: 10 },
    { name: 'Renta Variable', target_percentage: 40 },
    { name: 'Criptomonedas', target_percentage: 5 },
    { name: 'Inmobiliario', target_percentage: 35 },
    { name: 'Renta Fija', target_percentage: 10 }
  ];

  console.log('🔄 Verificando categorías predeterminadas...');
  
  const stmt = await db.prepare('INSERT OR IGNORE INTO asset_categories (name, target_percentage) VALUES (?, ?)');
  
  for (const category of categories) {
    await stmt.run(category.name, category.target_percentage);
  }
  
  await stmt.finalize();
  console.log('✅ Categorías predeterminadas verificadas');
};

/**
 * Inicializa la conexión a la base de datos
 */
let dbInstance: Database | null = null;

export const getDatabase = async (): Promise<Database> => {
  if (dbInstance) return dbInstance;

  await ensureDbDirectory();
  
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  return dbInstance;
};

/**
 * Inicializa la base de datos completa
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const db = await getDatabase();
    await createTables(db);
    await insertDefaultCategories(db);
    console.log('🚀 Base de datos inicializada con éxito');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
};

/**
 * Cierra la conexión a la base de datos
 */
export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log('🔒 Conexión a la base de datos cerrada');
  }
};
