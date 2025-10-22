export interface IResponseService {
    success<T>(data: T, message?: string): Response;
    error(message: string, statusCode?: number): Response;
    created<T>(data: T, message?: string): Response;
    notFound(message?: string): Response;
    badRequest(message?: string): Response;
}
export interface Response {
    statusCode: number;
    body: string;
    headers: {
        'Content-Type': string;
        'Access-Control-Allow-Origin': string;
        'Access-Control-Allow-Headers': string;
        'Access-Control-Allow-Methods': string;
    };
}
