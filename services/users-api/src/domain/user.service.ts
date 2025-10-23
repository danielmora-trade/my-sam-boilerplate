import { User, CreateUserRequest } from './user.entity';

export interface IUserService {
  createUser(request: CreateUserRequest): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
}
