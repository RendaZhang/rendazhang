import { useState } from 'react';
export default function Test() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>;
}
