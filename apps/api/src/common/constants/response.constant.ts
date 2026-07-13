/**
 * 统一响应状态码
 */
export enum ResponseCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * 统一响应消息
 */
export enum ResponseMessage {
  SUCCESS = '操作成功',
  CREATED = '创建成功',
  BAD_REQUEST = '请求参数错误',
  UNAUTHORIZED = '未授权',
  FORBIDDEN = '禁止访问',
  NOT_FOUND = '资源不存在',
  INTERNAL_SERVER_ERROR = '服务器内部错误',
}

/**
 * 统一响应格式
 */
export interface ApiResponse<T = any> {
  code: ResponseCode;
  message: string;
  data?: T;
  timestamp: string;
}