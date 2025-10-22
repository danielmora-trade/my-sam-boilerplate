import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from './src/presentation/user.controller';

const userController = new UserController();

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await userController.createUser(event);
};

export const getUserById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await userController.getUserById(event);
};

export const getAllUsers = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await userController.getAllUsers(event);
};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await userController.updateUser(event);
};

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await userController.deleteUser(event);
};
