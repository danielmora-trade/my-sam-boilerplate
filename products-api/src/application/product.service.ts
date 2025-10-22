import { Product } from '../domain/product.entity';
import { IProductRepository } from '../domain/product.repository';

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async createProduct(request: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    // Validate required fields
    if (!request.name || !request.description || !request.category) {
      throw new Error('Name, description, and category are required');
    }

    // Validate price
    if (request.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Validate stock
    if (request.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return await this.productRepository.create({
      name: request.name,
      description: request.description,
      price: request.price,
      category: request.category,
      stock: request.stock
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!id) {
      throw new Error('Product ID is required');
    }
    return await this.productRepository.findById(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!category) {
      throw new Error('Category is required');
    }
    return await this.productRepository.findByCategory(category);
  }

  async updateProduct(id: string, request: Partial<Product>): Promise<Product | null> {
    if (!id) {
      throw new Error('Product ID is required');
    }

    // Validate price if provided
    if (request.price !== undefined && request.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Validate stock if provided
    if (request.stock !== undefined && request.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    // Check if at least one field is provided
    if (!request.name && !request.description && !request.price && !request.category && request.stock === undefined) {
      throw new Error('At least one field must be provided for update');
    }

    return await this.productRepository.update(id, request);
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Product ID is required');
    }
    return await this.productRepository.delete(id);
  }

  async updateStock(id: string, stock: number): Promise<Product | null> {
    if (!id) {
      throw new Error('Product ID is required');
    }

    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return await this.productRepository.updateStock(id, stock);
  }
}
