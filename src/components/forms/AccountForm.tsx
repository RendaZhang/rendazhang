import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

interface AccountFormProps {
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function AccountForm({ children, onSubmit }: AccountFormProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <form
      className="c-account-form"
      method="post"
      onSubmit={(event) => {
        event.preventDefault();
        if (isReady) void onSubmit(event);
      }}
    >
      {/* Static pages cannot receive a native form POST before the island is ready. */}
      <fieldset aria-labelledby="account-title" disabled={!isReady}>
        {children}
      </fieldset>
    </form>
  );
}
