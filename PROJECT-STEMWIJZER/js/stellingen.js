
let currentQuestion = 0;
let userAnswers = [];

const stellingen = [
    {
        id: 1,
        text: "De overheid moet meer geld investeren in klimaat en duurzaamheid.",
        positions: {
            eens: [3, 8, 2, 4],
            neutraal: [6, 9],
            oneens: [1, 7, 5]
        }
    },
    {
        id: 2,
        text: "Er moeten strengere regels komen voor immigratie naar Nederland.",
        positions: {
            eens: [7, 1],
            neutraal: [9, 6],
            oneens: [3, 2, 4, 5, 8]
        }
    },
    {
        id: 3,
        text: "De belastingen voor werkenden moeten omlaag.",
        positions: {
            eens: [1, 7, 9],
            neutraal: [4, 6],
            oneens: [2, 3, 5, 8]
        }
    },
    {
        id: 4,
        text: "Studenten moeten gratis kunnen reizen met het openbaar vervoer.",
        positions: {
            eens: [3, 4, 2, 5, 8],
            neutraal: [6, 9],
            oneens: [1, 7]
        }
    },
    {
        id: 5,
        text: "Er moet meer aandacht komen voor dierenwelzijn in de veehouderij.",
        positions: {
            eens: [8, 3, 2, 6, 4],
            neutraal: [9, 5],
            oneens: [1, 7]
        }
    },
    {
        id: 6,
        text: "De zorg moet betaalbaar blijven voor iedereen.",
        positions: {
            eens: [5, 2, 3, 6, 4, 8, 9],
            neutraal: [1],
            oneens: [7]
        }
    },
    {
        id: 7,
        text: "Nederland moet meer woningen bouwen voor starters en jongeren.",
        positions: {
            eens: [2, 3, 4, 5, 6, 9],
            neutraal: [1, 8],
            oneens: [7]
        }
    },
    {
        id: 8,
        text: "De minimumleeftijd voor alcohol moet naar 21 jaar.",
        positions: {
            eens: [6, 9],
            neutraal: [2, 4, 5],
            oneens: [1, 3, 7, 8]
        }
    },
    {
        id: 9,
        text: "Er moeten meer politieagenten op straat komen.",
        positions: {
            eens: [1, 7, 9, 6],
            neutraal: [2, 4, 5],
            oneens: [3, 8]
        }
    },
    {
        id: 10,
        text: "De overheid moet investeren in meer gratis onderwijs.",
        positions: {
            eens: [3, 2, 5, 4, 8],
            neutraal: [6, 9],
            oneens: [1, 7]
        }
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
});

function initializeQuiz() {
    userAnswers = new Array(stellingen.length).fill(null);
    currentQuestion = 0;
    displayQuestion();
}

function displayQuestion() {
    const question = stellingen[currentQuestion];
    
    document.getElementById('questionNumber').textContent = `Vraag ${currentQuestion + 1}`;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('progressText').textContent = `Vraag ${currentQuestion + 1} van ${stellingen.length}`;
    
    const progress = ((currentQuestion + 1) / stellingen.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    
    clearAnswerSelection();
    if (userAnswers[currentQuestion]) {
        highlightAnswer(userAnswers[currentQuestion]);
    }
}

function answerQuestion(answer) {
    userAnswers[currentQuestion] = answer;
    
    highlightAnswer(answer);
    
    setTimeout(() => {
        if (currentQuestion < stellingen.length - 1) {
            currentQuestion++;
            displayQuestion();
        } else {
            showResults();
        }
    }, 300);
}

function skipQuestion() {
    userAnswers[currentQuestion] = 'skip';
    
    if (currentQuestion < stellingen.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function highlightAnswer(answer) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.answer === answer) {
            btn.classList.add('selected');
        }
    });
}

function clearAnswerSelection() {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
}

function calculateMatches() {
    const partijen = getPartijen();
    const scores = {};
    
    partijen.forEach(partij => {
        scores[partij.id] = 0;
    });
    
    userAnswers.forEach((answer, index) => {
        if (answer && answer !== 'skip') {
            const question = stellingen[index];
            const matchingParties = question.positions[answer] || [];
            
            matchingParties.forEach(partyId => {
                scores[partyId] = (scores[partyId] || 0) + 1;
            });
        }
    });
    
    const results = partijen.map(partij => ({
        ...partij,
        score: scores[partij.id],
        percentage: Math.round((scores[partij.id] / stellingen.length) * 100)
    })).sort((a, b) => b.score - a.score);
    
    return results;
}

function showResults() {
    document.getElementById('questionCard').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
    
    const results = calculateMatches();
    const matchResults = document.getElementById('matchResults');
    matchResults.innerHTML = '';
    
    results.slice(0, 5).forEach((result, index) => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.style.borderLeftColor = result.color;
        
        const imageHtml = result.image ? `
            <img src="${result.image}" alt="${result.naam} logo" onerror="this.style.display='none'">
        ` : '';
        
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        
        matchCard.innerHTML = `
            <div class="match-rank">#${index + 1} ${medal}</div>
            <div class="match-info">
                ${imageHtml}
                <div>
                    <h3>${result.naam}</h3>
                    <p class="match-slogan">${result.slogan}</p>
                </div>
            </div>
            <div class="match-score">
                <div class="score-bar">
                    <div class="score-fill" style="width: ${result.percentage}%; background-color: ${result.color};"></div>
                </div>
                <span class="score-text">${result.percentage}% match</span>
            </div>
            <button class="btn btn-primary btn-small" onclick="location.href='partijen.html'">
                Meer over ${result.naam}
            </button>
        `;
        
        matchResults.appendChild(matchCard);
    });
    
    document.getElementById('quizResults').scrollIntoView({ behavior: 'smooth' });
}

function restartQuiz() {
    document.getElementById('questionCard').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    initializeQuiz();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

