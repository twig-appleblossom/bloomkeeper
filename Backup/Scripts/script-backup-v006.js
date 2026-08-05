let selectedEnergy = "";
let selectedMood = "";
let selectedGardens = [];

let totalXp = 0;
let dayStarted = false;
let seedStates = {};
let collectedBlooms = [];
let currentDayId = "";

const maximumGardens = 3;
const storageKey = "bloomkeeper-save-v1";

const continueButton = document.querySelector("#continue-button");
const newDayButton = document.querySelector("#new-day-button");

const result = document.querySelector("#result");
const primarySeed = document.querySelector("#primary-seed");
const companionSeeds = document.querySelector("#companion-seeds");
const narratorText = document.querySelector("#narrator-text");
const gardenHint = document.querySelector("#garden-hint");

const levelDisplay = document.querySelector("#level-display");
const xpDisplay = document.querySelector("#xp-display");

const bloomLog = document.querySelector("#bloom-log");
const bloomList = document.querySelector("#bloom-list");
const bloomCountDisplay = document.querySelector("#bloom-count-display");

const xpRewards = {
  low: 5,
  medium: 10,
  high: 20,
};

const gardenDetails = {
  grace: {
    name: "Grace",
    icon: "🌸",
    bloom: "A moment of self-expression bloomed.",
  },

  creativity: {
    name: "Creativity",
    icon: "🎨",
    bloom: "A new creative path opened.",
  },

  body: {
    name: "Body",
    icon: "🌿",
    bloom: "The Bloomkeeper cared gently for her body.",
  },

  friendship: {
    name: "Friendship",
    icon: "💜",
    bloom: "A small thread of connection grew stronger.",
  },

  sanctuary: {
    name: "Sanctuary",
    icon: "🏡",
    bloom: "The Cottage became a little more restful.",
  },

  curiosity: {
    name: "Curiosity",
    icon: "✨",
    bloom: "A spark of curiosity lit the path ahead.",
  },
};

const seeds = {
  grace: {
    low: "Place one makeup item somewhere visible.",
    medium: "Practice one small part of an eye look.",
    high: "Experiment with a complete simple eye look.",
  },

  creativity: {
    low: "Open your sketchbook or writing document.",
    medium: "Create without judging yourself for ten minutes.",
    high: "Spend twenty minutes exploring a creative idea.",
  },

  body: {
    low: "Place your yoga mat on the floor.",
    medium: "Try ten minutes of yoga or Pilates.",
    high: "Try a twenty-minute movement session.",
  },

  friendship: {
    low: "React to one message on Discord.",
    medium: "Send one message to your guild.",
    high: "Start a conversation or join a voice chat.",
  },

  sanctuary: {
    low: "Put away one item.",
    medium: "Tend one small area for five minutes.",
    high: "Complete one household task that helps tomorrow.",
  },

  curiosity: {
    low: "Save one interesting idea for later.",
    medium: "Explore something interesting for ten minutes.",
    high: "Follow your curiosity and take a few notes.",
  },
};

const energyButtons = document.querySelectorAll("[data-energy]");
const moodButtons = document.querySelectorAll("[data-mood]");
const gardenButtons = document.querySelectorAll("[data-garden]");

function createDayId() {
  const timestamp = new Date().toISOString();
  const randomPart = Math.random().toString(36).slice(2, 9);

  return `${timestamp}-${randomPart}`;
}

function selectSingleButton(buttons, selectedButton) {
  buttons.forEach((button) => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });

  selectedButton.classList.add("selected");
  selectedButton.setAttribute("aria-pressed", "true");
}

function updateContinueButton() {
  const checkInComplete =
    selectedEnergy && selectedMood && selectedGardens.length > 0;

  continueButton.disabled = !checkInComplete || dayStarted;
}

function updateGardenHint() {
  const amountSelected = selectedGardens.length;

  if (amountSelected === 0) {
    gardenHint.innerText =
      "Choose one to three Gardens. Your first choice becomes your Primary Garden.";
    return;
  }

  if (amountSelected === maximumGardens) {
    gardenHint.innerText =
      "Three Gardens selected. Deselect one before choosing another.";
    return;
  }

  gardenHint.innerText = `${amountSelected} of ${maximumGardens} Gardens selected.`;
}

function updatePlayerStatus() {
  const level = Math.floor(totalXp / 100) + 1;
  const xpWithinLevel = totalXp % 100;
  const bloomWord = collectedBlooms.length === 1 ? "Bloom" : "Blooms";

  levelDisplay.innerText = `Level ${level}`;
  xpDisplay.innerText = `${xpWithinLevel} / 100 XP`;

  bloomCountDisplay.innerText = `${collectedBlooms.length} ${bloomWord}`;
}

function lockDailyCheckIn() {
  const checkInButtons = document.querySelectorAll(".choice-button");

  checkInButtons.forEach((button) => {
    button.disabled = true;
  });

  continueButton.disabled = true;
  continueButton.innerText = "Today's Path Is Ready";
}

function unlockDailyCheckIn() {
  const checkInButtons = document.querySelectorAll(".choice-button");

  checkInButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });

  continueButton.innerText = "Discover Today's Seeds";
}

function saveGame() {
  const saveData = {
    selectedEnergy,
    selectedMood,
    selectedGardens,
    totalXp,
    dayStarted,
    seedStates,
    collectedBlooms,
    currentDayId,
  };

  localStorage.setItem(storageKey, JSON.stringify(saveData));
}

function loadGame() {
  const savedData = localStorage.getItem(storageKey);

  if (!savedData) {
    return;
  }

  try {
    const parsedData = JSON.parse(savedData);

    selectedEnergy =
      typeof parsedData.selectedEnergy === "string"
        ? parsedData.selectedEnergy
        : "";

    selectedMood =
      typeof parsedData.selectedMood === "string"
        ? parsedData.selectedMood
        : "";

    selectedGardens = Array.isArray(parsedData.selectedGardens)
      ? parsedData.selectedGardens
          .filter((garden) => gardenDetails[garden])
          .slice(0, maximumGardens)
      : [];

    totalXp = Number.isFinite(parsedData.totalXp) ? parsedData.totalXp : 0;

    dayStarted = Boolean(parsedData.dayStarted);

    seedStates =
      parsedData.seedStates && typeof parsedData.seedStates === "object"
        ? parsedData.seedStates
        : {};

    collectedBlooms = Array.isArray(parsedData.collectedBlooms)
      ? parsedData.collectedBlooms
      : [];

    currentDayId =
      typeof parsedData.currentDayId === "string"
        ? parsedData.currentDayId
        : "";
  } catch (error) {
    console.error("Bloomkeeper could not read its save file:", error);
  }
}

function restoreInterface() {
  energyButtons.forEach((button) => {
    const selected = button.dataset.energy === selectedEnergy;

    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  moodButtons.forEach((button) => {
    const selected = button.dataset.mood === selectedMood;

    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  gardenButtons.forEach((button) => {
    const selected = selectedGardens.includes(button.dataset.garden);

    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  updateGardenHint();
  updatePlayerStatus();
  renderBloomLog();

  const savedDayIsComplete =
    dayStarted && selectedEnergy && selectedMood && selectedGardens.length > 0;

  if (savedDayIsComplete) {
    selectedGardens.forEach((garden) => {
      if (!seedStates[garden]) {
        seedStates[garden] = "available";
      }
    });

    renderTodaysPath();

    result.classList.remove("hidden");

    narratorText.innerText =
      "Welcome back. The garden remembers where you left off.";

    lockDailyCheckIn();
    return;
  }

  dayStarted = false;
  updateContinueButton();
}

energyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedEnergy = button.dataset.energy;

    selectSingleButton(energyButtons, button);
    updateContinueButton();
    saveGame();
  });
});

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMood = button.dataset.mood;

    selectSingleButton(moodButtons, button);
    updateContinueButton();
    saveGame();
  });
});

gardenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const garden = button.dataset.garden;
    const gardenIndex = selectedGardens.indexOf(garden);

    if (gardenIndex !== -1) {
      selectedGardens.splice(gardenIndex, 1);

      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    } else if (selectedGardens.length < maximumGardens) {
      selectedGardens.push(garden);

      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
    }

    updateGardenHint();
    updateContinueButton();
    saveGame();
  });
});

continueButton.addEventListener("click", () => {
  if (!currentDayId) {
    currentDayId = createDayId();
  }

  dayStarted = true;

  selectedGardens.forEach((garden) => {
    seedStates[garden] = "available";
  });

  renderTodaysPath();

  narratorText.innerText = createNarratorMessage();

  result.classList.remove("hidden");

  lockDailyCheckIn();
  saveGame();

  result.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".seed-action-button");

  if (!actionButton) {
    return;
  }

  const garden = actionButton.dataset.garden;
  const action = actionButton.dataset.action;

  if (!garden || !action) {
    console.error("Seed button is missing its garden or action.");
    return;
  }

  if (action === "accept") {
    seedStates[garden] = "accepted";

    renderTodaysPath();

    narratorText.innerText =
      "The seed has been chosen. It can be tended whenever the moment feels right.";

    saveGame();
    return;
  }

  if (action === "complete" && seedStates[garden] !== "completed") {
    completeSeed(garden);
  }
});

newDayButton.addEventListener("click", () => {
  beginNewDay();
});

function completeSeed(garden) {
  seedStates[garden] = "completed";

  const earnedXp = xpRewards[selectedEnergy];

  totalXp += earnedXp;

  collectBloom(garden, earnedXp);
  updatePlayerStatus();
  renderTodaysPath();

  narratorText.innerText = gardenDetails[garden].bloom;

  saveGame();
}

function collectBloom(garden, earnedXp) {
  const details = gardenDetails[garden];

  collectedBlooms.push({
    garden,
    icon: details.icon,
    message: details.bloom,
    xp: earnedXp,
    collectedAt: new Date().toISOString(),
    dayId: currentDayId,
  });
  renderBloomLog();
}

function renderBloomLog() {
  bloomList.innerHTML = "";

  const todaysBlooms = collectedBlooms.filter(
    (bloom) => bloom.dayId === currentDayId,
  );

  if (todaysBlooms.length === 0) {
    bloomLog.classList.add("hidden");
    return;
  }

  todaysBlooms.forEach((bloom) => {
    const bloomItem = document.createElement("li");

    bloomItem.innerText = `${bloom.icon} ${bloom.message} +${bloom.xp} XP`;

    bloomList.appendChild(bloomItem);
  });

  bloomLog.classList.remove("hidden");
}

function renderTodaysPath() {
  const [primaryGarden, ...additionalGardens] = selectedGardens;

  primarySeed.innerHTML = createSeedCard(primaryGarden, true);

  companionSeeds.innerHTML = additionalGardens
    .map((garden) => createSeedCard(garden, false))
    .join("");
}

function createSeedCard(garden, isPrimary) {
  const details = gardenDetails[garden];
  const seed = seeds[garden][selectedEnergy];
  const state = seedStates[garden];

  const role = isPrimary ? "Primary Garden" : "Companion Garden";

  let actions = "";

  if (state === "available") {
    actions = `
            <div class="seed-actions">
                <button
                    type="button"
                    class="seed-action-button"
                    data-action="accept"
                    data-garden="${garden}"
                >
                    Accept Seed
                </button>
            </div>
        `;
  }

  if (state === "accepted") {
    actions = `
            <p class="seed-status">
                🌱 Seed accepted
            </p>

            <div class="seed-actions">
                <button
                    type="button"
                    class="seed-action-button"
                    data-action="complete"
                    data-garden="${garden}"
                >
                    Complete Seed · +${xpRewards[selectedEnergy]} XP
                </button>
            </div>
        `;
  }

  if (state === "completed") {
    actions = `
            <p class="seed-status">
                🌸 Bloomed · +${xpRewards[selectedEnergy]} XP
            </p>
        `;
  }

  return `
        <article class="seed-card ${isPrimary ? "primary-seed" : ""} ${state}">
            <p class="seed-garden">
                ${details.icon} ${details.name} · ${role}
            </p>

            <p>🌱 ${seed}</p>

            ${actions}
        </article>
    `;
}

function createNarratorMessage() {
  if (selectedMood === "difficult") {
    return "The garden is quiet today. These are invitations, not obligations. One gentle seed is enough.";
  }

  if (selectedEnergy === "low") {
    return "The Bloomkeeper moves softly today. She may visit several Gardens, but she only needs to plant one seed.";
  }

  if (selectedEnergy === "high") {
    return "Several paths are open today. The Bloomkeeper may explore them, without needing to walk every path.";
  }

  if (selectedGardens.length > 1) {
    return "Several Gardens have called to the Bloomkeeper. She can begin wherever feels welcoming.";
  }

  return "A small path has opened. There is no need to rush.";
}

function beginNewDay() {
  selectedEnergy = "";
  selectedMood = "";
  selectedGardens = [];

  seedStates = {};
  dayStarted = false;
  currentDayId = "";

  unlockDailyCheckIn();

  primarySeed.innerHTML = "";
  companionSeeds.innerHTML = "";
  narratorText.innerText = "";

  renderBloomLog();

  result.classList.add("hidden");

  updateGardenHint();
  updateContinueButton();
  saveGame();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

loadGame();
restoreInterface();
