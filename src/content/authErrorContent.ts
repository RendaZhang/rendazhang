export const AUTH_ERROR_CONTENT = {
  en: {
    400: 'Invalid request',
    401: 'Incorrect username or password',
    429: 'Too many requests. Please try again later',
    409: 'Email already exists',
    500: 'Server error, please try again later',
    network: 'Network error, please try again later',
    default: 'Unexpected error, please try again'
  },
  zh: {
    400: '请求无效',
    401: '账号或密码错误',
    429: '请求过于频繁，请稍后再试',
    409: '邮箱已存在',
    500: '服务器错误，请稍后重试',
    network: '网络错误，请稍后重试',
    default: '未知错误，请稍后重试'
  }
} as const;
