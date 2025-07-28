import React from 'react';

export default function LocalizedSection({ zhContent, enContent }) {
  return (
    <>
      <span className="lang-zh">{zhContent}</span>
      <span className="lang-en">{enContent}</span>
    </>
  );
}
