import { AuroraDataService, UuidGeneratorService } from 'shared-utils';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';

export class UserRepository implements IUserRepository {
  constructor(
    private databaseService: AuroraDataService,
    private idGenerator: UuidGeneratorService
  ) {}

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = this.idGenerator.generate();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO users (id, name, email, created_at, updated_at)
      VALUES (:id, :name, :email, :createdAt, :updatedAt)
      RETURNING id, name, email, created_at, updated_at
    `;
    
    const parameters = [
      { name: 'id', value: { stringValue: id } },
      { name: 'name', value: { stringValue: user.name } },
      { name: 'email', value: { stringValue: user.email } },
      { name: 'createdAt', value: { stringValue: now } },
      { name: 'updatedAt', value: { stringValue: now } }
    ];

    const result = await this.databaseService.executeQuery<User>(sql, parameters);
    return this.mapToUser(result[0]);
  }

  async findById(id: string): Promise<User | null> {
    const sql = 'SELECT id, name, email, created_at, updated_at FROM users WHERE id = :id';
    const parameters = [{ name: 'id', value: { stringValue: id } }];
    
    const result = await this.databaseService.executeQuery<User>(sql, parameters);
    return result.length > 0 ? this.mapToUser(result[0]) : null;
  }

  async findAll(): Promise<User[]> {
    const sql = 'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC';
    const result = await this.databaseService.executeQuery<User>(sql);
    return result.map((user: User) => this.mapToUser(user));
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updateFields: string[] = [];
    const parameters: any[] = [{ name: 'id', value: { stringValue: id } }];

    if (user.name) {
      updateFields.push('name = :name');
      parameters.push({ name: 'name', value: { stringValue: user.name } });
    }
    if (user.email) {
      updateFields.push('email = :email');
      parameters.push({ name: 'email', value: { stringValue: user.email } });
    }

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    updateFields.push('updated_at = :updatedAt');
    parameters.push({ name: 'updatedAt', value: { stringValue: new Date().toISOString() } });

    const sql = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = :id
      RETURNING id, name, email, created_at, updated_at
    `;

    const result = await this.databaseService.executeQuery<User>(sql, parameters);
    return result.length > 0 ? this.mapToUser(result[0]) : null;
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
      createdAt: row[3].stringValue,
      updatedAt: row[4].stringValue
    };
  }
}
