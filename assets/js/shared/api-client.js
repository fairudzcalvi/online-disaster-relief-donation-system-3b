// API Client - Handles all backend communication
class APIClient {
  constructor() {
    this.baseURL = 'api'; // Adjust based on your server setup
  }

  async request(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Add admin token if logged in
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API request failed');
      }

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth API
  async login(username, password) {
    return this.request('../../../api/auth/login.php', 'POST', { username, password });
  }

  async logout() {
    return this.request('./auth/logout.php', 'POST');
  }


}

// Export singleton instance
export const api = new APIClient();