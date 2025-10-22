import { User, CreateUserRequest } from '../domain/user.entity';
import { IUserService } from '../domain/user.service';
import { IUserRepository } from '../domain/user.repository';

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(request: CreateUserRequest): Promise<User> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    return await this.userRepository.create({
      name: request.name,
      email: request.email
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await this.userRepository.delete(id);
  }
}