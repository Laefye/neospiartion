const API_BASE_URL = '/api'; // Set your base URL

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  headers.set('Content-Type', 'application/json');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'An error occurred';
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.title || errorData.message || errorMessage;
    } 
    catch
    {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return {} as T;
  }
  const data = await response.json();
  return data;
}

export function createApiClient(token: string | null) {
  return {
    login: (email: string, password: string) =>
      apiRequest<{ token: string; userId: string; email: string; userName: string; profileId?: number }>(
        '/user/authentication',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      ),
    
    register: (email: string, userName: string, password: string) =>
      apiRequest<{ token: string; userId: string; email: string; userName: string; profileId?: number }>(
        '/user',
        {
          method: 'POST',
          body: JSON.stringify({ email, userName, password }),
        }
      ),
    
    getCurrentUser: () =>
      apiRequest<{ userId: string; email: string; userName: string; profileId?: number }>(
        '/user/me',
        { token }
      ),
  };
}