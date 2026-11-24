export const DOCS_DEMO_FRAGMENTS = {
  zh: ['正文来自', '预先生成的 HTML，', '控件稍后就绪。'],
  en: ['The page text ', 'comes from built HTML. ', 'Controls become ready later.']
} as const;

const nginxReadme = 'https://github.com/RendaZhang/nginx-conf/blob/master/README.md';

export const DOCS_READING_SOURCES = {
  rendering:
    'https://github.com/RendaZhang/rendazhang/blob/master/docs/FRONTEND_ARCHITECTURE.md#渲染与-hydration',
  client:
    'https://github.com/RendaZhang/rendazhang/blob/master/docs/FRONTEND_ARCHITECTURE.md#服务与-api-所有权',
  model:
    'https://github.com/RendaZhang/python-cloud-chat/blob/865d8a418a14d17896c31c61a05a8fe1becbd4e5/app.py#L197-L210',
  static: `${nginxReadme}#static-delivery`,
  proxy: `${nginxReadme}#chat-streaming`,
  flask:
    'https://github.com/RendaZhang/python-cloud-chat/blob/master/docs/API.md#deepseek-多轮对话流式--post-deepseek_chat',
  delivery: 'https://github.com/RendaZhang/rendazhang/blob/master/docs/CI_CD.md#ci--cd-pipeline',
  maintenance:
    'https://github.com/RendaZhang/rendazhang/blob/master/docs/OPERATIONS.md#operations-maintenance-guide'
} as const;

type Route = 'page' | 'chat';

export type DocsStationNote = { text: string; href: string; label: string };

type Station = {
  title: string;
  notes: Partial<Record<Route, DocsStationNote>>;
};

type DocsLanguage = {
  title: string;
  routeLegend: string;
  routes: Record<Route, string>;
  nodes: Record<'browser' | 'nginx' | 'static' | 'flask' | 'model', Station>;
  related: { certificate: string; chat: string; realChat: string };
  reference: { overview: string; full: string; delivery: string; maintenance: string };
};

export const DOCS_CASE_STUDY_CONTENT = {
  en: {
    title: 'Architecture notes',
    routeLegend: 'Page and chat routes',
    routes: { page: 'Open a page', chat: 'Send a question' },
    nodes: {
      browser: {
        title: 'Browser',
        notes: {
          page: {
            text: 'The browser displays the HTML first. Scripts then make the controls interactive.',
            href: '#docs-hydration-en',
            label: 'From readable to interactive'
          },
          chat: {
            text: 'The browser reads each complete line and appends its text to the same reply.',
            href: '#docs-append-en',
            label: 'How the reply grows'
          }
        }
      },
      nginx: {
        title: 'Nginx',
        notes: {
          page: {
            text: 'Nginx serves the built HTML file when the browser asks for this page.',
            href: DOCS_READING_SOURCES.static,
            label: 'Static delivery rules'
          },
          chat: {
            text: 'Nginx forwards the request to Flask and relays the response as it arrives.',
            href: DOCS_READING_SOURCES.proxy,
            label: 'Chat proxy and buffering'
          }
        }
      },
      static: {
        title: 'Static HTML',
        notes: {
          page: {
            text: 'Astro writes the page text into HTML during the build.',
            href: '#docs-built-html-en',
            label: 'What the build writes'
          }
        }
      },
      flask: {
        title: 'Flask',
        notes: {
          chat: {
            text: 'Flask turns each nonempty model fragment into a JSON line with a text field.',
            href: DOCS_READING_SOURCES.flask,
            label: 'Flask’s streaming API'
          }
        }
      },
      model: {
        title: 'Model API',
        notes: {
          chat: {
            text: 'The model produces pieces of text as it generates the reply.',
            href: '#docs-model-en',
            label: 'Where fragments come from'
          }
        }
      }
    },
    related: { certificate: 'AWS certification', chat: 'Ask in Chat', realChat: 'Open Chat' },
    reference: {
      overview: 'Reference Architecture',
      full: 'Full reference',
      delivery: 'CI/CD and validation',
      maintenance: 'Operations and maintenance'
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
          page: {
            text: '浏览器先显示 HTML 正文，脚本加载后控件就能操作。',
            href: '#docs-hydration-zh',
            label: '从正文可读到控件可操作'
          },
          chat: {
            text: '浏览器每读完一行，就把里面的文字接到同一个回答气泡。',
            href: '#docs-append-zh',
            label: '浏览器如何追加回答'
          }
        }
      },
      nginx: {
        title: 'Nginx',
        notes: {
          page: {
            text: '浏览器打开这一页时，Nginx 发回已经构建好的 HTML 文件。',
            href: DOCS_READING_SOURCES.static,
            label: '静态文件服务规则'
          },
          chat: {
            text: 'Nginx 把提问转给 Flask，响应随到随转。',
            href: DOCS_READING_SOURCES.proxy,
            label: 'Chat 转发与缓冲'
          }
        }
      },
      static: {
        title: '静态 HTML',
        notes: {
          page: {
            text: 'Astro 在构建时就把这页正文写进了 HTML。',
            href: '#docs-built-html-zh',
            label: '构建时写入了什么'
          }
        }
      },
      flask: {
        title: 'Flask',
        notes: {
          chat: {
            text: 'Flask 把每个非空模型片段封装成一个带 text 字段的 JSON 行。',
            href: DOCS_READING_SOURCES.flask,
            label: 'Flask 流式接口'
          }
        }
      },
      model: {
        title: '模型 API',
        notes: {
          chat: {
            text: '模型一边生成回答，一边返回文字片段。',
            href: '#docs-model-zh',
            label: '片段从哪里来'
          }
        }
      }
    },
    related: { certificate: 'AWS 认证', chat: '带去 Chat', realChat: '打开 Chat' },
    reference: {
      overview: '参考架构',
      full: '完整参考',
      delivery: 'CI/CD 与验证',
      maintenance: '运行与维护'
    }
  }
} as const satisfies Record<'zh' | 'en', DocsLanguage>;
