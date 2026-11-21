export const DOCS_CASE_STUDY_CONTENT = {
  en: {
    title: 'Architecture notes',
    routeLegend: 'Page and chat routes',
    routes: { page: 'Open a page', chat: 'Send a question' },
    nodes: {
      browser: {
        title: 'Browser',
        notes: {
          page: 'The browser can read the page from HTML while interactive components load.',
          chat: 'The browser submits a question on the same origin as the page.'
        },
        section: { href: '#en-baselayout-component-design-notes', label: 'Page layout' }
      },
      nginx: {
        title: 'Nginx',
        notes: {
          page: 'Nginx serves the built files directly.',
          chat: 'A dedicated proxy route forwards the question to Flask and streams the reply.'
        },
        section: { href: '#en-nginx-server', label: 'Nginx configuration' }
      },
      static: {
        title: 'Static HTML',
        notes: {
          page: 'Astro builds the public pages ahead of time, so opening one needs no application server.'
        },
        section: { href: '#en-reference-architecture', label: 'Reference architecture' }
      },
      flask: {
        title: 'Flask',
        notes: {
          chat: 'Flask validates the message and streams each piece as it arrives, so the browser can show a partial answer.'
        },
        section: { href: '#en-backend', label: 'Backend implementation' }
      },
      model: {
        title: 'Model API',
        notes: { chat: 'The model returns text in pieces for Flask to relay.' },
        section: { href: '#en-backend', label: 'Backend implementation' }
      }
    },
    related: {
      certificate: 'AWS certification',
      chat: 'Ask in Chat'
    },
    links: {
      docs: { href: '#content-en', label: 'Contents' },
      delivery: { href: '#en-cicd-workflow', label: 'CI/CD and validation' },
      contact: 'Contact'
    }
  },
  zh: {
    title: '架构笔记',
    routeLegend: '页面与聊天路径',
    routes: { page: '打开页面', chat: '发送问题' },
    nodes: {
      browser: {
        title: '浏览器',
        notes: {
          page: '交互组件加载期间，浏览器已经可以从 HTML 读取页面。',
          chat: '浏览器向和页面同源的地址提交问题。'
        },
        section: { href: '#zh-baselayout-组件设计说明', label: '页面布局' }
      },
      nginx: {
        title: 'Nginx',
        notes: {
          page: 'Nginx 直接提供构建好的文件。',
          chat: '专用代理路径把问题转给 Flask，并逐段转发回答。'
        },
        section: { href: '#zh-nginx-服务器', label: 'Nginx 配置' }
      },
      static: {
        title: '静态 HTML',
        notes: { page: 'Astro 提前生成公开页面，访客打开时无需等待应用服务器。' },
        section: { href: '#zh-参考架构', label: '参考架构' }
      },
      flask: {
        title: 'Flask',
        notes: { chat: 'Flask 校验消息，再把回答分段返回，浏览器可以边收边显示。' },
        section: { href: '#zh-后端', label: '后端实现' }
      },
      model: {
        title: '模型 API',
        notes: { chat: '模型逐段返回文字，由 Flask 转发。' },
        section: { href: '#zh-后端', label: '后端实现' }
      }
    },
    related: {
      certificate: 'AWS 认证',
      chat: '带去 Chat'
    },
    links: {
      docs: { href: '#content-zh', label: '正文目录' },
      delivery: { href: '#zh-cicd-工作流', label: 'CI/CD 与验证' },
      contact: '联系'
    }
  }
} as const;
