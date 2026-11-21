const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

export async function apiRequest(path, { body, token } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${apiOrigin}/api${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot reach the API. Start the backend, check its MongoDB connection, and verify VITE_API_URL.');
    }
    throw error;
  }

  const result = await response.json().catch(() => null);

  if (!result || typeof result !== 'object') {
    throw new Error('The server returned an unexpected response. Please try again.');
  }

  if (!response.ok || !result.success) {
    const error = new Error(result.message || 'Something went wrong. Please try again.');
    error.status = response.status;
    throw error;
  }

  return result.data || {};
}
