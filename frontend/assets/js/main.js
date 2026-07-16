// ANBI Tech Solution - Main JavaScript
// Dashboard utilities

function showToast(message, type='success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed; bottom:20px; right:20px; padding:14px 24px;
        background:${type==='success'?'#10b981':'#ef4444'}; color:#fff;
        border-radius:8px; font-size:14px; z-index:9999;
        box-shadow:0 4px 12px rgba(0,0,0,0.15); animation:slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Simple localStorage-based store for demo
const Store = {
    get(key) { return JSON.parse(localStorage.getItem(key) || '[]'); },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
    add(key, item) { const data = this.get(key); data.push(item); this.set(key, data); },
    update(key, id, updates) {
        const data = this.get(key);
        const idx = data.findIndex(x => x.id === id || x._id === id);
        if (idx >= 0) { data[idx] = { ...data[idx], ...updates }; this.set(key, data); }
    }
};

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

// CSS animation
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform:translateX(100px); opacity:0; } to { transform:translateX(0); opacity:1; } }`;
document.head.appendChild(style);
