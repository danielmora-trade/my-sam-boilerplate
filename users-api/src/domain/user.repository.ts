import { User } from "./user.entity";

export interface IUserRepository {
    create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, user: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}