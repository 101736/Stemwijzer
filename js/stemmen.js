
let selectedPartyId = null;

document.addEventListener('DOMContentLoaded', function() {
    if (hasVoted()) {
        document.getElementById('votingSection').style.display = 'none';
        document.getElementById('alreadyVoted').style.display = 'block';
    } else {
        loadVotingPartijen();
    }

    setupModalListeners();
});

function loadVotingPartijen() {
    const partijenVoting = document.getElementById('partijenVoting');
    const partijen = getPartijen();

    if (!partijenVoting) return;

    partijenVoting.innerHTML = '';

    partijen.forEach(partij => {
        const card = createVoteCard(partij);
        partijenVoting.appendChild(card);
    });
}

function createVoteCard(partij) {
    const card = document.createElement('div');
    card.className = 'vote-card';

    const imageHtml = partij.image ? `
        <div class="partij-image-small">
            <img src="${partij.image}" alt="${partij.naam} logo" onerror="this.parentElement.style.display='none'">
        </div>
    ` : '';

    card.innerHTML = `
        ${imageHtml}
        <h3>${partij.naam}</h3>
        <p class="partij-slogan">${partij.slogan}</p>
        <p><strong>Standpunten:</strong></p>
        <ul style="text-align: left; margin-bottom: 1rem;">
            ${partij.standpunten.slice(0, 3).map(standpunt => `<li>${standpunt}</li>`).join('')}
        </ul>
        <button class="btn btn-primary vote-btn" onclick="openVoteModal(${partij.id}, '${partij.naam}')">
            Stem op ${partij.naam}
        </button>
    `;

    return card;
}

function openVoteModal(partyId, partyName) {
    selectedPartyId = partyId;
    document.getElementById('selectedParty').textContent = partyName;
    document.getElementById('voteModal').classList.add('show');
}

function closeVoteModal() {
    document.getElementById('voteModal').classList.remove('show');
    selectedPartyId = null;
}

function setupModalListeners() {
    const voteModal = document.getElementById('voteModal');
    const successModal = document.getElementById('successModal');
    const confirmVoteBtn = document.getElementById('confirmVote');
    const cancelVoteBtn = document.getElementById('cancelVote');

    voteModal.addEventListener('click', function(e) {
        if (e.target === voteModal) {
            closeVoteModal();
        }
    });

    cancelVoteBtn.addEventListener('click', closeVoteModal);

    confirmVoteBtn.addEventListener('click', async function() {
        if (selectedPartyId) {
            await submitVote(selectedPartyId);
        }
    });
}

async function submitVote(partyId) {
    try {
        const cookieId = getCookieID();

        const voteData = {
            partij_id: partyId,
            cookie_id: cookieId
        };

        const response = await fetch('api/submit_vote.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(voteData)
        });

        const result = await response.json();

        if (result.success) {
            markAsVoted();

            closeVoteModal();
            document.getElementById('successModal').classList.add('show');
        } else {
            alert('Er is een fout opgetreden bij het uitbrengen van je stem. Probeer het opnieuw.');
        }
    } catch (error) {
        console.error('Error submitting vote:', error);
        alert('Er is een fout opgetreden. Probeer het later opnieuw.');
    }
}

