import { AuroraDataService, UuidGeneratorService } from 'shared-utils';
import { Product } from '../domain/product.entity';
import { IProductRepository } from '../domain/product.repository';

export class ProductRepository implements IProductRepository {
  constructor(
    private databaseService: AuroraDataService,
    private idGenerator: UuidGeneratorService
  ) {}

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = this.idGenerator.generate();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO products (id, name, description, price, category, stock, created_at, updated_at)
      VALUES (:id, :name, :description, :price, :category, :stock, :createdAt, :updatedAt)
      RETURNING id, name, description, price, category, stock, created_at, updated_at
    `;
    
    const parameters = [
      { name: 'id', value: { stringValue: id } },
      { name: 'name', value: { stringValue: product.name } },
      { name: 'description', value: { stringValue: product.description } },
      { name: 'price', value: { doubleValue: product.price } },
      { name: 'category', value: { stringValue: product.category } },
      { name: 'stock', value: { longValue: product.stock } },
      { name: 'createdAt', value: { stringValue: now } },
      { name: 'updatedAt', value: { stringValue: now } }
    ];

    const result = await this.databaseService.executeQuery<Product>(sql, parameters);
    return this.mapToProduct(result[0]);
  }

  async findById(id: string): Promise<Product | null> {
    const sql = 'SELECT id, name, description, price, category, stock, created_at, updated_at FROM products WHERE id = :id';
    const parameters = [{ name: 'id', value: { stringValue: id } }];
    
    const result = await this.databaseService.executeQuery<Product>(sql, parameters);
    return result.length > 0 ? this.mapToProduct(result[0]) : null;
  }

  async findAll(): Promise<Product[]> {
    const sql = 'SELECT id, name, description, price, category, stock, created_at, updated_at FROM products ORDER BY created_at DESC';
    const result = await this.databaseService.executeQuery<Product>(sql);
    return result.map((product: Product) => this.mapToProduct(product));
  }

  async findByCategory(category: string): Promise<Product[]> {
    const sql = 'SELECT id, name, description, price, category, stock, created_at, updated_at FROM products WHERE category = :category ORDER BY created_at DESC';
    const parameters = [{ name: 'category', value: { stringValue: category } }];
    
    const result = await this.databaseService.executeQuery<Product>(sql, parameters);
    return result.map((product: Product) => this.mapToProduct(product));
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updateFields: string[] = [];
    const parameters: any[] = [{ name: 'id', value: { stringValue: id } }];

    if (product.name) {
      updateFields.push('name = :name');
      parameters.push({ name: 'name', value: { stringValue: product.name } });
    }
    if (product.description) {
      updateFields.push('description = :description');
      parameters.push({ name: 'description', value: { stringValue: product.description } });
    }
    if (product.price !== undefined) {
      updateFields.push('price = :price');
      parameters.push({ name: 'price', value: { doubleValue: product.price } });
    }
    if (product.category) {
      updateFields.push('category = :category');
      parameters.push({ name: 'category', value: { stringValue: product.category } });
    }
    if (product.stock !== undefined) {
      updateFields.push('stock = :stock');
      parameters.push({ name: 'stock', value: { longValue: product.stock } });
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    updateFields.push('updated_at = :updatedAt');
    parameters.push({ name: 'updatedAt', value: { stringValue: new Date().toISOString() } });

    const sql = `
      UPDATE products 
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING id, name, description, price, category, stock, created_at, updated_at
    `;

    const result = await this.databaseService.executeQuery<Product>(sql, parameters);
    return result.length > 0 ? this.mapToProduct(result[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM products WHERE id = :id';
    const parameters = [{ name: 'id', value: { stringValue: id } }];
    
    const result = await this.databaseService.executeStatement(sql, parameters);
    return result.numberOfRecordsUpdated > 0;
  }

  async updateStock(id: string, stock: number): Promise<Product | null> {
    const sql = `
      UPDATE products 
      SET stock = :stock, updated_at = :updatedAt
      WHERE id = :id
      RETURNING id, name, description, price, category, stock, created_at, updated_at
    `;
    
    const parameters = [
      { name: 'id', value: { stringValue: id } },
      { name: 'stock', value: { longValue: stock } },
      { name: 'updatedAt', value: { stringValue: new Date().toISOString() } }
    ];

    const result = await this.databaseService.executeQuery<Product>(sql, parameters);
    return result.length > 0 ? this.mapToProduct(result[0]) : null;
  }

  private mapToProduct(row: any): Product {
    return {
      id: row[0].stringValue,
      name: row[1].stringValue,
      description: row[2].stringValue,
      price: row[3].doubleValue,
      category: row[4].stringValue,
      stock: row[5].longValue,
      createdAt: row[6].stringValue,
      updatedAt: row[7].stringValue
    };
  }
}
