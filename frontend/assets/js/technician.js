// ANBI Tech Solution - Technician Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadTechJobs();
});

async function loadTechJobs() {
    const table = document.getElementById('techJobsTable');
    if (!table) return;

    try {
        const data = await API.get('/tech/jobs');
        if (data.success && data.jobs) {
            table.innerHTML = data.jobs.map(j => `
                <tr>
                    <td>${j.bookingId}</td>
                    <td>${j.service}</td>
                    <td>${j.fullName}</td>
                    <td>${j.district}</td>
                    <td>${formatDate(j.preferredDate)}</td>
                    <td>${statusBadge(j.status)}</td>
                    <td><a href="job-details.html?id=${j._id}" class="btn-sm btn-primary">View</a></td>
                </tr>
            `).join('');
        } else {
            table.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">No jobs assigned yet</td></tr>';
        }
    } catch (e) {
        table.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">Failed to load jobs</td></tr>';
    }
}
