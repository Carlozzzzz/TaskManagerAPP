// src/components/Toast.jsx
import { useEffect, useState } from 'react';

// ADDED — type config: color + icon per type
const TYPE_STYLES = {
  error: {
    container: 'bg-red-50 border-red-200 text-red-700',
    icon: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-700',
    icon: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-700',
    icon: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function Toast({ toast, onHide }) {
  // ADDED — visible controls the fade-in/out animation
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      // ADDED — slight delay so CSS transition fires on mount
      const enterTimer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(enterTimer);
    } else {
      setVisible(false);
    }
  }, [toast]);

  // ADDED — don't render anything if no toast
  if (!toast) return null;

  const styles = TYPE_STYLES[toast.type] ?? TYPE_STYLES.error;

  return (
    // ADDED — fixed position: bottom-right corner, above everything
    <div
      className={`
        fixed bottom-6 right-6 z-50
        flex items-start gap-2
        border rounded-lg px-4 py-3 shadow-md
        text-sm max-w-sm w-full
        transition-all duration-300 ease-in-out
        ${styles.container}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {/* Icon */}
      {styles.icon}

      {/* Message */}
      <span className="flex-1 leading-snug">{toast.message}</span>

      {/* ADDED — dismiss button */}
      <button
        onClick={onHide}
        className="ml-1 opacity-50 hover:opacity-100 transition-opacity shrink-0"
        aria-label="Dismiss"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}