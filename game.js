const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};

let state = {
  level: 1,
  xp: 0,
  gold: 250,
  hp: 100,
  maxHp: 100,

  class: null,

  region: "Grünes Tal",

  player: {
    x: 400,
    y: 300,
    speed: 3
  },

  inventory: {
    "Sternsplitter": 30,
    "Sternkristall": 10,
    "Himmelskristall": 0,
    "Goldkern": 0,
    "Sternessenz": 0,
    "Bosskern": 0,
    "Mythischer Sternkern": 0,
    "Entkopplungssiegel": 0
  },

  equipment: {},

  companions: [],

  quests: [],

  mines: {},

  defeatedBosses: [],

  completedQuests: []
};

const regions = {

  "Grünes Tal": {
    width: 1800,
    height: 1200,
    ground: "#376b3f",
    portal: {
      x: 1650,
      y: 500,
      target: "Verbrannte Ebene"
    }
  },

  "Verbrannte Ebene": {
    width: 1800,
    height: 1200,
    ground: "#704d35",
    portal: {
      x: 1650,
      y: 500,
      target: "Frostlande"
    }
  },

  "Frostlande": {
    width: 1800,
    height: 1200,
    ground: "#577b91",
    portal: {
      x: 1650,
      y: 500,
      target: "Drachengebiet"
    }
  },

  "Drachengebiet": {
    width: 1800,
    height: 1200,
    ground: "#543d35",
    portal: {
      x: 1650,
      y: 500,
      target: "Astralgebiet"
    }
  },

  "Astralgebiet": {
    width: 1800,
    height: 1200,
    ground: "#302850",
    portal: {
      x: 1650,
      y: 500,
      target: "Grünes Tal"
    }
  }
};

const npcs = [

  {
    id: "meister",
    name: "Meister Arion",
    region: "Grünes Tal",
    x: 500,
    y: 400,
    type: "quest"
  },

  {
    id: "haendler",
    name: "Händler Mira",
    region: "Grünes Tal",
    x: 700,
    y: 500,
    type: "shop"
  },

  {
    id: "begleiter",
    name: "Tiermeister Luan",
    region: "Grünes Tal",
    x: 900,
    y: 400,
    type: "companion"
  },

  {
    id: "schmied",
    name: "Schmied Borin",
    region: "Grünes Tal",
    x: 1100,
    y: 500,
    type: "blacksmith"
  },

  {
    id: "quest60",
    name: "Archivarin Elyra",
    region: "Astralgebiet",
    x: 700,
    y: 400,
    type: "unbinding"
  }
];

const monsters = [

  {
    name: "Waldwolf",
    region: "Grünes Tal",
    x: 1100,
    y: 800,
    hp: 35,
    attack: 8
  },

  {
    name: "Feuerkobold",
    region: "Verbrannte Ebene",
    x: 1000,
    y: 700,
    hp: 80,
    attack: 18
  },

  {
    name: "Frostbestie",
    region: "Frostlande",
    x: 900,
    y: 700,
    hp: 150,
    attack: 28
  },

  {
    name: "Drachenbrut",
    region: "Drachengebiet",
    x: 1000,
    y: 700,
    hp: 300,
    attack: 40
  },

  {
    name: "Astralwächter",
    region: "Astralgebiet",
    x: 1000,
    y: 700,
    hp: 600,
    attack: 60
  }
];

const bosses = [

  {
    name: "Aschenfürst",
    region: "Verbrannte Ebene",
    x: 1400,
    y: 800,
    hp: 1000,
    attack: 80
  },

  {
    name: "Frostkönig",
    region: "Frostlande",
    x: 1400,
    y: 800,
    hp: 1800,
    attack: 110
  },

  {
    name: "Drachentyrann",
    region: "Drachengebiet",
    x: 1400,
    y: 800,
    hp: 3000,
    attack: 150
  },

  {
    name: "Astralfürst",
    region: "Astralgebiet",
    x: 1400,
    y: 800,
    hp: 6000,
    attack: 220
  }
];

const mineTypes = [
  {
    name: "Verstärkungssteinmine",
    material: "Sternsplitter",
    amount: 100
  },
  {
    name: "Sternkristallmine",
    material: "Sternkristall",
    amount: 100
  },
  {
    name: "Himmelskristallmine",
    material: "Himmelskristall",
    amount: 100
  },
  {
    name: "Mythische Mine",
    material: "Mythischer Sternkern",
    amount: 100
  }
];

const classes = {

  Klingenmeister: {
    hp: 120,
    attack: 20,
    magic: 5,
    defense: 12,
    speed: 15,
    set: "Stahlwanderer"
  },

  Arkanist: {
    hp: 80,
    attack: 8,
    magic: 25,
    defense: 6,
    speed: 12,
    set: "Lehrling des Arkanen"
  },

  Wächter: {
    hp: 180,
    attack: 12,
    magic: 4,
    defense: 25,
    speed: 7,
    set: "Eisenwacht"
  },

  Naturhüter: {
    hp: 110,
    attack: 14,
    magic: 15,
    defense: 13,
    speed: 18,
    set: "Waldläufer"
  }

};

const setNames = {

  Klingenmeister: {
    normal: "Stahlwanderer",
    rare: "Blutklinge",
    epic: "Drachensturm",
    legendary: "Himmelsklinge"
  },

  Arkanist: {
    normal: "Lehrling des Arkanen",
    rare: "Runenweber",
    epic: "Sternenrufer",
    legendary: "Astralarchon"
  },

  Wächter: {
    normal: "Eisenwacht",
    rare: "Bastion",
    epic: "Titanenwacht",
    legendary: "Unbezwingbare Festung"
  },

  Naturhüter: {
    normal: "Waldläufer",
    rare: "Dornenherz",
    epic: "Uralter Hüter",
    legendary: "Avatar des Weltenbaums"
  }

};

const equipmentSlots = [
  "Helm",
  "Brust",
  "Hose",
  "Schuhe",
  "Armband",
  "Halskette",
  "Ring",
  "Waffe"
];

const companionTemplates = [
  {
    name: "Schattenwolf",
    type: "Angreifer",
    hp: 120,
    attack: 28,
    defense: 10,
    speed: 25,
    rarity: "Normal"
  },
  {
    name: "Feuerdrache",
    type: "Magier",
    hp: 150,
    attack: 35,
    defense: 12,
    speed: 15,
    rarity: "Normal"
  },
  {
    name: "Eisenbär",
    type: "Tank",
    hp: 250,
    attack: 15,
    defense: 35,
    speed: 7,
    rarity: "Normal"
  }
];

const enhancementRates = [
  1.00,
  1.00,
  0.95,
  0.90,
  0.85,
  0.75,
  0.55,
  0.40,
  0.25,
  0.12
];

let battleState = null;

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

function saveGame() {
  localStorage.setItem(
    "elyndorSave",
    JSON.stringify(state)
  );
}

function loadGame() {

  const save = localStorage.getItem("elyndorSave");

  if (!save) return;

  try {

    const parsed = JSON.parse(save);

    state = {
      ...state,
      ...parsed
    };

  } catch (e) {

    console.error("Speicherstand konnte nicht geladen werden.");

  }
}

loadGame();

function notify(text) {

  const box = document.getElementById("questNotification");

  box.textContent = text;

  box.classList.remove("hidden");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 2500);
}

function distance(a, b) {

  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );

}

function chooseClass(className) {

  if (state.class) return;

  state.class = className;

  const data = classes[className];

  state.maxHp = data.hp;
  state.hp = data.hp;

  for (const slot of equipmentSlots) {

    state.equipment[slot] = {
      name: setNames[className].normal,
      rarity: "Normal",
      stars: 0,
      bound: false,
      sockets: []
    };

  }

  notify(`${className} gewählt!`);

  addQuest(
    "Der Anfang",
    "Sprich mit Meister Arion.",
    "Meister Arion"
  );

  saveGame();
  updateUI();
}

function addQuest(name, description, target) {

  if (
    state.quests.some(q => q.name === name) ||
    state.completedQuests.includes(name)
  ) {
    return;
  }

  state.quests.push({
    name,
    description,
    target,
    progress: 0,
    completed: false
  });

}

function completeQuest(quest) {

  quest.completed = true;

  state.gold += 100;

  state.xp += 50;

  notify(`Quest abgeschlossen: ${quest.name}! +100 Gold`);

  if (!state.completedQuests.includes(quest.name)) {
    state.completedQuests.push(quest.name);
  }

  state.quests = state.quests.filter(
    q => q.name !== quest.name
  );

  checkLevel();

  saveGame();

  updateUI();
}

function checkLevel() {

  while (state.xp >= state.level * 100) {

    state.xp -= state.level * 100;

    state.level++;

    state.maxHp += 10;

    state.hp = state.maxHp;

    notify(`🎉 Level ${state.level}!`);

  }

}

function drawWorld() {

  const region = regions[state.region];

  ctx.fillStyle = region.ground;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const cameraX =
    state.player.x - canvas.width / 2;

  const cameraY =
    state.player.y - canvas.height / 2;

  drawTerrain(cameraX, cameraY);

  drawMines(cameraX, cameraY);

  drawNPCs(cameraX, cameraY);

  drawMonsters(cameraX, cameraY);

  drawBosses(cameraX, cameraY);

  drawPortal(cameraX, cameraY);

  drawPlayer();

}

function worldToScreen(x, y, cameraX, cameraY) {

  return {
    x: x - cameraX,
    y: y - cameraY
  };

}

function drawTerrain(cameraX, cameraY) {

  ctx.strokeStyle = "rgba(255,255,255,.05)";

  const size = 100;

  for (
    let x = -cameraX % size;
    x < canvas.width;
    x += size
  ) {

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();

  }

  for (
    let y = -cameraY % size;
    y < canvas.height;
    y += size
  ) {

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

  }

}

function drawPlayer() {

  ctx.fillStyle = "#f4d35e";

  ctx.beginPath();

  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    18,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = "#111";

  ctx.font = "12px Arial";

  ctx.textAlign = "center";

  ctx.fillText(
    state.class || "Held",
    canvas.width / 2,
    canvas.height / 2 - 25
  );

}

function drawNPCs(cameraX, cameraY) {

  npcs
    .filter(n => n.region === state.region)
    .forEach(npc => {

      const p = worldToScreen(
        npc.x,
        npc.y,
        cameraX,
        cameraY
      );

      ctx.fillStyle = "#72b7ff";

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        17,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = "#fff";

      ctx.font = "12px Arial";

      ctx.textAlign = "center";

      ctx.fillText(
        npc.name,
        p.x,
        p.y - 25
      );

    });

}

function drawMonsters(cameraX, cameraY) {

  monsters
    .filter(m => m.region === state.region)
    .forEach(monster => {

      const p = worldToScreen(
        monster.x,
        monster.y,
        cameraX,
        cameraY
      );

      ctx.fillStyle = "#d85b5b";

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        20,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = "#fff";

      ctx.font = "12px Arial";

      ctx.textAlign = "center";

      ctx.fillText(
        monster.name,
        p.x,
        p.y - 27
      );

    });

}

function drawBosses(cameraX, cameraY) {

  bosses
    .filter(b => b.region === state.region)
    .forEach(boss => {

      const p = worldToScreen(
        boss.x,
        boss.y,
        cameraX,
        cameraY
      );

      ctx.fillStyle = "#9c3cff";

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        30,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = "#fff";

      ctx.font = "14px Arial";

      ctx.textAlign = "center";

      ctx.fillText(
        "👑 " + boss.name,
        p.x,
        p.y - 38
      );

    });

}

function drawPortal(cameraX, cameraY) {

  const portal = regions[state.region].portal;

  const p = worldToScreen(
    portal.x,
    portal.y,
    cameraX,
    cameraY
  );

  ctx.fillStyle = "#b46cff";

  ctx.beginPath();

  ctx.arc(
    p.x,
    p.y,
    35,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.fillStyle = "#fff";

  ctx.font = "13px Arial";

  ctx.textAlign = "center";

  ctx.fillText(
    portal.target,
    p.x,
    p.y - 45
  );

}

function drawMines(cameraX, cameraY) {

  const positions = [
    [300, 800],
    [600, 900],
    [800, 700],
    [1200, 900]
  ];

  positions.forEach((pos, index) => {

    const p = worldToScreen(
      pos[0],
      pos[1],
      cameraX,
      cameraY
    );

    ctx.fillStyle = "#d6c05e";

    ctx.fillRect(
      p.x - 15,
      p.y - 15,
      30,
      30
    );

    ctx.fillStyle = "#fff";

    ctx.font = "11px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
      "Mine",
      p.x,
      p.y - 22
    );

  });

}

function updatePlayer() {

  let dx = 0;
  let dy = 0;

  if (keys.ArrowUp || keys.w) dy -= 1;
  if (keys.ArrowDown || keys.s) dy += 1;
  if (keys.ArrowLeft || keys.a) dx -= 1;
  if (keys.ArrowRight || keys.d) dx += 1;

  if (dx || dy) {

    const length = Math.hypot(dx, dy);

    dx /= length;
    dy /= length;

    state.player.x += dx * state.player.speed;
    state.player.y += dy * state.player.speed;

  }

  const region = regions[state.region];

  state.player.x = Math.max(
    30,
    Math.min(
      region.width - 30,
      state.player.x
    )
  );

  state.player.y = Math.max(
    30,
    Math.min(
      region.height - 30,
      state.player.y
    )
  );

  checkNearby();

}

function checkNearby() {

  let target = null;

  const nearbyNPC = npcs.find(
    npc =>
      npc.region === state.region &&
      distance(state.player, npc) < 65
  );

  if (nearbyNPC) {

    target = {
      title: nearbyNPC.name,
      text: "Drücke E, um mit diesem NPC zu sprechen.",
      action: () => interactNPC(nearbyNPC)
    };

  }

  const nearbyMonster = monsters.find(
    monster =>
      monster.region === state.region &&
      distance(state.player, monster) < 70
  );

  if (nearbyMonster) {

    target = {
      title: nearbyMonster.name,
      text: "Ein Gegner greift dich an.",
      action: () => startWorldBattle(nearbyMonster)
    };

  }

  const nearbyBoss = bosses.find(
    boss =>
      boss.region === state.region &&
      distance(state.player, boss) < 90
  );

  if (nearbyBoss) {

    target = {
      title: "👑 " + nearbyBoss.name,
      text: "Ein mächtiger Boss wartet auf dich.",
      action: () => startWorldBattle(nearbyBoss, true)
    };

  }

  const portal = regions[state.region].portal;

  if (distance(state.player, portal) < 80) {

    target = {
      title: "🌀 Portal",
      text: `Reise nach ${portal.target}.`,
      action: () => travel(portal.target)
    };

  }

  if (target) {

    document
      .getElementById("interactionBox")
      .classList.remove("hidden");

    document.getElementById(
      "interactionTitle"
    ).textContent = target.title;

    document.getElementById(
      "interactionText"
    ).textContent = target.text;

    document.getElementById(
      "interactionButton"
    ).onclick = target.action;

  } else {

    document
      .getElementById("interactionBox")
      .classList.add("hidden");

  }

}

function interact() {

  const button =
    document.getElementById("interactionButton");

  if (!button.parentElement.classList.contains("hidden")) {
    button.click();
  }

}

function interactNPC(npc) {

  openDialog(
    npc.name,
    getNPCDialog(npc)
  );

}

function getNPCDialog(npc) {

  if (npc.type === "quest") {

    if (!state.class) {

      return [
        {
          text:
            "Willkommen in Elyndor. Wähle zuerst deine Klasse.",
          action: closeDialog
        }
      ];

    }

    if (
      !state.completedQuests.includes("Der Anfang") &&
      state.quests.some(q => q.name === "Der Anfang")
    ) {

      return [
        {
          text:
            "Gut, dass du gekommen bist. Besiege einen Waldwolf und kehre zu mir zurück.",
          action: () => {

            const quest =
              state.quests.find(
                q => q.name === "Der Anfang"
              );

            quest.target = "Waldwolf";

            quest.description =
              "Besiege einen Waldwolf.";

            closeDialog();

            notify("Quest angenommen!");

          }
        }
      ];

    }

    return [
      {
        text:
          "Die Welt von Elyndor ist riesig. Erkunde die Regionen und werde stärker!",
        action: closeDialog
      }
    ];

  }

  if (npc.type === "shop") {

    return [
      {
        text:
          "Ich verkaufe dir Sternsplitter für 10 Gold.",
        action: () => {

          if (state.gold >= 10) {

            state.gold -= 10;

            state.inventory["Sternsplitter"]++;

            notify("+1 Sternsplitter");

            saveGame();

            updateUI();

          } else {

            notify("Nicht genug Gold.");

          }

        }
      }
    ];

  }

  if (npc.type === "companion") {

    return [
      {
        text:
          "Ich kann dir einen Schattenwolf für 100 Gold geben.",
        action: () => buyCompanion()
      }
    ];

  }

  if (npc.type === "blacksmith") {

    return [
      {
        text:
          "Ich kann deine aktuell ausgerüstete Waffe verbessern.",
        action: () => {

          closeDialog();

          upgradeEquipment("Waffe");

        }
      }
    ];

  }

  if (npc.type === "unbinding") {

    if (state.level < 60) {

      return [
        {
          text:
            "Kehre zu mir zurück, wenn du Level 60 erreicht hast.",
          action: closeDialog
        }
      ];

    }

    if (!state.completedQuests.includes("Die Ketten des Besitzes")) {

      addQuest(
        "Die Ketten des Besitzes",
        "Hole dir dein Entkopplungssiegel.",
        "Archivarin Elyra"
      );

      return [
        {
          text:
            "Du bist stark genug. Ich gebe dir das Entkopplungssiegel.",
          action: () => {

            state.inventory["Entkopplungssiegel"]++;

            state.completedQuests.push(
              "Die Ketten des Besitzes"
            );

            state.quests =
              state.quests.filter(
                q =>
                  q.name !==
                  "Die Ketten des Besitzes"
              );

            notify(
              "🔓 Entkopplungssiegel erhalten!"
            );

            closeDialog();

            saveGame();

            updateUI();

          }
        }
      ];

    }

  }

  return [
    {
      text: "Schön, dich zu sehen.",
      action: closeDialog
    }
  ];

}

function openDialog(name, options) {

  document
    .getElementById("dialog")
    .classList.remove("hidden");

  document.getElementById(
    "dialogName"
  ).textContent = name;

  const text =
    document.getElementById("dialogText");

  text.innerHTML = "";

  const buttons =
    document.getElementById("dialogButtons");

  buttons.innerHTML = "";

  options.forEach(option => {

    const p = document.createElement("p");

    p.textContent = option.text;

    text.appendChild(p);

    const button =
      document.createElement("button");

    button.textContent = "Auswählen";

    button.onclick = option.action;

    buttons.appendChild(button);

  });

}

function closeDialog() {

  document
    .getElementById("dialog")
    .classList.add("hidden");

}

document
  .getElementById("dialogClose")
  .onclick = closeDialog;

function travel(regionName) {

  state.region = regionName;

  state.player.x = 300;
  state.player.y = 500;

  notify(`Du reist nach ${regionName}.`);

  saveGame();

  updateUI();

}

function startWorldBattle(enemy, boss = false) {

  if (!state.class) {

    notify("Wähle zuerst eine Klasse.");

    return;

  }

  const team =
    state.companions.slice(0, 3);

  if (team.length === 0) {

    notify(
      "Du brauchst mindestens einen Begleiter."
    );

    return;

  }

  battleState = {

    round: 1,

    boss,

    enemy: [

      {
        name: enemy.name,
        hp: enemy.hp,
        maxHp: enemy.hp,
        attack: enemy.attack
      }
    ],

    player: team.map(c => ({
      ...c,
      currentHp: c.hp
    })),

    active: true

  };

  document
    .getElementById("battle")
    .classList.remove("hidden");

  renderBattle();

}

function renderBattle() {

  if (!battleState) return;

  const playerTeam =
    document.getElementById("playerTeam");

  const enemyTeam =
    document.getElementById("enemyTeam");

  playerTeam.innerHTML = "";

  enemyTeam.innerHTML = "";

  battleState.player.forEach(unit => {

    const div =
      document.createElement("div");

    div.className = "battleUnit";

    const percent =
      Math.max(
        0,
        unit.currentHp / unit.hp * 100
      );

    div.innerHTML = `
      <b>${unit.name}</b>
      <div>${unit.type}</div>
      <div>${Math.max(
        0,
        Math.floor(unit.currentHp)
      )}/${unit.hp}</div>
      <div class="hpBar">
        <div class="hpFill"
             style="width:${percent}%"></div>
      </div>
    `;

    playerTeam.appendChild(div);

  });

  battleState.enemy.forEach(unit => {

    const div =
      document.createElement("div");

    div.className = "battleUnit";

    const percent =
      Math.max(
        0,
        unit.hp / unit.maxHp * 100
      );

    div.innerHTML = `
      <b>${unit.name}</b>
      <div>${Math.max(
        0,
        Math.floor(unit.hp)
      )}/${unit.maxHp}</div>
      <div class="hpBar">
        <div class="hpFill"
             style="width:${percent}%"></div>
      </div>
    `;

    enemyTeam.appendChild(div);

  });

  document.getElementById(
    "battleRound"
  ).textContent =
    `Runde ${battleState.round}`;

  renderBattleActions();

}

function renderBattleActions() {

  const actions =
    document.getElementById(
      "battleActions"
    );

  actions.innerHTML = "";

  battleState.player.forEach(
    (unit, index) => {

      if (unit.currentHp <= 0) return;

      const button =
        document.createElement("button");

      button.textContent =
        `${unit.name} ⚔️`;

      button.onclick =
        () => companionAttack(index);

      actions.appendChild(button);

    }
  );

}

function companionAttack(index) {

  const attacker =
    battleState.player[index];

  const enemy =
    battleState.enemy.find(
      e => e.hp > 0
    );

  if (!enemy) return;

  const damage =
    attacker.attack +
    Math.floor(
      Math.random() * 10
    );

  enemy.hp -= damage;

  logBattle(
    `${attacker.name} verursacht ${damage} Schaden.`
  );

  if (enemy.hp <= 0) {

    winBattle();

    return;

  }

  enemyAttack();

  battleState.round++;

  renderBattle();

}

function enemyAttack() {

  const living =
    battleState.player.filter(
      p => p.currentHp > 0
    );

  if (!living.length) {

    loseBattle();

    return;

  }

  const target =
    living[
      Math.floor(
        Math.random() * living.length
      )
    ];

  const enemy =
    battleState.enemy.find(
      e => e.hp > 0
    );

  if (!enemy) return;

  const damage =
    enemy.attack +
    Math.floor(
      Math.random() * 10
    );

  target.currentHp -= damage;

  logBattle(
    `${enemy.name} verursacht ${damage} Schaden an ${target.name}.`
  );

}

function logBattle(text) {

  const log =
    document.getElementById(
      "battleLog"
    );

  log.innerHTML +=
    `<div>${text}</div>`;

  log.scrollTop =
    log.scrollHeight;

}

function winBattle() {

  logBattle("🏆 Sieg!");

  state.gold += battleState.boss
    ? 500
    : 50;

  state.xp += battleState.boss
    ? 500
    : 100;

  state.inventory["Sternsplitter"] +=
    battleState.boss ? 20 : 5;

  if (battleState.boss) {

    state.inventory["Bosskern"]++;

    const roll =
      Math.random() * 100;

    if (roll < 20) {

      state.inventory["Bossrüstung Normal"] =
        (state.inventory["Bossrüstung Normal"] || 0) + 1;

    } else if (roll < 30) {

      state.inventory["Bossrüstung Selten"] =
        (state.inventory["Bossrüstung Selten"] || 0) + 1;

    } else if (roll < 35) {

      state.inventory["Bossrüstung Episch"] =
        (state.inventory["Bossrüstung Episch"] || 0) + 1;

    }

  }

  checkLevel();

  setTimeout(() => {

    battleState = null;

    document
      .getElementById("battle")
      .classList.add("hidden");

    saveGame();

    updateUI();

  }, 1000);

}

function loseBattle() {

  logBattle(
    "💀 Deine Gruppe wurde besiegt."
  );

  setTimeout(() => {

    battleState = null;

    document
      .getElementById("battle")
      .classList.add("hidden");

  }, 1500);

}

function buyCompanion() {

  if (state.gold < 100) {

    notify("Nicht genug Gold.");

    return;

  }

  state.gold -= 100;

  const template =
    companionTemplates[0];

  state.companions.push({
    ...template,
    level: 1,
    xp: 0,
    stars: 0,
    bound: false
  });

  notify(
    `${template.name} wurde deinem Team hinzugefügt!`
  );

  closeDialog();

  saveGame();

  updateUI();

}

function upgradeEquipment(slot) {

  const item =
    state.equipment[slot];

  if (!item) return;

  if (item.stars >= 10) {

    notify("Bereits +10.");

    return;

  }

  const star =
    item.stars;

  const rate =
    enhancementRates[star];

  let success =
    Math.random() < rate;

  if (success) {

    item.stars++;

    notify(
      `${item.name} ist jetzt +${item.stars}!`
    );

  } else {

    if (star >= 4) {

      item.stars =
        Math.max(
          0,
          item.stars - 1
        );

    }

    notify(
      `Verbesserung fehlgeschlagen.`
    );

  }

  saveGame();

  updateUI();

}

function mine(index) {

  const key =
    `${state.region}-${index}`;

  if (!state.mines[key]) {

    state.mines[key] = {
      amount: 100,
      respawn: 0
    };

  }

  const mine =
    state.mines[key];

  if (mine.amount <= 0) {

    if (
      Date.now() >= mine.respawn
    ) {

      mine.amount = 100;

    } else {

      notify(
        "Diese Mine ist noch erschöpft."
      );

      return;

    }

  }

  let material =
    "Sternsplitter";

  if (index === 1)
    material = "Sternkristall";

  if (index === 2)
    material = "Himmelskristall";

  if (index === 3)
    material = "Mythischer Sternkern";

  mine.amount =
    Math.max(
      0,
      mine.amount - 10
    );

  state.inventory[material] =
    (state.inventory[material] || 0) + 10;

  if (mine.amount === 0) {

    mine.respawn =
      Date.now() +
      180000;

  }

  saveGame();

  updateUI();

}

function renderInventory() {

  const container =
    document.getElementById(
      "inventory"
    );

  container.innerHTML = "";

  Object.entries(
    state.inventory
  ).forEach(([name, amount]) => {

    if (!amount) return;

    const div =
      document.createElement("div");

    div.className = "item";

    div.innerHTML = `
      <span>${name}</span>
      <b>${amount}</b>
    `;

    container.appendChild(div);

  });

}

function renderEquipment() {

  const container =
    document.getElementById(
      "equipment"
    );

  container.innerHTML = "";

  equipmentSlots.forEach(slot => {

    const item =
      state.equipment[slot];

    const div =
      document.createElement("div");

    div.className = "card";

    if (!item) {

      div.innerHTML =
        `<b>${slot}</b><p>Leer</p>`;

    } else {

      div.innerHTML = `
        <h3>${slot}</h3>
        <div>${item.name}</div>
        <div>⭐ +${item.stars}</div>
        <div>
          ${item.bound ? "🔒 Gebunden" : "🔓 Handelbar"}
        </div>
        <button onclick="upgradeEquipment('${slot}')">
          ⭐ Verbessern
        </button>
      `;

    }

    container.appendChild(div);

  });

}

function renderCompanions() {

  const container =
    document.getElementById(
      "companions"
    );

  container.innerHTML = "";

  if (!state.companions.length) {

    container.innerHTML =
      "<p>Noch keine Begleiter.</p>";

    return;

  }

  state.companions.forEach(
    (companion, index) => {

      const div =
        document.createElement("div");

      div.className = "card";

      div.innerHTML = `
        <h3>${companion.name}</h3>
        <div>${companion.type}</div>
        <div>Lv. ${companion.level}</div>
        <div>❤️ ${companion.hp}</div>
        <div>⚔️ ${companion.attack}</div>
        <div>🛡️ ${companion.defense}</div>
        <div>💨 ${companion.speed}</div>
        <div>⭐ +${companion.stars}</div>
        <button onclick="bindCompanion(${index})">
          ${companion.bound ? "🔒 Gebunden" : "🔓 Benutzen"}
        </button>
      `;

      container.appendChild(div);

    }
  );

}

function bindCompanion(index) {

  const companion =
    state.companions[index];

  companion.bound = true;

  notify(
    `${companion.name} wurde gebunden.`
  );

  saveGame();

  updateUI();

}

function renderQuests() {

  const container =
    document.getElementById(
      "quests"
    );

  container.innerHTML = "";

  if (!state.quests.length) {

    container.innerHTML =
      "<p>Keine offenen Quests.</p>";

    return;

  }

  state.quests.forEach(
    quest => {

      const div =
        document.createElement("div");

      div.className = "card";

      div.innerHTML = `
        <h3>📜 ${quest.name}</h3>
        <p>${quest.description}</p>
        <small>Ziel: ${quest.target}</small>
      `;

      container.appendChild(div);

    }
  );

}

function renderMines() {

  const container =
    document.getElementById(
      "mines"
    );

  container.innerHTML = "";

  mineTypes.forEach(
    (mineType, index) => {

      const key =
        `${state.region}-${index}`;

      if (!state.mines[key]) {

        state.mines[key] = {
          amount: 100,
          respawn: 0
        };

      }

      const mine =
        state.mines[key];

      const div =
        document.createElement("div");

      div.className = "card";

      let status =
        mine.amount > 0
          ? `${mine.amount}/100`
          : "Erschöpft";

      div.innerHTML = `
        <h3>⛏️ ${mineType.name}</h3>
        <p>${mineType.material}</p>
        <p>${status}</p>
        <button onclick="mine(${index})">
          ⛏️ Abbauen
        </button>
      `;

      container.appendChild(div);

    }
  );

}

function renderAuction() {

  const container =
    document.getElementById(
      "auction"
    );

  container.innerHTML = `

    <div class="card">

      <h3>🏷️ Spieler-Auktionshaus</h3>

      <p>
        In dieser lokalen Version kannst du
        deine handelbaren Gegenstände verwalten.
      </p>

      <p>
        🔓 Handelbare Gegenstände können später
        in einer Online-Version serverweit verkauft werden.
      </p>

    </div>

    <div class="card">

      <h3>🔓 Entkopplung</h3>

      <p>
        Gebundene Gegenstände benötigen ein
        Entkopplungssiegel.
      </p>

      <button onclick="unbindItem()">
        Entkopplungssiegel benutzen
      </button>

    </div>

  `;

}

function unbindItem() {

  if (
    state.inventory["Entkopplungssiegel"] <= 0
  ) {

    notify(
      "Du besitzt kein Entkopplungssiegel."
    );

    return;

  }

  const item =
    Object.values(
      state.equipment
    ).find(
      item => item && item.bound
    );

  if (!item) {

    notify(
      "Kein gebundener Gegenstand gefunden."
    );

    return;

  }

  item.bound = false;

  state.inventory[
    "Entkopplungssiegel"
  ]--;

  notify(
    `${item.name} ist wieder handelbar.`
  );

  saveGame();

  updateUI();

}

function renderCharacter() {

  const container =
    document.getElementById(
      "characterInfo"
    );

  if (!state.class) {

    container.innerHTML =
      "<p>Noch keine Klasse gewählt.</p>";

    return;

  }

  const data =
    classes[state.class];

  container.innerHTML = `

    <div class="card">

      <h3>${state.class}</h3>

      <p>Level: ${state.level}</p>

      <p>XP: ${state.xp}</p>

      <p>❤️ HP: ${state.hp}/${state.maxHp}</p>

      <p>⚔️ Angriff: ${data.attack}</p>

      <p>🔮 Magie: ${data.magic}</p>

      <p>🛡️ Verteidigung: ${data.defense}</p>

      <p>💨 Geschwindigkeit: ${data.speed}</p>

      <p>
        Set:
        ${data.set}
      </p>

    </div>

  `;

}

function updateUI() {

  document.getElementById(
    "level"
  ).textContent = state.level;

  document.getElementById(
    "hp"
  ).textContent = state.hp;

  document.getElementById(
    "gold"
  ).textContent = state.gold;

  document.getElementById(
    "regionName"
  ).textContent = state.region;

  document.getElementById(
    "classSelection"
  ).style.display =
    state.class ? "none" : "block";

  renderCharacter();
  renderInventory();
  renderEquipment();
  renderCompanions();
  renderQuests();
  renderMines();
  renderAuction();

}

document
  .querySelectorAll(".classButton")
  .forEach(button => {

    button.onclick = () => {

      chooseClass(
        button.dataset.class
      );

    };

  });

document
  .querySelectorAll(".tab")
  .forEach(button => {

    button.onclick = () => {

      document
        .querySelectorAll(".tab")
        .forEach(
          b => b.classList.remove("active")
        );

      document
        .querySelectorAll(".panel")
        .forEach(
          p => p.classList.remove("active")
        );

      button.classList.add("active");

      document
        .getElementById(
          `panel-${button.dataset.tab}`
        )
        .classList.add("active");

    };

  });

window.addEventListener(
  "keydown",
  e => {

    keys[e.key] = true;

    if (
      e.key === "e" ||
      e.key === "E"
    ) {

      interact();

    }

  }
);

window.addEventListener(
  "keyup",
  e => {

    keys[e.key] = false;

  }
);

document
  .querySelectorAll(
    "#touchControls button[data-key]"
  )
  .forEach(button => {

    const key =
      button.dataset.key;

    button.addEventListener(
      "touchstart",
      e => {

        e.preventDefault();

        keys[key] = true;

      }
    );

    button.addEventListener(
      "touchend",
      e => {

        e.preventDefault();

        keys[key] = false;

      }
    );

  });

document
  .getElementById("touchInteract")
  .addEventListener(
    "touchstart",
    e => {

      e.preventDefault();

      interact();

    }
  );

function gameLoop() {

  updatePlayer();

  drawWorld();

  requestAnimationFrame(
    gameLoop
  );

}

updateUI();

gameLoop();
