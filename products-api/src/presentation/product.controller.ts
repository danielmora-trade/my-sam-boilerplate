import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiResponseService, AuroraDataService, UuidGeneratorService } from 'shared-utils';
import { ProductRepository } from '../infrastructure/product.repository';
import { ProductService } from '../application/product.service';
import { CreateProductRequest, UpdateProductRequest } from '../domain/product.entity';

export class ProductController {
  private productService: ProductService;
  private responseService: ApiResponseService;

  constructor() {
    const databaseService = new AuroraDataService();
    const idGenerator = new UuidGeneratorService();
    const productRepository = new ProductRepository(databaseService, idGenerator);
    this.productService = new ProductService(productRepository);
    this.responseService = new ApiResponseService();
  }

  async createProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      if (!event.body) {
        return this.responseService.badRequest('Request body is required');
      }

      const request: CreateProductRequest = JSON.parse(event.body);
      
      if (!request.name || !request.description || !request.category) {
        return this.responseService.badRequest('Name, description, and category are required');
      }

      if (request.price <= 0) {
        return this.responseService.badRequest('Price must be greater than 0');
      }

      if (request.stock < 0) {
        return this.responseService.badRequest('Stock cannot be negative');
      }

      const product = await this.productService.createProduct(request);
      return this.responseService.created(product, 'Product created successfully');
    } catch (error) {
      console.error('Error creating product:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async getProductById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = event.pathParameters?.id;
      
      if (!id) {
        return this.responseService.badRequest('Product ID is required');
      }

      const product = await this.productService.getProductById(id);
      
      if (!product) {
        return this.responseService.notFound('Product not found');
      }

      return this.responseService.success(product);
    } catch (error) {
      console.error('Error getting product:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async getAllProducts(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const products = await this.productService.getAllProducts();
      return this.responseService.success(products);
    } catch (error) {
      console.error('Error getting products:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async getProductsByCategory(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const category = event.pathParameters?.category;
      
      if (!category) {
        return this.responseService.badRequest('Category is required');
      }

      const products = await this.productService.getProductsByCategory(category);
      return this.responseService.success(products);
    } catch (error) {
      console.error('Error getting products by category:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async updateProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = event.pathParameters?.id;
      
      if (!id) {
        return this.responseService.badRequest('Product ID is required');
      }

      if (!event.body) {
        return this.responseService.badRequest('Request body is required');
      }

      const request: UpdateProductRequest = JSON.parse(event.body);
      
      if (!request.name && !request.description && !request.price && !request.category && request.stock === undefined) {
        return this.responseService.badRequest('At least one field must be provided for update');
      }

      const product = await this.productService.updateProduct(id, request);
      
      if (!product) {
        return this.responseService.notFound('Product not found');
      }

      return this.responseService.success(product, 'Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async deleteProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = event.pathParameters?.id;
      
      if (!id) {
        return this.responseService.badRequest('Product ID is required');
      }

      const deleted = await this.productService.deleteProduct(id);
      
      if (!deleted) {
        return this.responseService.notFound('Product not found');
      }

      return this.responseService.success({ id }, 'Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async updateStock(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = event.pathParameters?.id;
      
      if (!id) {
        return this.responseService.badRequest('Product ID is required');
      }

      if (!event.body) {
        return this.responseService.badRequest('Request body is required');
      }

      const { stock } = JSON.parse(event.body);
      
      if (stock === undefined || stock < 0) {
        return this.responseService.badRequest('Valid stock value is required');
      }

      const product = await this.productService.updateStock(id, stock);
      
      if (!product) {
        return this.responseService.notFound('Product not found');
      }

      return this.responseService.success(product, 'Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }
}
