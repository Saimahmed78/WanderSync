
class ApiClient {
  constructor() {
    this.baseUrl = `${import.meta.env.VITE_BASE_URL}/api/v1`;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }
 
  async customFetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Making API call to: ${url} with options:`, options);
    const headers = { ...this.defaultHeaders, ...options.headers };
    const config = {
      credentials: "include",
      headers,
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw data;
    }
    return data;
  }

  // --- EXISTING AUTH METHODS ---

  // Register a new user
  async register(name, email, password) {
    return this.customFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Verify email with token
  async verify(token) {
    return this.customFetch(`/auth/verify/${token}`, {
      method: "GET",
    });
  }

  // Log in with email + password
  async login(email, password) {
    return this.customFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Resend verification email
  async resendVerifyEmail(email) {
    return this.customFetch("/auth/resendVerification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
  // Log out the current user
  async logOut() {
    return this.customFetch("/auth/logOut", {
      method: "GET",
    });
  }
  loginwithGoogle() {
    return `${this.baseUrl}/auth/google`;
  }

  // Get details of the current user
  async getMe() {
    return this.customFetch("/users/Me", {
      method: "GET",
    });
  }

  // Forgot password (send reset link)
  async forgotPass(email) {
    return this.customFetch("/auth/forgotPass", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Reset password with token
  async resetPass(token, password, confirmPass) {
    return this.customFetch(`/auth/resetPass/${token}`, {
      method: "POST",
      body: JSON.stringify({ password, confirmPass }),
    });
  }

  // Change password (while logged in)
  async changePass(oldPass, newPass, confirmPass) {
    return this.customFetch("/auth/changePass", {
      method: "POST",
      body: JSON.stringify({ oldPass, newPass, confirmPass }),
    });
  }

  // Delete account
  async deleteAccount(password) {
    return this.customFetch("/users/deleteAccount", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  }

  async getSessions() {
    return this.customFetch("/users/sessions", {
      method: "GET",
    });
  }

  // Revoke a specific session by ID
  async revokeSession(sessionId) {
    return this.customFetch(`/users/revokeSession/${sessionId}`, {
      method: "DELETE",
    });
  }

  // Revoke all sessions except the current one
  async revokeAllSessions() {
    return this.customFetch("/users/revokeAllSessions", {
      method: "DELETE",
    });
  }
  async updateIdentity(data) {
    return this.customFetch("/users/updateIdentity", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Update Preferences (Phone, Timezone)
  async updatePreferences(data) {
    return this.customFetch("/users/updateContact", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

const apiClient = new ApiClient();


export default apiClient;
