import { AuroraDataService, UuidGeneratorService } from 'shared';
import { Product } from '../domain/product.entity';
import { IProductRepository } from '../domain/product.repository';

export class ProductRepository implements IProductRepository {
  constructor(
    private databaseService: AuroraDataService,
    private idGenerator: UuidGeneratorService
  ) {}

  async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const id = this.idGenerator.generate();
    
    const sql = `
      INSERT INTO products (id, name, description, price, stock)
      VALUES (:id, :name, :description, :price, :stock)
      RETURNING id, name, description, price, stock, created_at
    `;
    
    const parameters = [
      { name: 'id', value: { stringValue: id } },
      { name: 'name', value: { stringValue: product.name } },
      { name: 'description', value: { stringValue: product.description } },
      { name: 'price', value: { doubleValue: product.price } },
      { name: 'stock', value: { longValue: product.stock } }
    ];

    const result = await this.databaseService.executeQuery<any>(sql, parameters);
    return this.mapToProduct(result[0]);
  }

  async findAll(): Promise<Product[]> {
    const sql = 'SELECT id, name, description, price, stock, created_at FROM products ORDER BY created_at DESC';
    const result = await this.databaseService.executeQuery<any>(sql);
    return result.map((row: any) => this.mapToProduct(row));
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM products WHERE id = :id';
    const parameters = [{ name: 'id', value: { stringValue: id } }];
    
    const result = await this.databaseService.executeStatement(sql, parameters);
    return result.numberOfRecordsUpdated > 0;
  }

  private mapToProduct(row: any): Product {
    return {
      id: row[0].stringValue,
      name: row[1].stringValue,
      description: row[2].stringValue,
      price: row[3].doubleValue,
      stock: row[4].longValue,
      createdAt: row[5].stringValue
    };
  }
}