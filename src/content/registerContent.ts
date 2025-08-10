export const REGISTER_CONTENT = {
  en: {
    title: 'Begin Your Journey',
    emailLabel: 'Email',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    confirmLabel: 'Confirm Password',
    passwordHint: 'At least 8 characters with upper and lower case letters and numbers',
    agreePrefix: 'I have read and agree to the ',
    agreementLink: 'User Agreement',
    registerButton: 'Register',
    success: 'Success',
    checking: 'Checking...',
    emailTakenPrefix: 'Email already registered? ',
    loginNow: 'Login now',
    usernameAvailable: '✓ Available',
    thirdParty: {
      google: 'Sign up with Google',
      apple: 'Sign up with Apple'
    },
    existingUser: 'Already have an account?',
    placeholders: {
      email: 'you@example.com',
      username: 'username',
      password: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',
      confirm: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'
    },
    errors: {
      emailRequired: 'Email is required',
      usernameRequired: 'Username is required',
      passwordRequired: 'Password is required',
      emailInvalid: 'Invalid email format',
      usernameTaken: 'Username is already taken',
      passwordMismatch: 'Passwords do not match',
      agreement: 'Please agree to the terms'
    },
    strength: {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    }
  },
  zh: {
    title: '开启您的旅程',
    emailLabel: '邮箱',
    usernameLabel: '用户名',
    passwordLabel: '密码',
    confirmLabel: '确认密码',
    passwordHint: '至少8字符，含大小写+数字',
    agreePrefix: '我已阅读并同意',
    agreementLink: '用户协议',
    registerButton: '注册',
    success: '成功',
    checking: '检查中...',
    emailTakenPrefix: '该邮箱已注册？',
    loginNow: '立即登录',
    usernameAvailable: '✓ 可用',
    thirdParty: {
      google: 'Google 注册',
      apple: 'Apple 注册'
    },
    existingUser: '已有账号？',
    placeholders: {
      email: 'you@example.com',
      username: '用户名',
      password: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022',
      confirm: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'
    },
    errors: {
      emailRequired: '邮箱不能为空',
      usernameRequired: '用户名不能为空',
      passwordRequired: '密码不能为空',
      emailInvalid: '邮箱格式错误',
      usernameTaken: '用户名已被占用',
      passwordMismatch: '两次密码不一致',
      agreement: '请勾选同意'
    },
    strength: {
      weak: '弱',
      medium: '中',
      strong: '强'
    }
  }
} as const;
