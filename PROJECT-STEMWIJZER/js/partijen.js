
document.addEventListener('DOMContentLoaded', function() {
    loadPartijen();
});

function loadPartijen() {
    const partijenGrid = document.getElementById('partijenGrid');
    const partijen = getPartijen();

    if (!partijenGrid) return;

    partijenGrid.innerHTML = '';

    partijen.forEach(partij => {
        const card = createPartijCard(partij);
        partijenGrid.appendChild(card);
    });
}

function createPartijCard(partij) {
    const card = document.createElement('div');
    card.className = 'partij-card';
    card.style.borderLeftColor = partij.color;

    const imageHtml = partij.image ? `
        <div class="partij-image">
            <img src="${partij.image}" alt="${partij.naam} logo" onerror="this.parentElement.style.display='none'">
        </div>
    ` : '';

    card.innerHTML = `
        ${imageHtml}
        <div class="partij-header">
            <h3>${partij.naam}</h3>
            <p class="partij-slogan">"${partij.slogan}"</p>
        </div>
        <div class="partij-standpunten">
            <h4>Belangrijkste standpunten:</h4>
            <ul>
                ${partij.standpunten.map(standpunt => `<li>${standpunt}</li>`).join('')}
            </ul>
        </div>
    `;

    return card;
}

