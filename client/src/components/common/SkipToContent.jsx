import React from 'react';

export function SkipToContent({ targetId = 'main-content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link focus-visible:outline-none"
    >
      Skip to main content
    </a>
  );
}

