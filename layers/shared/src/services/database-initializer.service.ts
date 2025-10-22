import { AuroraDataService } from './aurora-data.service';

export class DatabaseInitializer {
  private databaseService: AuroraDataService;

  constructor() {
    this.databaseService = new AuroraDataService();
  }

  async initializeTables(): Promise<void> {
    try {
      console.log('Initializing database tables...');

      // Create users table
      await this.createUsersTable();
      console.log('✅ Users table created');

      // Create products table
      await this.createProductsTable();
      console.log('✅ Products table created');

      console.log('🎉 Database initialization completed successfully!');
    } catch (error) {
      console.error('❌ Error initializing database:', error);
      throw error;
    }
  }

  private async createUsersTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await this.databaseService.executeStatement(sql);
  }

  private async createProductsTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await this.databaseService.executeStatement(sql);
  }
}