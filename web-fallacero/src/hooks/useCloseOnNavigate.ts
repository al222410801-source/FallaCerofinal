import { useEffect } from 'react';

// Hook to register a close callback that fires on navigation (when Layout dispatches `close-ui`).
export default function useCloseOnNavigate(handler: () => void) {
  useEffect(() => {
    const cb = () => handler();
    window.addEventListener('close-ui', cb as EventListener);
    return () => window.removeEventListener('close-ui', cb as EventListener);
  }, [handler]);
}
