import { Product } from "./product.entity";

export interface IProductRepository {
    create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    findByCategory(category: string): Promise<Product[]>;
    update(id: string, product: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<boolean>;
    updateStock(id: string, stock: number): Promise<Product | null>;
}