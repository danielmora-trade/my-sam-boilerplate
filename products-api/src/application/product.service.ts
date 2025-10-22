import { Product, CreateProductRequest } from '../domain/product.entity';
import { IProductService } from '../domain/product.service';
import { IProductRepository } from '../domain/product.repository';

export class ProductService implements IProductService {
  constructor(private productRepository: IProductRepository) {}

  async createProduct(request: CreateProductRequest): Promise<Product> {
    // Validate required fields
    if (!request.name || !request.description) {
      throw new Error('Name and description are required');
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
      stock: request.stock
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Product ID is required');
    }
    return await this.productRepository.delete(id);
  }
}