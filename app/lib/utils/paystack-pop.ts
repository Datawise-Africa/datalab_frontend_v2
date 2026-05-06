/**
 * Paystack Inline JS (v2) loader.
 *
 * Loads the SDK on demand so it's not part of the initial bundle, then exposes
 * `PaystackPop` to open the checkout overlay inline (no new tab).
 */

const PAYSTACK_SCRIPT_SRC = 'https://js.paystack.co/v2/inline.js';

export interface PaystackResumeOptions {
  onSuccess?: (transaction: { reference: string; status: string }) => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
  onLoad?: () => void;
}

export interface PaystackPopInstance {
  resumeTransaction: (
    accessCode: string,
    options?: PaystackResumeOptions
  ) => void;
}

type PaystackPopConstructor = new () => PaystackPopInstance;

declare global {
  interface Window {
    PaystackPop?: PaystackPopConstructor;
  }
}

let scriptLoading: Promise<void> | null = null;

export async function loadPaystackPop(): Promise<PaystackPopConstructor> {
  if (typeof window === 'undefined') {
    throw new Error('Paystack can only load in the browser');
  }
  if (window.PaystackPop) return window.PaystackPop;

  scriptLoading ??= new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => {
        scriptLoading = null;
        reject(new Error('Failed to load Paystack SDK'));
      });
      return;
    }
    const script = document.createElement('script');
    script.src = PAYSTACK_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoading = null;
      reject(new Error('Failed to load Paystack SDK'));
    };
    document.body.appendChild(script);
  });

  await scriptLoading;
  if (!window.PaystackPop) {
    throw new Error('PaystackPop unavailable after SDK load');
  }
  return window.PaystackPop;
}

/**
 * Extract the access_code from a Paystack hosted checkout URL.
 * Example: "https://checkout.paystack.com/sdh1hamzmuw9mf1" → "sdh1hamzmuw9mf1"
 */
export function extractAccessCode(authorizationUrl: string): string {
  return authorizationUrl.split('/').filter(Boolean).pop() ?? '';
}
