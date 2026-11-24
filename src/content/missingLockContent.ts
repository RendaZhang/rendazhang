export const MISSING_LOCK_PATH = '/cases/missing-lock/';

export const MISSING_LOCK_LANES = [
  { id: 'lane-1', number: '01', task: 'A', y: 28 },
  { id: 'lane-2', number: '02', task: 'B', y: 84 },
  { id: 'lane-3', number: '03', task: 'C', y: 140 },
  { id: 'lane-4', number: '04', task: 'D', y: 196 }
] as const;

export const MISSING_LOCK_COPY = {
  zh: {
    title: '失踪的锁',
    description: '调查一次让 Tomcat 停摆的 Java 21 虚拟线程故障。',
    simulation: '模拟',
    comparison: '对照故障与修复',
    incident: '故障时',
    recovered: '修复后',
    slots: '执行位置',
    full: '4 / 4 占用',
    available: '1 / 4 占用',
    open: '锁已释放',
    queue: '就绪队列',
    awakened: '已唤醒',
    entered: 'E 已进入 01',
    laneTask: '任务',
    laneIncident: '这个任务在等锁，同时仍占着一条载体线程。',
    laneRecovered: '等待的任务让出了载体线程，停在执行位置之外。',
    awakenedIncident: '锁已释放，E 也已被唤醒。但四条载体线程都被等待者占着，E 没有位置运行。',
    awakenedRecovered: '等待者让出载体线程，E 进入空出的位置，队列可以继续。',
    heading: '技术细节',
    finding:
      '堆转储显示锁没有持有者。队首虚拟线程收到了唤醒信号，但其余等待者在 synchronized 内阻塞，占满了四条载体线程。',
    fix: '团队将相关同步块改为显式锁，并把可能阻塞的调用移出临界区。发布后，压测恢复正常。',
    caveat: '任务编号与修复后的队列位置仅用于图解。',
    source: '中文原文',
    back: '返回文章'
  },
  en: {
    title: 'The Missing Lock',
    description: 'Investigate a Java 21 virtual-thread stall that stopped Tomcat serving requests.',
    simulation: 'Simulation',
    comparison: 'Compare the incident and the fix',
    incident: 'Incident',
    recovered: 'After the fix',
    slots: 'Carrier slots',
    full: '4 / 4 occupied',
    available: '1 / 4 occupied',
    open: 'Lock is free',
    queue: 'Ready queue',
    awakened: 'Signalled',
    entered: 'E entered 01',
    laneTask: 'Task',
    laneIncident: 'This task is waiting for the lock and still occupies a carrier thread.',
    laneRecovered: 'The waiting task has freed its carrier and moved off the slot.',
    awakenedIncident:
      'The lock is free and E has been signalled. All four carriers are occupied by waiters, so E has nowhere to run.',
    awakenedRecovered:
      'The waiters free their carriers. E takes a slot and the queue can move again.',
    heading: 'Technical details',
    finding:
      'A heap dump showed that the lock had no owner. The first virtual thread in line had been signalled, but the other waiters blocked inside synchronized and occupied all four carrier threads.',
    fix: 'The team replaced the affected synchronized blocks with explicit locks and moved potentially blocking calls outside critical sections. Load tests returned to normal after deployment.',
    caveat: 'Task labels and the queue positions after the fix are illustrative.',
    source: 'Chinese original',
    back: 'Back to articles'
  }
} as const;
