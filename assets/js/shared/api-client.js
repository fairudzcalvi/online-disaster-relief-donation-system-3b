// API Client - Handles all backend communication
class APIClient {
  constructor() {
    this.baseURL = '/online_disaster/public_html/api/auth/';
  }

  async request(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: {}
    };

    const token = sessionStorage.getItem('adminToken');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      if (data instanceof FormData) {
        options.body = data;
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  }

  // Auth
  async login(username, password) {
    return this.request('login.php', 'POST', { username, password });
  }

  async logout() {
    return this.request('logout.php', 'POST');
  }

  // Donations
  async getDonations() {
    return this.request('get_donations.php');
  }

  async saveDonation(data) {
    return this.request('save_donation.php', 'POST', data);
  }

  // In-Kind Items
  async getItems() {
    return this.request('get_items.php');
  }

  async saveItem(formData) {
    return this.request('save_item.php', 'POST', formData);
  }

  // Distributions
  async getDistributions() {
    return this.request('get_distributions.php');
  }

  async saveDistribution(formData) {
    return this.request('save_distribution.php', 'POST', formData);
  }

  // Organizations
  async getOrganizations() {
    return this.request('get_organizations.php');
  }

  async saveOrganization(formData) {
    return this.request('save_organizations.php', 'POST', formData);
  }
}

export const api = new APIClient();
