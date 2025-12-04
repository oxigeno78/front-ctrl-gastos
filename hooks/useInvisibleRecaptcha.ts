import { useEffect, useRef, useState } from 'react';
import { recaptcha as recaptchaConfig } from '@/config/env';

declare global {
  interface Window {
    grecaptcha?: any;
    onInvisibleRecaptchaLoad?: () => void;
  }
}

export const useInvisibleRecaptcha = (action: string) => {
  const [ready, setReady] = useState(false);
  const widgetIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!recaptchaConfig.enabled) {
      console.warn('reCAPTCHA no está configurado (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)');
      return;
    }

    if (!containerRef.current) {
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);
      containerRef.current = container;
    }

    const renderWidget = () => {
      if (!window.grecaptcha || !containerRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: recaptchaConfig.siteKey,
        size: 'invisible',
        badge: 'bottomright',
      });
      setReady(true);
    };

    const onLoad = () => {
      if (!window.grecaptcha) return;
      window.grecaptcha.ready(() => {
        renderWidget();
      });
    };

    if (window.grecaptcha) {
      onLoad();
      return;
    }

    window.onInvisibleRecaptchaLoad = onLoad;

    const existingScript = document.querySelector<HTMLScriptElement>('script[src^="https://www.google.com/recaptcha/api.js"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onInvisibleRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // No removemos el script por si otros componentes lo usan
    };
  }, []);

  const executeRecaptcha = async (): Promise<string> => {
    if (typeof window === 'undefined') throw new Error('reCAPTCHA no disponible en el servidor');
    if (!recaptchaConfig.enabled) throw new Error('reCAPTCHA no está configurado');
    if (!ready || widgetIdRef.current === null || !window.grecaptcha) {
      throw new Error('reCAPTCHA aún no está listo, inténtalo de nuevo');
    }

    return new Promise<string>((resolve, reject) => {
      try {
        window.grecaptcha.execute(widgetIdRef.current as number, { action }).then((token: string) => {
          if (!token) {
            reject(new Error('No se obtuvo token de reCAPTCHA'));
          } else {
            resolve(token);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  return { executeRecaptcha, ready };
};
