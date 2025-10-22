import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ProductController } from './src/presentation/product.controller';

const productController = new ProductController();

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await productController.createProduct(event);
};

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await productController.getProductById(event);
};

export const getAllProducts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await productController.getAllProducts(event);
};

export const getProductsByCategory = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await productController.getProductsByCategory(event);
};

export const updateProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await productController.updateProduct(event);
};

export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await productController.deleteProduct(event);
};

export const updateStock = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await productController.updateStock(event);
};
