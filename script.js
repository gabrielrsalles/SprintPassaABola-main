// Estado da aplicação
let currentUser = null;
let games = [];

// Elementos
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll("[data-nav]");
const gamesList = document.getElementById("gamesList");
const myGamesList = document.getElementById("myGamesList");
const authModal = document.getElementById("authModal");
const authBtn = document.getElementById("authBtn");
const closeAuth = document.getElementById("closeAuth");
const userNameEl = document.getElementById("userName");
const userEmailEl = document.getElementById("userEmail");
const avatarLetter = document.getElementById("avatarLetter");

// Função para alternar telas
function showView(id) {
  views.forEach(v => v.style.display = "none");
  const view = document.getElementById(id);
  if (view) view.style.display = "block";
}

// Navegação
navButtons.forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.nav)));

// Modal de login
authBtn.addEventListener("click", () => authModal.classList.add("show"));
closeAuth.addEventListener("click", () => authModal.classList.remove("show"));

// Login Fake
const authForm = document.getElementById("authForm");
authForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(authForm);
  const name = formData.get("name") || "Usuário";
  const email = formData.get("email");

  if (!email) {
    alert("Informe seu e-mail!");
    return;
  }

  currentUser = { name, email };
  userNameEl.textContent = name;
  userEmailEl.textContent = email;
  avatarLetter.textContent = name.charAt(0).toUpperCase();

  authModal.classList.remove("show");
  alert(`Bem-vindo, ${name}!`);
  renderGames();
});

// Criar jogo
const createGameForm = document.getElementById("createGameForm");
createGameForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!currentUser) {
    alert("Você precisa estar logado para criar um jogo!");
    return;
  }

  const formData = new FormData(createGameForm);
  const game = {
    id: Date.now(),
    title: formData.get("title"),
    date: formData.get("date"),
    time: formData.get("time"),
    location: formData.get("location"),
    slots: parseInt(formData.get("slots")),
    level: formData.get("level"),
    notes: formData.get("notes"),
    owner: currentUser.name,
    players: []
  };

  games.push(game);
  createGameForm.reset();
  renderGames();
  showView("home");
});

// Renderizar jogos
function renderGames() {
  gamesList.innerHTML = "";
  myGamesList.innerHTML = "";

  games.forEach(game => {
    const joined = currentUser && game.players.includes(currentUser.name);

    // Lista geral
    const gameDiv = document.createElement("div");
    gameDiv.className = "game";
    gameDiv.innerHTML = `
      <div>
        <strong>${game.title}</strong><br>
        <span class="small">${game.date} ${game.time} · ${game.location} · ${game.players.length}/${game.slots}</span>
        ${game.notes ? `<div class="small"><em>${game.notes}</em></div>` : ""}
      </div>
      <button class="cta joinBtn" ${!currentUser ? "disabled" : ""}>
        ${joined ? "Participando" : "Participar"}
      </button>
    `;
    gamesList.appendChild(gameDiv);

    // Ação do botão participar
    gameDiv.querySelector(".joinBtn").addEventListener("click", () => {
      if (!currentUser) {
        alert("Faça login para participar!");
        return;
      }
      if (!joined && game.players.length >= game.slots) {
        alert("Este jogo está cheio!");
        return;
      }
      if (joined) {
        game.players = game.players.filter(p => p !== currentUser.name);
      } else {
        game.players.push(currentUser.name);
      }
      renderGames();
    });

    // Meus jogos
    if (currentUser && game.owner === currentUser.name) {
      const mineDiv = document.createElement("div");
      mineDiv.className = "game";
      mineDiv.innerHTML = `
        <div>
          <strong>${game.title}</strong><br>
          <span class="small">${game.date} ${game.time} · ${game.location}</span>
          <div class="small">${game.players.length}/${game.slots} jogadores</div>
        </div>
        <span class="badge">${game.players.length >= game.slots ? "Lotado" : "Vagas"}</span>
      `;
      myGamesList.appendChild(mineDiv);
    }
  });
}

// Perfil
const profileForm = document.getElementById("profileForm");
profileForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!currentUser) return alert("Faça login para atualizar o perfil!");

  const formData = new FormData(profileForm);
  const name = formData.get("name") || currentUser.name;
  const email = formData.get("email") || currentUser.email;

  currentUser = { name, email };
  userNameEl.textContent = name;
  userEmailEl.textContent = email;
  avatarLetter.textContent = name.charAt(0).toUpperCase();
  alert("Perfil atualizado!");
});

// Inicialização
showView("home");
renderGames();
