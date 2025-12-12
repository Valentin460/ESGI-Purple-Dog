import apiService from './api.service';

class AuthService {
  // Inscription
  async register(userData) {
    const response = await apiService.post('/api/auth/register', userData);

    // Sauvegarder le token si retourné lors de l'inscription
    if (response.token) {
      this.saveToken(response.token);
      this.saveUser(response.user);
    }

    return response;
  }

  // Connexion
  async login(credentials) {
    const response = await apiService.post('/api/auth/login', credentials);

    // Sauvegarder le token et les informations utilisateur
    // Le backend renvoie : { success, data: { user, accessToken, refreshToken } }
    if (response.data && response.data.accessToken) {
      this.saveToken(response.data.accessToken);
      this.saveUser(response.data.user);
    }

    return response;
  }

  // Déconnexion
  async logout() {
    try {
      await apiService.post('/api/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Obtenir l'utilisateur connecté
  async getCurrentUser() {
    return apiService.get('/api/auth/me');
  }

  // Rafraîchir le token
  async refreshToken() {
    const response = await apiService.post('/api/auth/refresh');

    if (response.token) {
      this.saveToken(response.token);
    }

    return response;
  }

  // Vérifier l'email
  async verifyEmail(token) {
    return apiService.post('/api/auth/verify-email', { token });
  }

  // Sauvegarder le token
  saveToken(token) {
    localStorage.setItem('token', token);
    // Déclencher un événement pour notifier les composants
    window.dispatchEvent(new Event('auth-change'));
  }

  // Sauvegarder les informations utilisateur
  saveUser(user) {
    localStorage.setItem('userId', user.id || user.user_id);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userType', user.type || user.user_type);
    localStorage.setItem('user', JSON.stringify(user));
    // Déclencher un événement pour notifier les composants
    window.dispatchEvent(new Event('auth-change'));
  }

  // Récupérer le token
  getToken() {
    return localStorage.getItem('token');
  }

  // Récupérer l'utilisateur
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.getToken();
  }

  // Nettoyer l'authentification
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');

    // Déclencher un événement custom pour notifier les composants
    window.dispatchEvent(new Event('auth-change'));
  }
}

export default new AuthService();
