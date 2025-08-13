export const LOGIN_CONTENT = {
  en: {
    title: 'Welcome Back',
    emailLabel: 'Email or Username',
    passwordLabel: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    loginButton: 'Login',
    success: 'Success',
    thirdParty: {
      google: 'Login with Google (coming soon)',
      wechat: 'Login with WeChat (coming soon)'
    },
    newUser: 'New user?',
    registerNow: 'Register Now',
    placeholders: {
      email: 'your@email.com',
      password: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'
    },
    errors: {
      emailInvalid: 'Invalid email format',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      credentials: 'Incorrect username or password',
      passwordInvalid:
        'Password must be at least 8 characters and include at least two of letters, numbers, or special symbols'
    },
    passwordToggle: {
      show: 'Show password',
      hide: 'Hide password'
    },
    strength: {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    }
  },
  zh: {
    title: '欢迎回来',
    emailLabel: '邮箱或用户名',
    passwordLabel: '密码',
    remember: '记住我',
    forgot: '忘记密码？',
    loginButton: '登录',
    success: '成功',
    thirdParty: {
      google: 'Google 登录（暂未支持）',
      wechat: '微信登录（暂未支持）'
    },
    newUser: '新用户？',
    registerNow: '立即注册',
    placeholders: {
      email: 'you@example.com',
      password: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'
    },
    errors: {
      emailInvalid: '邮箱格式错误',
      emailRequired: '邮箱不能为空',
      passwordRequired: '密码不能为空',
      credentials: '账号或密码错误',
      passwordInvalid: '密码至少8位，包含字母、数字或特殊符号中的两种'
    },
    passwordToggle: {
      show: '显示密码',
      hide: '隐藏密码'
    },
    strength: {
      weak: '弱',
      medium: '中',
      strong: '强'
    }
  }
} as const;
