// ANBI Tech Solution - Frontend Authentication Utility
// Include this in all admin and technician dashboard pages

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
  return !!getToken();
}

function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

function isTechnician() {
  const user = getUser();
  return user && user.role === 'technician';
}

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
    logout();
    window.location.href = '/login.html';
    return;
  }

  return res.json();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  window.location.href = '/login.html';
}

function protectRoute(requiredRole) {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }

  const user = getUser();
  if (requiredRole && user.role !== requiredRole) {
    window.location.href = user.role === 'admin' ? '/admin/dashboard.html' : '/technician/dashboard.html';
    return false;
  }

  updateUserUI(user);
  return true;
}

function updateUserUI(user) {
  document.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = user.name;
  });

  document.querySelectorAll('[data-user-role]').forEach(el => {
    el.textContent = user.role === 'admin' ? 'Administrator' : 'Technician';
  });

  document.querySelectorAll('[data-user-avatar]').forEach(el => {
    el.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0057FF&color=fff`;
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(amount) {
  return 'NPR ' + amount.toLocaleString('en-IN');
}

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

function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getToken, getUser, isAuthenticated, isAdmin, isTechnician,
    apiCall, logout, protectRoute, updateUserUI,
    formatDate, formatCurrency, statusBadge, showLoading, showError
  };
}
