export interface IDatabaseService {
    executeQuery<T>(sql: string, parameters?: any[]): Promise<T[]>;
    executeStatement(sql: string, parameters?: any[]): Promise<any>;
}
