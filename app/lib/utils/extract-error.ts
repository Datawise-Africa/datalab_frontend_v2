import axios from 'axios';

function messageFromPayload(payload: unknown, field?: string): string | null {
  if (typeof payload === 'string') {
    if (payload.trim().startsWith('<')) return null;
    return field ? `${field}: ${payload}` : payload;
  }
  if (Array.isArray(payload)) {
    return payload.length ? messageFromPayload(payload[0], field) : null;
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of ['detail', 'message', 'error']) {
      const message = messageFromPayload(record[key]);
      if (message) return message;
    }
    for (const [key, value] of Object.entries(record)) {
      const message = messageFromPayload(
        value,
        key === 'non_field_errors' ? undefined : key
      );
      if (message) return message;
    }
  }
  return null;
}

export function extractError(error: unknown, fallbackMessage?: string): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = messageFromPayload(error.response?.data);
    if (responseMessage) return responseMessage;
    if (!error.response) {
      return 'The server could not be reached. Check your connection and try again.';
    }
    if (error.response.status >= 500) {
      return 'The server encountered an error while processing this request. Please try again.';
    }
    return fallbackMessage || `The request failed (${error.response.status}).`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage || 'An unknown error occurred';
}
