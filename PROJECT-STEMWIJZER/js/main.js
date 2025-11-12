
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    const messages = document.querySelectorAll('.message');
    if (messages.length > 0) {
        let currentIndex = 0;

        function rotateMessages() {
            messages[currentIndex].classList.remove('current');

            currentIndex = (currentIndex + 1) % messages.length;

            messages[currentIndex].classList.add('current');
        }

        setInterval(rotateMessages, 4000);
    }

    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlideIndex = 0;

        function rotateHeroSlides() {
            heroSlides[currentSlideIndex].classList.remove('active');

            currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;

            heroSlides[currentSlideIndex].classList.add('active');
        }

        setInterval(rotateHeroSlides, 3000);
    }
    checkAdminBadge();
});

async function checkAdminBadge() {
    try {
        const res = await fetch('api/check_auth.php', { credentials: 'include' });
        const data = await res.json();
        const existing = document.getElementById('adminBadge');
        if (data && data.logged_in) {
            if (!existing) {
                const badge = document.createElement('div');
                badge.id = 'adminBadge';
                badge.className = 'admin-badge';
                badge.innerHTML = '<i class="fas fa-user-shield"></i><span>Ingelogd als admin</span>';
                const dateEl = document.querySelector('.election-date-fixed');
                if (dateEl && dateEl.parentNode) {
                    dateEl.insertAdjacentElement('afterend', badge);
                } else {
                    const container = document.querySelector('.info-bar-content');
                    if (container) container.appendChild(badge);
                }
            }
        } else {
            if (existing) existing.remove();
        }
    } catch (err) {
        console.error('Failed to fetch auth status', err);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error getting IP:', error);
        return 'unknown';
    }
}

function getCookieID() {
    let cookieID = localStorage.getItem('stemwijzer_cookie_id');
    if (!cookieID) {
        cookieID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('stemwijzer_cookie_id', cookieID);
    }
    return cookieID;
}

function hasVoted() {
    return localStorage.getItem('stemwijzer_has_voted') === 'true';
}

function markAsVoted() {
    localStorage.setItem('stemwijzer_has_voted', 'true');
}

function getPartijen() {
    return [
        {
            id: 1,
            naam: 'VVD',
            slogan: 'Vrijheid en verantwoordelijkheid',
            standpunten: [
                'Lagere belastingen voor werkenden',
                'Strengere aanpak criminaliteit',
                'Investeren in onderwijs en innovatie',
                'Sterke economie en banen'
            ],
            color: '#003DA5',
            image: 'img/partijen/VVD.png'
        },
        {
            id: 2,
            naam: 'PvdA',
            slogan: 'Iedereen doet mee',
            standpunten: [
                'Eerlijke verdeling van welvaart',
                'Investeren in zorg en onderwijs',
                'Duurzame banen voor iedereen',
                'Betaalbare woningen voor jongeren'
            ],
            color: '#DC143C',
            image: 'img/partijen/PvdA_logo.png'
        },
        {
            id: 3,
            naam: 'GroenLinks',
            slogan: 'Durven dromen van een betere wereld',
            standpunten: [
                'Klimaat als topprioriteit',
                'Gratis openbaar vervoer voor jongeren',
                'Eerlijke verdeling van rijkdom',
                'Investeren in duurzame energie'
            ],
            color: '#82BC00',
            image: 'img/partijen/GroenLinks_logo_(variant).png'
        },
        {
            id: 4,
            naam: 'D66',
            slogan: 'Nieuw leiderschap',
            standpunten: [
                'Investeren in onderwijs en innovatie',
                'Versterken democratie',
                'Progressieve maatschappij',
                'Duurzaamheid en digitalisering'
            ],
            color: '#00AE9D',
            image: 'img/partijen/D66.webp'
        },
        {
            id: 5,
            naam: 'SP',
            slogan: 'Voor elkaar',
            standpunten: [
                'Betaalbare zorg voor iedereen',
                'Bestrijden van armoede',
                'Eerlijke lonen',
                'Stoppen met privatisering'
            ],
            color: '#FF0000',
            image: 'img/partijen/SP.png'
        },
        {
            id: 6,
            naam: 'ChristenUnie',
            slogan: 'Hoop, liefde en solidariteit',
            standpunten: [
                'Beschermen van de schepping',
                'Ondersteuning voor gezinnen',
                'Betaalbare zorg',
                'Christelijke normen en waarden'
            ],
            color: '#00A7EB',
            image: 'img/partijen/ChristenUnie.png'
        },
        {
            id: 7,
            naam: 'PVV',
            slogan: 'Nederland weer van ons',
            standpunten: [
                'Minder immigratie',
                'Lagere belastingen',
                'Meer blauw op straat',
                'Beschermen Nederlandse cultuur'
            ],
            color: '#0A0A0A',
            image: 'img/partijen/pvv.png'
        },
        {
            id: 8,
            naam: 'Partij voor de Dieren',
            slogan: 'Moed om vooruit te gaan',
            standpunten: [
                'Dierenwelzijn voorop',
                'Klimaatcrisis aanpakken',
                'Plantaardiger voedsel',
                'Beschermen van natuur'
            ],
            color: '#00913A',
            image: 'img/partijen/parij van de dieren.png'
        },
        {
            id: 9,
            naam: 'CDA',
            slogan: 'Samen sterker',
            standpunten: [
                'Versterken van gemeenschappen',
                'Investeren in zorg en veiligheid',
                'Ondersteuning voor ondernemers',
                'Beschermen van tradities'
            ],
            color: '#00A759',
            image: 'img/partijen/CDA.png'
        },
        {
            id: 10,
            naam: 'SGP',
            slogan: 'Trouw aan God en Oranje',
            standpunten: [
                'Christelijke grondslag',
                'Beschermen gezinnen',
                'Bewaren tradities',
                'Respect voor autoriteit'
            ],
            color: '#E87800',
            image: 'img/partijen/SGP.png'
        },
        {
            id: 11,
            naam: 'DENK',
            slogan: 'Gelijkwaardigheid en rechtvaardigheid',
            standpunten: [
                'Bestrijden discriminatie',
                'Gelijke kansen voor iedereen',
                'Betaalbare zorg en onderwijs',
                'Sociale rechtvaardigheid'
            ],
            color: '#00B8C8',
            image: 'img/partijen/DENK.svg'
        },
        {
            id: 12,
            naam: 'FvD',
            slogan: 'Herstel de democratie',
            standpunten: [
                'Directe democratie',
                'Lagere belastingen',
                'Soevereiniteit behouden',
                'Herstel cultuur'
            ],
            color: '#8B1214',
            image: 'img/partijen/Forum_voor_democratie.png'
        },
        {
            id: 13,
            naam: 'JA21',
            slogan: 'Verstandig en betaalbaar',
            standpunten: [
                'Streng migratiebeleid',
                'Lagere belastingen',
                'Betaalbare zorg',
                'Veiligheid voorop'
            ],
            color: '#0B3D91',
            image: 'img/partijen/JA21.png'
        },
        {
            id: 14,
            naam: 'Volt',
            slogan: 'Nieuwe politiek voor Nederland',
            standpunten: [
                'Europese samenwerking',
                'Duurzaamheid en innovatie',
                'Progressieve maatschappij',
                'Digitalisering'
            ],
            color: '#502379',
            image: 'img/partijen/volt.png'
        },
        {
            id: 15,
            naam: 'BBB',
            slogan: 'Stem voor het platteland',
            standpunten: [
                'Beschermen boeren',
                'Platteland centraal',
                'Stoppen stikstofbeleid',
                'Landelijk wonen'
            ],
            color: '#92C83E',
            image: 'img/partijen/BoerBurgerBeweging.png'
        },
        {
            id: 16,
            naam: 'NSC',
            slogan: 'Nieuw Sociaal Contract',
            standpunten: [
                'Normen en waarden',
                'Betaalbare zorg',
                'Goed bestuur',
                'Sociale cohesie'
            ],
            color: '#00AEEF',
            image: 'img/partijen/NSC.svg'
        },
        {
            id: 17,
            naam: '50PLUS',
            slogan: 'Stem voor de ouderen',
            standpunten: [
                'Betaalbare zorg',
                'Hogere AOW',
                'Waardigheid voor ouderen',
                'Pensioen beschermen'
            ],
            color: '#7F3F98',
            image: 'img/partijen/50PLUS.png'
        },
        {
            id: 18,
            naam: 'BIJ1',
            slogan: 'Voor radicale gelijkwaardigheid',
            standpunten: [
                'Anti-racisme',
                'Klimaatrechtvaardigheid',
                'Basisinkomen',
                'Gelijke rechten voor iedereen'
            ],
            color: '#FFE500',
            image: 'img/partijen/Bij1.png'
        },
        {
            id: 19,
            naam: 'Piratenpartij',
            slogan: 'Voor privacy en transparantie',
            standpunten: [
                'Digitale privacy',
                'Transparante overheid',
                'Vrij internet',
                'Open data'
            ],
            color: '#660099',
            image: 'img/partijen/Piratenpartij.png'
        },
        {
            id: 20,
            naam: 'BVNL',
            slogan: 'Belang van Nederland',
            standpunten: [
                'Nederlandse soevereiniteit',
                'Streng migratiebeleid',
                'Lagere belastingen',
                'Eigen cultuur voorop'
            ],
            color: '#F39200',
            image: 'img/partijen/BVNL.png'
        },
        {
            id: 21,
            naam: 'Libertarische Partij',
            slogan: 'Voor meer vrijheid',
            standpunten: [
                'Kleinere overheid',
                'Persoonlijke vrijheid',
                'Vrije markt',
                'Minder regelgeving'
            ],
            color: '#FFD700',
            image: 'img/partijen/Libertarischepartij.svg.png'
        },
        {
            id: 22,
            naam: 'NLPlan',
            slogan: 'Samen sterker door positieve energie',
            standpunten: [
                'Positieve politiek',
                'Samenwerking',
                'Vernieuwing',
                'Constructieve aanpak'
            ],
            color: '#FF6B35',
            image: 'img/partijen/nlplan_logo.webp'
        },
        {
            id: 23,
            naam: 'LEF',
            slogan: 'Lokaal Europa Focus',
            standpunten: [
                'Europese samenwerking',
                'Lokale democratie',
                'Duurzaamheid',
                'Innovatie'
            ],
            color: '#00A859',
            image: 'img/partijen/LEF.webp'
        },
        {
            id: 24,
            naam: 'Ellect',
            slogan: 'Vernieuwing van de democratie',
            standpunten: [
                'Democratische vernieuwing',
                'Transparantie',
                'Participatie',
                'Digitale innovatie'
            ],
            color: '#4A90E2',
            image: 'img/partijen/Ellect.webp'
        },
        {
            id: 25,
            naam: 'De Linie',
            slogan: 'Bescherming van Nederlandse identiteit',
            standpunten: [
                'Behoud identiteit',
                'Streng migratiebeleid',
                'Veiligheid',
                'Traditie'
            ],
            color: '#1A1A1A',
            image: 'img/partijen/DE_LINE.png'
        }
    ];
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getClientIP,
        getCookieID,
        hasVoted,
        markAsVoted,
        getPartijen
    };
}

