import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Patrón de Diseño: Singleton
 * Garantiza una única instancia del cliente de Prisma ORM (PrismaClient)
 * a lo largo de todo el ciclo de vida del servidor.
 */
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    Database.instance = this;
  }

  /**
   * Obtiene la instancia única de Database
   * @returns {Database}
   */
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Retorna el cliente de Prisma ORM
   * @returns {PrismaClient}
   */
  get client() {
    return this.prisma;
  }

  /**
   * Cierra la conexión de Prisma ordenadamente
   */
  async close() {
    await this.prisma.$disconnect();
  }
}

export default Database;
