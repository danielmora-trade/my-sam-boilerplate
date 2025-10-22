import { AuroraDataService } from 'shared/services/aurora-data.service';
import { UuidGeneratorService } from 'shared/services/uuid-generator.service';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';

export class UserRepository implements IUserRepository {
  constructor(
    private databaseService: AuroraDataService,
    private idGenerator: UuidGeneratorService
  ) {}

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const id = this.idGenerator.generate();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO users (id, name, email, created_at)
      VALUES (:id, :name, :email, :createdAt)
      RETURNING id, name, email, created_at
    `;
    
    const parameters = [
      { name: 'id', value: { stringValue: id } },
      { name: 'name', value: { stringValue: user.name } },
      { name: 'email', value: { stringValue: user.email } },
      { name: 'createdAt', value: { stringValue: now } }
    ];

    const result = await this.databaseService.executeQuery<any>(sql, parameters);
    return this.mapToUser(result[0]);
  }

  async findAll(): Promise<User[]> {
    const sql = 'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC';
    const result = await this.databaseService.executeQuery<any>(sql);
    return result.map((row: any) => this.mapToUser(row));
  }

  async delete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = :id';
    const parameters = [{ name: 'id', value: { stringValue: id } }];
    
    const result = await this.databaseService.executeStatement(sql, parameters);
    return result.numberOfRecordsUpdated > 0;
  }

  private mapToUser(row: any): User {
    return {
      id: row[0].stringValue,
      name: row[1].stringValue,
      email: row[2].stringValue,
      createdAt: row[3].stringValue
    };
  }
}