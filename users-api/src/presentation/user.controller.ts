import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiResponseService, AuroraDataService, UuidGeneratorService } from 'shared-utils';
import { UserRepository } from '../infrastructure/user.repository';
import { UserService } from '../application/user.service';
import { CreateUserRequest, UpdateUserRequest } from '../domain/user.entity';

export class UserController {
  private userService: UserService;
  private responseService: ApiResponseService;

  constructor() {
    const databaseService = new AuroraDataService();
    const idGenerator = new UuidGeneratorService();
    const userRepository = new UserRepository(databaseService, idGenerator);
    this.userService = new UserService(userRepository);
    this.responseService = new ApiResponseService();
  }

  async createUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      if (!event.body) {
        return this.responseService.badRequest('Request body is required');
      }

      const request: CreateUserRequest = JSON.parse(event.body);
      
      if (!request.name || !request.email) {
        return this.responseService.badRequest('Name and email are required');
      }

      const user = await this.userService.createUser(request);
      return this.responseService.created(user, 'User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async getUserById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = event.pathParameters?.id;
      
      if (!id) {
        return this.responseService.badRequest('User ID is required');
      }

      const user = await this.userService.getUserById(id);
      
      if (!user) {
        return this.responseService.notFound('User not found');
      }

      return this.responseService.success(user);
    } catch (error) {
      console.error('Error getting user:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async getAllUsers(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const users = await this.userService.getAllUsers();
      return this.responseService.success(users);
    } catch (error) {
      console.error('Error getting users:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async updateUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = event.pathParameters?.id;
      
      if (!id) {
        return this.responseService.badRequest('User ID is required');
      }

      if (!event.body) {
        return this.responseService.badRequest('Request body is required');
      }

      const request: UpdateUserRequest = JSON.parse(event.body);
      
      if (!request.name && !request.email) {
        return this.responseService.badRequest('At least one field (name or email) is required');
      }

      const user = await this.userService.updateUser(id, request);
      
      if (!user) {
        return this.responseService.notFound('User not found');
      }

      return this.responseService.success(user, 'User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }

  async deleteUser(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const id = event.pathParameters?.id;
      
      if (!id) {
        return this.responseService.badRequest('User ID is required');
      }

      const deleted = await this.userService.deleteUser(id);
      
      if (!deleted) {
        return this.responseService.notFound('User not found');
      }

      return this.responseService.success({ id }, 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      return this.responseService.error(
        error instanceof Error ? error.message : 'Internal server error',
        500
      );
    }
  }
}
