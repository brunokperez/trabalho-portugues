// elementos base
const startBtn = document.getElementById('start');
const modal = document.getElementById('modal');
const resultEl = document.getElementById('result');

// Variáveis que serão reatribuídas
let questionEl, optionsEl, nextBtn, progressEl, imageContainer, closeBtn;

// sons
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');
const questions = [
    // 🟢 FÁCEIS
    {
        question: "Qual é o maior planeta do Sistema Solar?",
        options: ["Terra", "Marte", "Júpiter", "Saturno"],
        answer: "Júpiter",
        image: "img/sistema.png"
    },
    {
        question: "Quem pintou a famosa obra 'Mona Lisa'?",
        options: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Van Gogh"],
        answer: "Leonardo da Vinci",
        image: "img/monalisa.png"
    },
    {
        question: "Qual é o idioma mais falado no mundo?",
        options: ["Inglês", "Espanhol", "Chinês Mandarim", "Hindi"],
        answer: "Chinês Mandarim",
        image: "img/mapa.png"
    },
    // 🟡 MÉDIAS
    {
        question: "Qual é o país com o maior número de fusos horários do mundo?",
        options: ["Estados Unidos", "Rússia", "França", "China"],
        answer: "França",
        image: "img/falas.png"
    },
    {
        question: "Em que continente fica o deserto do Saara?",
        options: ["Ásia", "África", "América do Sul", "Oceania"],
        answer: "África",
        image: "img/saara.png"
    },
    {
        question: "Quem foi o primeiro homem a pisar na Lua?",
        options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Alan Shepard"],
        answer: "Neil Armstrong",
        image: "img/lua.png"
    },
    // 🔴 DIFÍCEIS
    {
        question: "Qual é o elemento químico mais abundante no núcleo da Terra?",
        options: ["Ferro", "Níquel", "Silício", "Oxigênio"],
        answer: "Ferro",
        image: "img/minerio.png"
    },
    {
        question: "Qual é o nome do físico que formulou as leis do eletromagnetismo conhecidas como Equações de Maxwell?",
        options: ["James Clerk Maxwell", "Michael Faraday", "Nikola Tesla", "Heinrich Hertz"],
        answer: "James Clerk Maxwell",
        image: "img/eletro.png"
    },
    {
        question: "Qual cidade foi a capital do Império Bizantino?",
        options: ["Atenas", "Roma", "Constantinopla", "Alexandria"],
        answer: "Constantinopla",
        image: "img/bizantino.png"
    },
    {
        question: "Em que ano ocorreu a queda do Muro de Berlim?",
        options: ["1985", "1989", "1991", "1993"],
        answer: "1989",
        image: "img/muro.png"
    }
];

let currentQuestion = 0;
let score = 0;
let attemptCount = 1; // <<-- NOVO: Contador de tentativas

// Função para buscar os elementos de dentro do modal.
function bindModalElements() {
  questionEl = document.getElementById('question');
  optionsEl = document.getElementById('options');
  nextBtn = document.getElementById('next');
  progressEl = document.getElementById('progress');
  imageContainer = document.getElementById('question-image');
  closeBtn = document.querySelector('.modal .close');

  // Adiciona os listeners aos elementos recém-criados
  nextBtn.addEventListener('click', nextQuestion);
  closeBtn.addEventListener('click', closeModal);
}

// Funções principais
function showQuestion() {
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');

  const q = questions[currentQuestion];
  questionEl.innerText = q.question;

  optionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('option');
    btn.innerText = opt;
    btn.addEventListener('click', () => checkAnswer(opt));
    optionsEl.appendChild(btn);
  });

  imageContainer.innerHTML = '';
  if (q.image) {
    const img = document.createElement('img');
    img.src = q.image;
    img.alt = 'Imagem da pergunta';
    img.classList.add('question-image');
    imageContainer.appendChild(img);
  }

  progressEl.innerText = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  nextBtn.style.display = 'none';
}

function checkAnswer(selected) {
  const correct = questions[currentQuestion].answer;
  const buttons = document.querySelectorAll('.option');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === correct) {
      btn.style.backgroundColor = '#4CAF50';
      btn.style.color = '#fff';
    } else if (btn.innerText === selected) {
      btn.style.backgroundColor = '#f44336';
      btn.style.color = '#fff';
    }
  });

  if (selected === correct) {
    if (correctSound) { correctSound.currentTime = 0; correctSound.play().catch(()=>{}); }
    score++;
  } else {
    if (incorrectSound) { incorrectSound.currentTime = 0; incorrectSound.play().catch(()=>{}); }
  }

  nextBtn.style.display = 'block';
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');

  const modalContent = document.querySelector('.modal-content');

  // <<-- NOVO: Lógica para mensagem de resultado com número de tentativas -->>
  let resultText = `<p>Parabéns! Sua pontuação é <strong>${score}</strong> de <strong>${questions.length}</strong>.</p>`;

  if (attemptCount > 1) {
    resultText = `<p>Parabéns! Sua pontuação é <strong>${score}</strong> de <strong>${questions.length}</strong>, e você conseguiu na <strong>${attemptCount}ª</strong> tentativa!</p>`;
  }

  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <h2>Fim do Quiz!</h2>
    ${resultText}
    <button id="restart" class="restart-btn">Tentar novamente</button>
  `;

  const newClose = modalContent.querySelector('.close');
  if (newClose) newClose.addEventListener('click', closeModal);

  const restartBtn = modalContent.querySelector('#restart');
  if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  attemptCount++; // <<-- NOVO: Incrementa o contador

  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <h2 id="question"></h2>
    <div id="question-image"></div>
    <div id="options"></div>
    <button id="next" style="display:none;">Próxima Pergunta</button>
    <p id="progress"></p>
  `;

  bindModalElements();
  showQuestion();
}

function closeModal() {
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

// LISTENERS INICIAIS
startBtn.addEventListener('click', () => {
    bindModalElements();
    showQuestion();
});