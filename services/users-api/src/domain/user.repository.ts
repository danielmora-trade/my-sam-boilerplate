import { User } from './user.entity';

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  findAll(): Promise<User[]>;
  delete(id: string): Promise<boolean>;
}