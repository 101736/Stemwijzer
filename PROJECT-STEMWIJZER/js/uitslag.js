
let voteChart = null;

document.addEventListener('DOMContentLoaded', function() {
    loadResults();
    
    const refreshBtn = document.getElementById('refreshResults');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadResults);
    }

    setInterval(loadResults, 30000);
});

async function loadResults() {
    try {
        const response = await fetch('api/get_results.php');
        const data = await response.json();

        if (data.success) {
            displaySummary(data.summary);
            displayChart(data.results);
            displayTable(data.results);
        } else {
            console.error('Error loading results:', data.message);
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        displayDummyData();
    }
}

function displaySummary(summary) {
    document.getElementById('totalVotes').textContent = summary.total_votes || 0;
    document.getElementById('topParty').textContent = summary.top_party || '-';
    document.getElementById('partyCount').textContent = summary.party_count || 0;
}

function displayChart(results) {
    const ctx = document.getElementById('voteChart');
    if (!ctx) return;

    const partijen = getPartijen();
    const labels = [];
    const data = [];
    const colors = [];

    results.forEach(result => {
        const partij = partijen.find(p => p.id === result.partij_id);
        if (partij) {
            labels.push(partij.naam);
            data.push(result.votes);
            colors.push(partij.color);
        }
    });

    if (voteChart) {
        voteChart.destroy();
    }

    voteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Aantal Stemmen',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Stemverdeling per Partij',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function displayTable(results) {
    const tbody = document.getElementById('resultsBody');
    if (!tbody) return;

    const partijen = getPartijen();
    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

    tbody.innerHTML = '';

    results.forEach((result, index) => {
        const partij = partijen.find(p => p.id === result.partij_id);
        if (!partij) return;

        const percentage = totalVotes > 0 ? ((result.votes / totalVotes) * 100).toFixed(1) : 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>
                <span style="display: inline-block; width: 15px; height: 15px; background-color: ${partij.color}; border-radius: 3px; margin-right: 8px;"></span>
                ${partij.naam}
            </td>
            <td><strong>${result.votes}</strong></td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex: 1; background-color: #e0e0e0; border-radius: 5px; height: 20px; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background-color: ${partij.color};"></div>
                    </div>
                    <span><strong>${percentage}%</strong></span>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayDummyData() {
    const dummyResults = [
        { partij_id: 1, votes: 15 },
        { partij_id: 2, votes: 23 },
        { partij_id: 3, votes: 31 },
        { partij_id: 4, votes: 12 },
        { partij_id: 5, votes: 8 },
        { partij_id: 6, votes: 7 },
        { partij_id: 7, votes: 19 },
        { partij_id: 8, votes: 14 },
        { partij_id: 9, votes: 11 }
    ].sort((a, b) => b.votes - a.votes);

    const totalVotes = dummyResults.reduce((sum, r) => sum + r.votes, 0);
    const partijen = getPartijen();
    const topParty = partijen.find(p => p.id === dummyResults[0].partij_id);

    const summary = {
        total_votes: totalVotes,
        top_party: topParty ? topParty.naam : '-',
        party_count: partijen.length
    };

    displaySummary(summary);
    displayChart(dummyResults);
    displayTable(dummyResults);
}

