
document.addEventListener('DOMContentLoaded', function() {
    loadCarouselLogos();
});

function loadCarouselLogos() {
    const container1 = document.getElementById('partyLogos1');
    const container2 = document.getElementById('partyLogos2');
    
    if (!container1 || !container2) return;
    
    const partijen = getPartijen();
    
    partijen.forEach(partij => {
        const logo1 = createLogoElement(partij);
        const logo2 = createLogoElement(partij);
        
        container1.appendChild(logo1);
        container2.appendChild(logo2);
    });
}

function createLogoElement(partij) {
    const logoItem = document.createElement('div');
    logoItem.className = 'party-logo-item';
    logoItem.title = partij.naam;
    
    if (partij.image) {
        const img = document.createElement('img');
        img.src = partij.image;
        img.alt = `${partij.naam} logo`;
        img.onerror = function() {
            this.parentElement.innerHTML = `<div style="width: 80px; height: 80px; border-radius: 50%; background-color: ${partij.color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">${partij.naam.charAt(0)}</div>`;
        };
        logoItem.appendChild(img);
    } else {
        logoItem.innerHTML = `<div style="width: 80px; height: 80px; border-radius: 50%; background-color: ${partij.color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">${partij.naam.charAt(0)}</div>`;
    }
    
    logoItem.style.cursor = 'pointer';
    logoItem.addEventListener('click', () => {
        window.location.href = 'partijen.html';
    });
    
    return logoItem;
}

