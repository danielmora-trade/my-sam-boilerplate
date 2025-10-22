import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { IDatabaseService } from '../domain/database.service';

export class AuroraDataService implements IDatabaseService {
  private rdsClient: RDSDataClient;
  private secretsClient: SecretsManagerClient;
  private resourceArn: string;
  private secretArn: string;
  private database: string;

  constructor() {
    this.rdsClient = new RDSDataClient({});
    this.secretsClient = new SecretsManagerClient({});
    this.resourceArn = process.env.DB_CLUSTER_ARN!;
    this.secretArn = process.env.DB_SECRET_ARN!;
    this.database = process.env.DB_NAME!;
  }

  async executeQuery<T>(sql: string, parameters?: any[]): Promise<T[]> {
    const command = new ExecuteStatementCommand({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      database: this.database,
      sql: sql,
      parameters: parameters,
    });

    const response = await this.rdsClient.send(command);
    return response.records as T[];
  }

  async executeStatement(sql: string, parameters?: any[]): Promise<any> {
    const command = new ExecuteStatementCommand({
      resourceArn: this.resourceArn,
      secretArn: this.secretArn,
      database: this.database,
      sql: sql,
      parameters: parameters,
    });

    return await this.rdsClient.send(command);
  }
}