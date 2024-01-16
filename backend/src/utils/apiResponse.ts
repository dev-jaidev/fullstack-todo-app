interface returnValue {
  statusCode: number
  data: any
  message: string
  success: boolean
}

class ApiResponse implements returnValue  {
  statusCode: number;
  success: boolean;
  data: any;
  message: string
  constructor(statusCode: number, data: any, message: string) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}


export {ApiResponse}