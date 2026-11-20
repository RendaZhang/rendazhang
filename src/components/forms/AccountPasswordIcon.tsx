interface AccountPasswordIconProps {
  shown: boolean;
}

export default function AccountPasswordIcon({ shown }: AccountPasswordIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shown ? (
        <path d="M3 3l18 18M10 10a3 3 0 0 0 4 4M9.2 5.4C10.1 5.1 11 5 12 5c5.3 0 8.7 5 9.5 7a13 13 0 0 1-2.2 3.3M6.2 6.6A15 15 0 0 0 2.5 12c.9 2 4.2 7 9.5 7 1.7 0 3.3-.5 4.6-1.3" />
      ) : (
        <>
          <path d="M2.5 12c.9-2 4.2-7 9.5-7s8.6 5 9.5 7c-.9 2-4.2 7-9.5 7s-8.6-5-9.5-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}
