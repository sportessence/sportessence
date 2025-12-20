// Utility per Google reCAPTCHA v3

declare global {
  interface Window {
    grecaptcha: any;
  }
}

/**
 * Carica lo script di reCAPTCHA v3
 */
export function loadRecaptchaScript(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Controlla se lo script è già caricato
    if (typeof window.grecaptcha !== 'undefined') {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Errore caricamento reCAPTCHA'));
    
    document.head.appendChild(script);
  });
}

/**
 * Esegue reCAPTCHA v3 e restituisce il token
 */
export async function executeRecaptcha(
  action: string
): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  if (!siteKey) {
    console.warn('⚠️ NEXT_PUBLIC_RECAPTCHA_SITE_KEY non configurato');
    return null;
  }

  try {
    // Carica lo script se non è già stato caricato
    await loadRecaptchaScript(siteKey);
    
    // Attendi che grecaptcha sia pronto
    await new Promise<void>((resolve) => {
      window.grecaptcha.ready(() => resolve());
    });

    // Esegui reCAPTCHA
    const token = await window.grecaptcha.execute(siteKey, { action });
    
    return token;
  } catch (error) {
    console.error('Errore reCAPTCHA:', error);
    return null;
  }
}

/**
 * Verifica il token reCAPTCHA lato server
 * Da chiamare nelle Server Actions
 */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction?: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('❌ RECAPTCHA_SECRET_KEY non configurato');
    return { success: false, error: 'Configurazione reCAPTCHA mancante' };
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: 'Verifica reCAPTCHA fallita',
      };
    }

    // Verifica l'action se specificata
    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        error: 'Action reCAPTCHA non corrisponde',
      };
    }

    // reCAPTCHA v3 restituisce uno score da 0.0 a 1.0
    // 1.0 = molto probabilmente umano, 0.0 = molto probabilmente bot
    const score = data.score || 0;

    // Soglia consigliata: 0.5
    if (score < 0.5) {
      return {
        success: false,
        score,
        error: 'Score reCAPTCHA troppo basso (possibile bot)',
      };
    }

    return {
      success: true,
      score,
    };
  } catch (error) {
    console.error('Errore verifica reCAPTCHA:', error);
    return {
      success: false,
      error: 'Errore durante la verifica',
    };
  }
}