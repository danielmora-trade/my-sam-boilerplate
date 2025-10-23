import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiResponseService } from 'shared';
import { DatabaseInitializer } from './src/database-initializer.service'

const responseService = new ApiResponseService();

export const initializeDatabase = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const initializer = new DatabaseInitializer();
    await initializer.initializeTables();
    
    return responseService.success(
      { message: 'Database tables initialized successfully' },
      'Database initialization completed'
    );
  } catch (error) {
    console.error('Error initializing database:', error);
    return responseService.error(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
};