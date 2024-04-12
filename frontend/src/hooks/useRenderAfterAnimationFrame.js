import { useState, useEffect } from 'react';

export const useRenderAfterAnimationFrame = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setShouldRender(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  return shouldRender;
};