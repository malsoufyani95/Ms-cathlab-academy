import { useEffect, useState } from 'react';

function readStoredValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;

    try {
      return JSON.parse(stored);
    } catch {
      // Supports values saved by earlier versions without JSON encoding.
      return stored;
    }
  } catch {
    return fallback;
  }
}

export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => readStoredValue(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // The platform still works when storage is unavailable or in private mode.
    }
  }, [key, state]);

  return [state, setState];
}
