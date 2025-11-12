
let csrfToken = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadAdminData);
    }

    const resetBtn = document.getElementById('resetVotes');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetVotes);
    }
});

async function checkAuthStatus() {
    try {
        const response = await fetch('api/check_auth.php', {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success && data.logged_in) {
            csrfToken = data.csrf_token;
            showAdminDashboard();
            loadAdminData();
        } else {
            showLoginForm();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showLoginForm();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            csrfToken = data.csrf_token;
            errorDiv.style.display = 'none';
            showAdminDashboard();
            loadAdminData();
            if (typeof checkAdminBadge === 'function') checkAdminBadge();
        } else {
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.style.display = 'block';
    }
}

async function handleLogout() {
    try {
        await fetch('api/logout.php', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    csrfToken = null;
    showLoginForm();
    if (typeof checkAdminBadge === 'function') checkAdminBadge();
}

function showLoginForm() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.reset();
    }
}

function showAdminDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
}

async function loadAdminData() {
    try {
        const response = await fetch('api/admin_data.php', {
            credentials: 'include'
        });
        
        if (response.status === 401) {
            showLoginForm();
            return;
        }
        
        const data = await response.json();

        if (data.success) {
            displayAdminStats(data.stats);
            displayVoteTable(data.results);
            displayRecentVotes(data.recent_votes);
        } else {
            console.error('Error loading admin data:', data.message);
            if (data.message && data.message.includes('Authenticatie')) {
                showLoginForm();
            }
        }
    } catch (error) {
        console.error('Error fetching admin data:', error);
    }
}

function displayAdminStats(stats) {
    const totalVotesEl = document.getElementById('adminTotalVotes');
    const partyCountEl = document.getElementById('adminPartyCount');
    const lastVoteEl = document.getElementById('adminLastVote');
    
    if (totalVotesEl) totalVotesEl.textContent = stats.total_votes || 0;
    if (partyCountEl) partyCountEl.textContent = stats.party_count || 0;
    if (lastVoteEl) lastVoteEl.textContent = stats.last_vote_time || '-';
}

function displayVoteTable(results) {
    const tbody = document.getElementById('adminVoteTable');
    if (!tbody) return;

    const partijen = getPartijen();
    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

    tbody.innerHTML = '';

    results.forEach(result => {
        const partij = partijen.find(p => p.id === result.partij_id);
        if (!partij) return;

        const percentage = totalVotes > 0 ? ((result.votes / totalVotes) * 100).toFixed(1) : 0;

        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = partij.naam;
        nameCell.appendChild(nameStrong);
        
        const votesCell = document.createElement('td');
        votesCell.textContent = result.votes;
        
        const percentageCell = document.createElement('td');
        percentageCell.textContent = percentage + '%';
        
        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.9rem;';
        deleteBtn.textContent = 'Verwijder stemmen';
        deleteBtn.onclick = () => deletePartyVotes(partij.id, partij.naam);
        actionCell.appendChild(deleteBtn);
        
        row.appendChild(nameCell);
        row.appendChild(votesCell);
        row.appendChild(percentageCell);
        row.appendChild(actionCell);
        
        tbody.appendChild(row);
    });
}

function displayRecentVotes(recentVotes) {
    const tbody = document.getElementById('adminRecentVotes');
    if (!tbody) return;

    const partijen = getPartijen();

    tbody.innerHTML = '';

    if (recentVotes.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.style.textAlign = 'center';
        cell.textContent = 'Nog geen stemmen';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    recentVotes.slice(0, 20).forEach(vote => {
        const partij = partijen.find(p => p.id === vote.partij_id);
        if (!partij) return;

        const row = document.createElement('tr');
        
        const idCell = document.createElement('td');
        idCell.textContent = vote.stem_id;
        
        const partyCell = document.createElement('td');
        partyCell.textContent = partij.naam;
        
        const timeCell = document.createElement('td');
        timeCell.textContent = formatDateTime(vote.tijdstip);
        
        const ipCell = document.createElement('td');
        ipCell.textContent = vote.ip_adres || 'N/A';
        
        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.9rem;';
        deleteBtn.textContent = 'Verwijder';
        deleteBtn.onclick = () => deleteSingleVote(vote.stem_id);
        actionCell.appendChild(deleteBtn);
        
        row.appendChild(idCell);
        row.appendChild(partyCell);
        row.appendChild(timeCell);
        row.appendChild(ipCell);
        row.appendChild(actionCell);
        
        tbody.appendChild(row);
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

async function handleResetVotes() {
    if (!confirm('Weet je zeker dat je ALLE stemmen wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt!')) {
        return;
    }

    if (!csrfToken) {
        alert('Je bent niet ingelogd. Log opnieuw in.');
        showLoginForm();
        return;
    }

    try {
        const response = await fetch('api/reset_votes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({ csrf_token: csrfToken })
        });

        if (response.status === 401) {
            alert('Je sessie is verlopen. Log opnieuw in.');
            showLoginForm();
            return;
        }

        const result = await response.json();

        if (result.success) {
            alert('Alle stemmen zijn succesvol verwijderd!');
            loadAdminData();
        } else {
            alert('Er is een fout opgetreden: ' + result.message);
        }
    } catch (error) {
        console.error('Error resetting votes:', error);
        alert('Er is een fout opgetreden bij het verwijderen van stemmen.');
    }
}

async function deletePartyVotes(partyId, partyName) {
    if (!confirm(`Weet je zeker dat je alle stemmen voor ${partyName} wilt verwijderen?`)) {
        return;
    }

    if (!csrfToken) {
        alert('Je bent niet ingelogd. Log opnieuw in.');
        showLoginForm();
        return;
    }

    try {
        const response = await fetch('api/delete_party_votes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({ 
                partij_id: partyId,
                csrf_token: csrfToken 
            })
        });

        if (response.status === 401) {
            alert('Je sessie is verlopen. Log opnieuw in.');
            showLoginForm();
            return;
        }

        const result = await response.json();

        if (result.success) {
            alert(`Stemmen voor ${partyName} zijn verwijderd!`);
            loadAdminData();
        } else {
            alert('Er is een fout opgetreden: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting party votes:', error);
        alert('Er is een fout opgetreden.');
    }
}

async function deleteSingleVote(voteId) {
    if (!confirm('Weet je zeker dat je deze stem wilt verwijderen?')) {
        return;
    }

    if (!csrfToken) {
        alert('Je bent niet ingelogd. Log opnieuw in.');
        showLoginForm();
        return;
    }

    try {
        const response = await fetch('api/delete_vote.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({ 
                stem_id: voteId,
                csrf_token: csrfToken 
            })
        });

        if (response.status === 401) {
            alert('Je sessie is verlopen. Log opnieuw in.');
            showLoginForm();
            return;
        }

        const result = await response.json();

        if (result.success) {
            alert('Stem is verwijderd!');
            loadAdminData();
        } else {
            alert('Er is een fout opgetreden: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting vote:', error);
        alert('Er is een fout opgetreden.');
    }
}
