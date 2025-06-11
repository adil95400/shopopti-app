import axios from 'axios';

// Updated list of reliable CORS proxies
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?',
  'https://proxy.cors.sh/',
  'https://cors-anywhere.herokuapp.com/'
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 1000,
  maxDelay = 10000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (i === retries - 1) break;

      const delayTime = Math.min(baseDelay * Math.pow(2, i), maxDelay);
      await delay(delayTime);
      console.warn(`Retry attempt ${i + 1} failed, retrying in ${delayTime}ms...`);
    }
  }

  throw lastError || new Error('All retry attempts failed');
};

const checkProxyAvailability = async (proxyUrl: string): Promise<boolean> => {
  try {
    const testUrl = 'https://www.amazon.com';
    const response = await axios.get(`${proxyUrl}${encodeURIComponent(testUrl)}`, {
      timeout: 5000,
      validateStatus: status => status === 200
    });
    return (
      response.data &&
      typeof response.data === 'string' &&
      response.data.includes('<!DOCTYPE html>')
    );
  } catch {
    return false;
  }
};

export const findWorkingProxy = async (): Promise<string> => {
  const proxyPromises = CORS_PROXIES.map(async proxy => {
    const isAvailable = await checkProxyAvailability(proxy);
    return isAvailable ? proxy : null;
  });

  const results = await Promise.all(proxyPromises);
  const workingProxy = results.find(proxy => proxy !== null);

  if (!workingProxy) {
    throw new Error(
      "Aucun proxy CORS n'est disponible actuellement. Veuillez:\n" +
        '1. Vérifier votre connexion internet\n' +
        '2. Désactiver votre bloqueur de publicités si vous en utilisez un\n' +
        '3. Réessayer dans quelques minutes'
    );
  }

  return workingProxy as string;
};
