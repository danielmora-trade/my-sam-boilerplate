import { Product } from './product.entity';

export interface IProductRepository {
  create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<boolean>;
}