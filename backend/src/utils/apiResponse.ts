class ApiResponse {
  statusCode: number;
  success: boolean;
  data: any;
  message: string
  constructor(statusCode: number, data: any, message: string) {
    this.success = statusCode <= 200;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}


export {ApiResponse}