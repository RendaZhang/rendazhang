const FRONTEND =
  'https://github.com/RendaZhang/rendazhang/blob/4529866a41d11597e3c2d89d1fa9432bdef90c15';
const BACKEND =
  'https://github.com/RendaZhang/python-cloud-chat/blob/865d8a418a14d17896c31c61a05a8fe1becbd4e5';
const NGINX =
  'https://github.com/RendaZhang/nginx-conf/blob/c44793505991bb7a5ff49ba52acb93962e126ff3';

export const SHOWCASE_NODES = [
  {
    id: 'browser',
    label: { zh: '浏览器', en: 'Browser' },
    summary: {
      zh: '发出问题，收到回答片段就在页面上逐段补全。',
      en: 'Sends the question and adds each piece of the reply to the page as it arrives.'
    },
    detail: {
      zh: '页面把问题交给站点的聊天接口。返回时，它把收到的文字接在一起，让同一条回答逐渐完整。',
      en: 'The page sends the question to the site’s chat endpoint. When pieces come back, it joins them into one reply.'
    },
    source: FRONTEND + '/src/services/chatService.ts#L48-L83'
  },
  {
    id: 'nginx',
    label: { zh: 'Nginx', en: 'Nginx' },
    summary: {
      zh: '把聊天请求转给 Flask，也把返回的片段继续送回浏览器。',
      en: 'Passes the chat request to Flask and relays the reply pieces back to the browser.'
    },
    detail: {
      zh: '聊天走专用转发路径。这个路径关闭了代理缓冲，回复片段可以边到达边转发。',
      en: 'A dedicated route forwards chat traffic. Proxy buffering is off on that route so pieces can be relayed as they arrive.'
    },
    source: NGINX + '/sites-available/rendazhang.conf#L133-L151'
  },
  {
    id: 'flask',
    label: { zh: 'Flask', en: 'Flask' },
    summary: {
      zh: '检查收到的消息，调用模型，并把模型片段整理成浏览器能读的格式。',
      en: 'Checks the message, calls the model, and formats its reply pieces for the browser.'
    },
    detail: {
      zh: 'Flask 校验消息，并把独立生成的回答片段逐行送回去。',
      en: 'Flask validates the message and streams the generated reply, one line at a time.'
    },
    source: BACKEND + '/app.py#L132-L186'
  },
  {
    id: 'model',
    label: { zh: '外部模型 API', en: 'External model API' },
    summary: {
      zh: '生成回答的文字片段，经 Flask 和 Nginx 回到页面。',
      en: 'Generates pieces of the reply, which travel back to the page through Flask and Nginx.'
    },
    detail: {
      zh: '模型调用使用流式返回。Flask 收到一段有效文字，就整理成一行向下游发送。',
      en: 'The model streams its output. Flask wraps each piece of text in a line before passing it on.'
    },
    source: BACKEND + '/app.py#L189-L212'
  }
] as const;

export const SHOWCASE_STEPS = [
  { node: 'browser', zh: '浏览器发出问题', en: 'The browser sends the question' },
  { node: 'nginx', zh: 'Nginx 转发给 Flask', en: 'Nginx forwards it to Flask' },
  { node: 'flask', zh: 'Flask 检查并准备消息', en: 'Flask checks and prepares the message' },
  {
    node: 'model',
    zh: '外部模型开始生成片段',
    en: 'The external model starts producing reply pieces'
  },
  {
    node: 'browser',
    zh: '第一段经 Flask 和 Nginx 回到浏览器',
    en: 'The first piece returns to the browser through Flask and Nginx'
  },
  {
    node: 'browser',
    zh: '回答补全，回到同一个浏览器',
    en: 'The full reply is back in the same browser'
  }
] as const;

export const SHOWCASE_SAMPLE = {
  question: { zh: '请用一句话介绍 PersonalWeb。', en: 'Describe PersonalWeb in one sentence.' },
  first: { zh: 'PersonalWeb 是 Renda 的个人网站，', en: 'PersonalWeb is Renda’s personal site,' },
  second: {
    zh: '首页和文档以静态文件发布，聊天由独立后端处理。',
    en: ' with a statically published home page and docs, and a separate backend for chat.'
  }
};

export const SHOWCASE_STATIC_SOURCE = FRONTEND + '/.github/workflows/deploy.yml#L50-L85';
