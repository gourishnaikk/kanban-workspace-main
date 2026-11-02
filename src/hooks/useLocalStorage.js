import { useState, useEffect } from 'react';

/**
 * Generic custom hook for persisting state in browser localStorage.
 * 
 * @param {string} key - The localStorage key.
 * @param {any} initialValue - The fallback initial value.
 * @returns {[any, (value: any) => void]} State value and setter function.
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
