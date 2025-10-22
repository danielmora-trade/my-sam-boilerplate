import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(request: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    // Check if email already exists
    const existingUsers = await this.userRepository.findAll();
    const emailExists = existingUsers.some(user => user.email === request.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }

    return await this.userRepository.create({
      name: request.name,
      email: request.email
    });
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(id: string, request: Partial<User>): Promise<User | null> {
    if (!id) {
      throw new Error('User ID is required');
    }

    // Validate email format if provided
    if (request.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.email)) {
        throw new Error('Invalid email format');
      }

      // Check if email already exists (excluding current user)
      const existingUsers = await this.userRepository.findAll();
      const emailExists = existingUsers.some(user => user.email === request.email && user.id !== id);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    return await this.userRepository.update(id, request);
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await this.userRepository.delete(id);
  }
}
