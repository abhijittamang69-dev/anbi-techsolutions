// ANBI Tech Solution - Frontend Authentication Utility
// Include this in all admin and technician dashboard pages

// Dynamic API base: use relative path on Render, full URL elsewhere
const API_BASE = (() => {
  const hostname = location.hostname;
  if (hostname === 'anbi-tech.onrender.com') return '/api';
  return 'https://anbi-tech.onrender.com/api';
})();

// Base site URL for redirects (prevents broken redirects when opening files locally)
const SITE_URL = (() => {
  const hostname = location.hostname;
  if (hostname === 'anbi-tech.onrender.com') return '';
  return 'https://anbi-tech.onrender.com';
})();

// Get auth token
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// Get current user
function getUser() {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Check if authenticated
function isAuthenticated() {
  return !!getToken();
}

// Check if admin
function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

// Check if technician
function isTechnician() {
  const user = getUser();
  return user && user.role === 'technician';
}

// API call with auth header
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expired or invalid
    logout();
    return;
  }

  return res.json();
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  window.location.href = SITE_URL + '/login.html';
}

// Protect route - call this at the top of each protected page
function protectRoute(requiredRole) {
  if (!isAuthenticated()) {
    window.location.href = SITE_URL + '/login.html';
    return false;
  }

  const user = getUser();
  if (requiredRole && user.role !== requiredRole) {
    window.location.href = user.role === 'admin'
      ? SITE_URL + '/admin/dashboard.html'
      : SITE_URL + '/technician/dashboard.html';
    return false;
  }

  // Update UI with user info
  updateUserUI(user);
  return true;
}

// Update UI elements with user data
function updateUserUI(user) {
  // Update user name display
  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = user.name;
  });

  // Update user role display
  document.querySelectorAll('[data-user-role]').forEach(el => {
    el.textContent = user.role === 'admin' ? 'Administrator' : 'Technician';
  });

  // Update avatar if exists
  document.querySelectorAll('[data-user-avatar]').forEach(el => {
    el.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0057FF&color=fff`;
  });
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format currency (NPR)
function formatCurrency(amount) {
  return 'NPR ' + amount.toLocaleString('en-IN');
}

// Status badge HTML
function statusBadge(status) {
  const classes = {
    'pending': 'status-pending',
    'confirmed': 'status-inprogress',
    'in-progress': 'status-inprogress',
    'completed': 'status-completed',
    'cancelled': 'status-rejected',
    'approved': 'status-approved',
    'rejected': 'status-rejected',
    'unread': 'status-pending',
    'read': 'status-completed',
    'replied': 'status-approved',
  };
  const className = classes[status] || 'status-pending';
  return `<span class="status-badge ${className}">${status.replace('-', ' ').toUpperCase()}</span>`;
}

// Show loading spinner
function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
}

// Show error message
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getToken, getUser, isAuthenticated, isAdmin, isTechnician,
    apiCall, logout, protectRoute, updateUserUI,
    formatDate, formatCurrency, statusBadge, showLoading, showError
  };
}
