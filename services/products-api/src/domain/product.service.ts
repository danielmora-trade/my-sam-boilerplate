import { Product, CreateProductRequest } from './product.entity';

export interface IProductService {
  createProduct(request: CreateProductRequest): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  deleteProduct(id: string): Promise<boolean>;
}
