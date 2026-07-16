// ANBI Tech Solution - Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load admin stats
    loadAdminStats();
    loadAdminBookings();
    loadAdminQuotations();
});

async function loadAdminStats() {
    const statsEl = document.getElementById('adminStats');
    if (!statsEl) return;

    try {
        const data = await API.get('/admin/dashboard');
        if (data.success) {
            const s = data.stats;
            statsEl.innerHTML = `
                <div class="stat-card"><div class="stat-card-icon blue"><i class="fas fa-calendar-check"></i></div><div class="stat-card-info"><h3>${s.bookings.total}</h3><p>Total Bookings</p></div></div>
                <div class="stat-card"><div class="stat-card-icon orange"><i class="fas fa-clock"></i></div><div class="stat-card-info"><h3>${s.bookings.pending}</h3><p>Pending</p></div></div>
                <div class="stat-card"><div class="stat-card-icon green"><i class="fas fa-check-circle"></i></div><div class="stat-card-info"><h3>${s.bookings.completed}</h3><p>Completed</p></div></div>
                <div class="stat-card"><div class="stat-card-icon purple"><i class="fas fa-users-cog"></i></div><div class="stat-card-info"><h3>${s.technicians.total}</h3><p>Technicians</p></div></div>
            `;
        }
    } catch (e) {
        console.error('Failed to load stats:', e);
    }
}

async function loadAdminBookings() {
    const table = document.getElementById('adminBookingsTable');
    if (!table) return;

    try {
        const data = await API.get('/admin/bookings');
        if (data.success && data.bookings) {
            table.innerHTML = data.bookings.map(b => `
                <tr>
                    <td>${b.bookingId}</td>
                    <td>${b.fullName}</td>
                    <td>${b.service}</td>
                    <td>${formatDate(b.preferredDate)}</td>
                    <td>${statusBadge(b.status)}</td>
                    <td><button class="btn-sm btn-primary">View</button></td>
                </tr>
            `).join('');
        }
    } catch (e) {
        table.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">Failed to load bookings</td></tr>';
    }
}

async function loadAdminQuotations() {
    const table = document.getElementById('adminQuotationsTable');
    if (!table) return;

    try {
        const data = await API.get('/admin/quotations');
        if (data.success && data.quotations) {
            table.innerHTML = data.quotations.map(q => `
                <tr>
                    <td>${q.quoteId}</td>
                    <td>${q.name}</td>
                    <td>${q.serviceRequired}</td>
                    <td>${q.budget || 'N/A'}</td>
                    <td>${formatDate(q.createdAt)}</td>
                    <td>${statusBadge(q.status)}</td>
                    <td><button class="btn-sm btn-primary">View</button></td>
                </tr>
            `).join('');
        }
    } catch (e) {
        table.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">Failed to load quotations</td></tr>';
    }
}
