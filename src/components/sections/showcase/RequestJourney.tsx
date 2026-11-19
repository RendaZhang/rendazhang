import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactElement
} from 'react';
import {
  SHOWCASE_NODES,
  SHOWCASE_SAMPLE,
  SHOWCASE_STATIC_SOURCE,
  SHOWCASE_STEPS
} from '../../../content/showcaseContent';
import LocalizedSection from '../../ui/data-display/LocalizedSection';
import type { ShowcasePlayerProps } from './ShowcasePlayer';

const TOTAL_STEPS = SHOWCASE_STEPS.length;

export default function RequestJourney(): ReactElement {
  const [Player, setPlayer] = useState<ComponentType<ShowcasePlayerProps> | null>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [step, setStep] = useState(0);
  const loadRequested = useRef(false);
  const stage = SHOWCASE_STEPS[step - 1];
  const complete = step === TOTAL_STEPS;

  const openPlayer = useCallback(async () => {
    if (loadRequested.current) return;
    loadRequested.current = true;
    setLoadState('loading');
    try {
      const { default: player } = await import('./ShowcasePlayer');
      setPlayer(() => player);
      setLoadState('idle');
    } catch {
      loadRequested.current = false;
      setLoadState('failed');
    }
  }, []);

  useEffect(() => {
    if (window.location.hash === '#showcase-route') void openPlayer();
  }, [openPlayer]);

  const first = SHOWCASE_SAMPLE.first;
  const second = SHOWCASE_SAMPLE.second;
  const showFirst = !Player || step >= TOTAL_STEPS - 1;
  const showSecond = !Player || complete;

  return (
    <section id="showcase" className="c-showcase" aria-labelledby="showcase-title">
      <div className="c-showcase-inner">
        <header className="c-showcase-header">
          <p className="c-showcase-badge">
            <LocalizedSection zhContent="模拟演示" enContent="Simulated demo" />
          </p>
          <h2 id="showcase-title">
            <LocalizedSection
              zhContent="一条请求，一次往返。"
              enContent="One request, there and back."
            />
          </h2>
          <p className="c-showcase-lead">
            <LocalizedSection
              zhContent="跟着一条聊天请求，看问题如何出发，答案如何返回。"
              enContent="Follow a chat message from the moment it leaves your browser until the reply comes back."
            />
          </p>
          <a
            className="c-showcase-button c-showcase-explore"
            href="#showcase-route"
            onClick={() => void openPlayer()}
          >
            <LocalizedSection zhContent="探索这个作品" enContent="Explore this project" />
            <span aria-hidden="true">→</span>
          </a>
        </header>

        <div id="showcase-route" tabIndex={-1}>
          {Player && <Player step={step} total={TOTAL_STEPS} onStep={setStep} />}
          <p className="c-showcase-progress" role="status">
            {loadState === 'loading' && (
              <LocalizedSection zhContent="正在加载模拟控制…" enContent="Loading demo controls…" />
            )}
            {loadState === 'failed' && (
              <LocalizedSection
                zhContent="控制区加载失败。可继续阅读节点，或再次选择「探索这个作品」。"
                enContent="The controls could not load. You can read the stops or select Explore this project again."
              />
            )}
            {Player && !stage && (
              <LocalizedSection
                zhContent="就绪。按「开始」播放，或按「单步」逐站查看。"
                enContent="Ready. Select Start to play or Step to advance one stop at a time."
              />
            )}
            {stage && (
              <>
                <span>
                  {step}/{TOTAL_STEPS} ·{' '}
                </span>
                <LocalizedSection
                  zhContent={complete ? '完成 · ' + stage.zh : stage.zh}
                  enContent={complete ? 'Complete · ' + stage.en : stage.en}
                />
              </>
            )}
          </p>

          {complete && (
            <a className="c-showcase-jump-to-reply" href="#showcase-response">
              <LocalizedSection zhContent="查看回答 ↓" enContent="View the reply ↓" />
            </a>
          )}
          <div className="c-showcase-layout">
            <div>
              <p className="c-showcase-direction">
                <LocalizedSection zhContent="请求出发 ↓" enContent="Request leaves ↓" />
              </p>
              <ol className="c-showcase-route">
                {SHOWCASE_NODES.map((node) => (
                  <li key={node.id} aria-current={stage?.node === node.id ? 'step' : undefined}>
                    <details>
                      <summary>
                        <strong>
                          <LocalizedSection zhContent={node.label.zh} enContent={node.label.en} />
                        </strong>
                        <span className="c-showcase-node-summary">
                          <LocalizedSection
                            zhContent={node.summary.zh}
                            enContent={node.summary.en}
                          />
                        </span>
                      </summary>
                      <div className="c-showcase-detail">
                        <p>
                          <LocalizedSection zhContent={node.detail.zh} enContent={node.detail.en} />
                        </p>
                        {node.id === 'browser' && (
                          <p className="c-showcase-return-label">
                            <LocalizedSection
                              zhContent="回答最后也回到这里。"
                              enContent="This is where the reply comes back."
                            />
                          </p>
                        )}
                        <a href={node.source}>
                          <LocalizedSection
                            zhContent="查看这个节点的源码"
                            enContent="View source for this stop"
                          />
                        </a>
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
              <p className="c-showcase-direction">
                <LocalizedSection
                  zhContent="↩ 原路返回：模型 → Flask → Nginx → 浏览器"
                  enContent="↩ Return route: model → Flask → Nginx → browser"
                />
              </p>
            </div>

            <div className="c-showcase-result" id="showcase-response" tabIndex={-1}>
              <div className="c-showcase-sample">
                <p className="c-showcase-badge">
                  <LocalizedSection
                    zhContent="模拟演示 · 合成问答"
                    enContent="Simulated demo · Sample exchange"
                  />
                </p>
                <dl>
                  <dt>
                    <LocalizedSection zhContent="问题" enContent="Question" />
                  </dt>
                  <dd>
                    <LocalizedSection
                      zhContent={SHOWCASE_SAMPLE.question.zh}
                      enContent={SHOWCASE_SAMPLE.question.en}
                    />
                  </dd>
                  <dt>
                    <LocalizedSection zhContent="回答" enContent="Reply" />
                  </dt>
                  <dd className="c-showcase-reply">
                    {showFirst ? (
                      <LocalizedSection
                        zhContent={first.zh + (showSecond ? second.zh : '')}
                        enContent={first.en + (showSecond ? second.en : '')}
                      />
                    ) : (
                      <LocalizedSection zhContent="等待回程…" enContent="Waiting for the reply…" />
                    )}
                  </dd>
                </dl>
              </div>
              <p className="c-showcase-return">
                <span aria-hidden="true">↩</span>
                <strong>
                  <LocalizedSection
                    zhContent="回到同一个浏览器"
                    enContent="Back to the same browser"
                  />
                </strong>
              </p>
              <div className="c-showcase-choice">
                <h3>
                  <LocalizedSection
                    zhContent="我为什么这样设计"
                    enContent="Why I designed it this way"
                  />
                </h3>
                <p>
                  <LocalizedSection
                    zhContent="我想让访客打开网页就能读到项目说明，所以把首页和文档做成静态页面，把处理对话的工作交给独立的聊天后端。"
                    enContent="I wanted visitors to be able to read about the project as soon as they opened the site, so I made the home page and docs static and gave chat its own backend."
                  />
                </p>
                <a href={SHOWCASE_STATIC_SOURCE}>
                  <LocalizedSection
                    zhContent="查看静态构建与发布"
                    enContent="See the static build and deployment"
                  />
                </a>
              </div>
              <div className="c-showcase-links">
                <a href="/docs">
                  <LocalizedSection zhContent="技术文档" enContent="Technical docs" />
                </a>
                <a href="/deepseek_chat">
                  <LocalizedSection zhContent="打开真实 Chat" enContent="Open live chat" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
