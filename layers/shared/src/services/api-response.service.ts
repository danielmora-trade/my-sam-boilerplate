import { IResponseService, Response } from "../domain/response.service";

export class ApiResponseService implements IResponseService {
  success<T>(data: T, message: string = 'Success'): Response {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message,
        data
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      }
    };
  }

  error(message: string, statusCode: number = 500): Response {
    return {
      statusCode,
      body: JSON.stringify({
        success: false,
        message,
        error: true
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      }
    };
  }

  created<T>(data: T, message: string = 'Created successfully'): Response {
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        message,
        data
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      }
    };
  }

  notFound(message: string = 'Resource not found'): Response {
    return this.error(message, 404);
  }

  badRequest(message: string = 'Bad request'): Response {
    return this.error(message, 400);
  }
}