let selectedEnergy = "";
let selectedMood = "";
let selectedGardens = [];

let totalXp = 0;
let dayStarted = false;
let todaySeeds = [];
let collectedBlooms = [];
let currentDayId = "";
let currentDaySaved = false;
let dayLogs = [];
let legacySeedStates = {};

const maximumGardens = 3;
const storageKey = "bloomkeeper-save-v1";

const continueButton = document.querySelector("#continue-button");
const newDayButton = document.querySelector("#new-day-button");

const openCustomSeedButton = document.querySelector("#open-custom-seed-button");

const cancelCustomSeedButton = document.querySelector(
  "#cancel-custom-seed-button",
);

const customSeedForm = document.querySelector("#custom-seed-form");
const customSeedText = document.querySelector("#custom-seed-text");
const customSeedGarden = document.querySelector("#custom-seed-garden");
const customSeedSize = document.querySelector("#custom-seed-size");

const openSavePointButton = document.querySelector("#open-save-point-button");

const cancelSavePointButton = document.querySelector(
  "#cancel-save-point-button",
);

const savePointForm = document.querySelector("#save-point-form");
const savePointSummary = document.querySelector("#save-point-summary");

const savePointSummaryContent = document.querySelector(
  "#save-point-summary-content",
);

const lootText = document.querySelector("#loot-text");
const bloomMomentText = document.querySelector("#bloom-moment-text");
const dayNoteText = document.querySelector("#day-note-text");
const tomorrowEaseText = document.querySelector("#tomorrow-ease-text");

const result = document.querySelector("#result");
const primarySeed = document.querySelector("#primary-seed");
const companionSeeds = document.querySelector("#companion-seeds");
const narratorText = document.querySelector("#narrator-text");
const gardenHint = document.querySelector("#garden-hint");

const levelDisplay = document.querySelector("#level-display");
const xpDisplay = document.querySelector("#xp-display");

const bloomCountDisplay = document.querySelector("#bloom-count-display");

const bloomLog = document.querySelector("#bloom-log");
const bloomList = document.querySelector("#bloom-list");

const energyButtons = document.querySelectorAll("[data-energy]");
const moodButtons = document.querySelectorAll("[data-mood]");
const gardenButtons = document.querySelectorAll("[data-garden]");

const cottageView = document.querySelector("#cottage-view");

const journeyLogView = document.querySelector("#journey-log-view");

const openJourneyLogButton = document.querySelector("#open-journey-log-button");

const backToCottageButton = document.querySelector("#back-to-cottage-button");

const journeyLogList = document.querySelector("#journey-log-list");

const journeyEmptyState = document.querySelector("#journey-empty-state");

const daysSavedDisplay = document.querySelector("#days-saved-display");

const journeyXpDisplay = document.querySelector("#journey-xp-display");

const sizeDetails = {
  tiny: {
    label: "Tiny",
    icon: "🌱",
    xp: 5,
  },

  regular: {
    label: "Regular",
    icon: "🌿",
    xp: 10,
  },

  larger: {
    label: "Larger",
    icon: "🌳",
    xp: 20,
  },
};

const energyToSize = {
  low: "tiny",
  medium: "regular",
  high: "larger",
};

const energyLabels = {
  low: "🌱 Low energy",
  medium: "🌿 Medium energy",
  high: "🌳 High energy",
};

const moodLabels = {
  good: "😊 Good mood",
  okay: "😐 Okay mood",
  difficult: "🌧 Difficult mood",
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

const seedLibrary = {
  grace: {
    tiny: [
      "Place one makeup item somewhere visible.",
      "Notice one feature you like in the mirror.",
    ],

    regular: [
      "Practice one small part of an eye look.",
      "Try mascara or eyeliner on one eye.",
    ],

    larger: [
      "Experiment with a complete simple eye look.",
      "Spend twenty minutes exploring a makeup look.",
    ],
  },

  creativity: {
    tiny: [
      "Open your sketchbook or writing document.",
      "Make one intentionally imperfect mark or sentence.",
    ],

    regular: [
      "Create without judging yourself for ten minutes.",
      "Take five photos, write a paragraph, or fill part of a page.",
    ],

    larger: [
      "Spend twenty minutes exploring a creative idea.",
      "Develop one drawing, photograph, or piece of writing.",
    ],
  },

  body: {
    tiny: [
      "Place your yoga mat on the floor.",
      "Do one gentle stretch wherever you are.",
    ],

    regular: [
      "Try ten minutes of yoga or Pilates.",
      "Move gently for ten minutes with a guided video.",
    ],

    larger: [
      "Try a twenty-minute movement session.",
      "Complete a longer yoga, Pilates, or walking session.",
    ],
  },

  friendship: {
    tiny: [
      "React to one message on Discord.",
      "Open Discord and read what your guild is sharing.",
    ],

    regular: [
      "Send one message to your guild.",
      "Share a thought, question, meme, or song with your friends.",
    ],

    larger: [
      "Start a conversation or join a voice chat.",
      "Spend some intentional time talking or playing with friends.",
    ],
  },

  sanctuary: {
    tiny: ["Put away one item.", "Make one small surface a little calmer."],

    regular: [
      "Tend one small area for five minutes.",
      "Complete one short care task for yourself or your home.",
    ],

    larger: [
      "Complete one household task that helps tomorrow.",
      "Spend twenty minutes making the Cottage easier to live in.",
    ],
  },

  curiosity: {
    tiny: [
      "Save one interesting idea for later.",
      "Read or watch one small thing that catches your attention.",
    ],

    regular: [
      "Explore something interesting for ten minutes.",
      "Follow one question and note what you discover.",
    ],

    larger: [
      "Follow your curiosity and take a few notes.",
      "Spend twenty minutes learning or experimenting with something new.",
    ],
  },
};

function createId(prefix) {
  const randomPart = Math.random().toString(36).slice(2, 9);

  return `${prefix}-${Date.now()}-${randomPart}`;
}

function createDayId() {
  return createId("day");
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
  document.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = true;
  });

  continueButton.disabled = true;
  continueButton.innerText = "Today's Path Is Ready";
}

function unlockDailyCheckIn() {
  document.querySelectorAll(".choice-button").forEach((button) => {
    button.disabled = false;
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });

  continueButton.innerText = "Discover Today's Seeds";
}

function createSuggestedSeed(garden, isPrimary, suggestionIndex = 0) {
  const size = energyToSize[selectedEnergy];
  const choices = seedLibrary[garden][size];

  const safeIndex = suggestionIndex % choices.length;

  return {
    id: createId("seed"),
    garden,
    text: choices[safeIndex],
    size,
    xp: sizeDetails[size].xp,
    status: "available",
    source: "suggested",
    isPrimary,
    suggestionIndex: safeIndex,
  };
}

function createTodaysSuggestedSeeds() {
  todaySeeds = selectedGardens.map((garden, index) =>
    createSuggestedSeed(garden, index === 0),
  );
}

function ensureTodaysSeeds() {
  if (todaySeeds.length > 0) {
    return;
  }

  createTodaysSuggestedSeeds();

  todaySeeds.forEach((seed) => {
    const oldState = legacySeedStates[seed.garden];

    if (["available", "accepted", "completed"].includes(oldState)) {
      seed.status = oldState;
    }
  });
}

function saveGame() {
  const saveData = {
    selectedEnergy,
    selectedMood,
    selectedGardens,
    totalXp,
    dayStarted,
    todaySeeds,
    collectedBlooms,
    currentDayId,
    currentDaySaved,
    dayLogs,
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

    todaySeeds = Array.isArray(parsedData.todaySeeds)
      ? parsedData.todaySeeds.filter(
          (seed) =>
            seed &&
            typeof seed.id === "string" &&
            gardenDetails[seed.garden] &&
            typeof seed.text === "string" &&
            sizeDetails[seed.size],
        )
      : [];

    collectedBlooms = Array.isArray(parsedData.collectedBlooms)
      ? parsedData.collectedBlooms
      : [];

    currentDayId =
      typeof parsedData.currentDayId === "string"
        ? parsedData.currentDayId
        : "";

    currentDaySaved = Boolean(parsedData.currentDaySaved);

    dayLogs = Array.isArray(parsedData.dayLogs)
      ? parsedData.dayLogs.filter(
          (entry) =>
            entry &&
            typeof entry.dayId === "string" &&
            typeof entry.savedAt === "string",
        )
      : [];

    legacySeedStates =
      parsedData.seedStates && typeof parsedData.seedStates === "object"
        ? parsedData.seedStates
        : {};
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
    if (!currentDayId) {
      currentDayId = createDayId();
    }

    ensureTodaysSeeds();
    renderTodaysPath();

    result.classList.remove("hidden");
    lockDailyCheckIn();

    if (currentDaySaved) {
      showSavedDayState();

      narratorText.innerText =
        "The day rests safely at the Save Point. Begin again whenever you are ready.";
    } else {
      showActiveDayState();

      narratorText.innerText =
        "Welcome back. The garden remembers where you left off.";
    }

    saveGame();
    return;
  }

  dayStarted = false;
  currentDaySaved = false;

  showFreshDayState();
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
  currentDaySaved = false;

  createTodaysSuggestedSeeds();
  renderTodaysPath();

  narratorText.innerText = createNarratorMessage();

  result.classList.remove("hidden");

  lockDailyCheckIn();
  showActiveDayState();
  saveGame();

  result.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest(".seed-action-button");

  if (!actionButton || currentDaySaved) {
    return;
  }

  const seedId = actionButton.dataset.seedId;

  const action = actionButton.dataset.action;

  const seed = todaySeeds.find((item) => item.id === seedId);

  if (!seed || !action) {
    return;
  }

  if (action === "accept") {
    seed.status = "accepted";

    renderTodaysPath();

    narratorText.innerText =
      "The seed has been chosen. It can be tended whenever the moment feels right.";

    saveGame();
    return;
  }

  if (action === "replace") {
    replaceSeed(seed);
    return;
  }

  if (action === "complete" && seed.status !== "completed") {
    completeSeed(seed);
  }
});

openCustomSeedButton.addEventListener("click", () => {
  if (currentDaySaved) {
    return;
  }

  customSeedGarden.value = selectedGardens[0] || "creativity";

  customSeedSize.value = energyToSize[selectedEnergy] || "regular";

  customSeedForm.classList.remove("hidden");

  openCustomSeedButton.classList.add("hidden");

  customSeedText.focus();
});

cancelCustomSeedButton.addEventListener("click", () => {
  closeCustomSeedForm();
});

customSeedForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (currentDaySaved) {
    return;
  }

  const text = customSeedText.value.trim();

  const garden = customSeedGarden.value;

  const size = customSeedSize.value;

  if (!text || !gardenDetails[garden] || !sizeDetails[size]) {
    return;
  }

  todaySeeds.push({
    id: createId("custom-seed"),
    garden,
    text,
    size,
    xp: sizeDetails[size].xp,
    status: "accepted",
    source: "custom",
    isPrimary: false,
    suggestionIndex: 0,
  });

  renderTodaysPath();
  closeCustomSeedForm();

  narratorText.innerText = "A new seed has been added to today's path.";

  saveGame();
});

openSavePointButton.addEventListener("click", () => {
  openSavePoint();
});

cancelSavePointButton.addEventListener("click", () => {
  closeSavePoint();
});

savePointForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCurrentDay();
});

newDayButton.addEventListener("click", () => {
  beginNewDay();
});

openJourneyLogButton.addEventListener("click", () => {
  showJourneyLog();
});

backToCottageButton.addEventListener("click", () => {
  showCottage();
});

function replaceSeed(seed) {
  if (
    currentDaySaved ||
    seed.source !== "suggested" ||
    seed.status !== "available"
  ) {
    return;
  }

  const choices = seedLibrary[seed.garden][seed.size];

  seed.suggestionIndex = (seed.suggestionIndex + 1) % choices.length;

  seed.text = choices[seed.suggestionIndex];

  renderTodaysPath();

  narratorText.innerText =
    "A different path appears. Choose the one that feels most welcoming.";

  saveGame();
}

function completeSeed(seed) {
  seed.status = "completed";
  totalXp += seed.xp;

  collectBloom(seed);
  updatePlayerStatus();
  renderTodaysPath();

  narratorText.innerText = gardenDetails[seed.garden].bloom;

  saveGame();
}

function collectBloom(seed) {
  const details = gardenDetails[seed.garden];

  collectedBlooms.push({
    id: createId("bloom"),
    seedId: seed.id,
    garden: seed.garden,
    icon: details.icon,
    message: details.bloom,
    seedText: seed.text,
    xp: seed.xp,
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
  const primary = todaySeeds.find((seed) => seed.isPrimary);

  const companions = todaySeeds.filter((seed) => !seed.isPrimary);

  primarySeed.innerHTML = primary ? createSeedCard(primary) : "";

  companionSeeds.innerHTML = companions.map(createSeedCard).join("");
}

function createSeedCard(seed) {
  const details = gardenDetails[seed.garden];

  const size = sizeDetails[seed.size];

  const role = seed.isPrimary
    ? "Primary Garden"
    : seed.source === "custom"
      ? "Custom Seed"
      : "Companion Garden";

  let actions = "";

  if (currentDaySaved) {
    actions =
      seed.status === "completed"
        ? `
            <p class="seed-status">
                🌸 Bloomed · +${seed.xp} XP
            </p>
          `
        : `
            <p class="seed-status">
                🌙 Left for another day
            </p>
          `;
  } else if (seed.status === "available") {
    actions = `
      <div class="seed-actions">
        <button
          type="button"
          class="seed-action-button"
          data-action="accept"
          data-seed-id="${seed.id}"
        >
          Accept Seed
        </button>

        <button
          type="button"
          class="seed-action-button quiet-button"
          data-action="replace"
          data-seed-id="${seed.id}"
        >
          Try Another
        </button>
      </div>
    `;
  } else if (seed.status === "accepted") {
    actions = `
      <p class="seed-status">
        🌱 Seed accepted
      </p>

      <div class="seed-actions">
        <button
          type="button"
          class="seed-action-button"
          data-action="complete"
          data-seed-id="${seed.id}"
        >
          Complete Seed · +${seed.xp} XP
        </button>
      </div>
    `;
  } else if (seed.status === "completed") {
    actions = `
      <p class="seed-status">
        🌸 Bloomed · +${seed.xp} XP
      </p>
    `;
  }

  return `
    <article class="seed-card ${
      seed.isPrimary ? "primary-seed" : ""
    } ${seed.status}">
      <p class="seed-garden">
        ${details.icon} ${details.name} · ${role}
      </p>

      <p>${size.icon} ${seed.text}</p>

      <p class="seed-size">
        ${size.label} Seed · ${seed.xp} XP
      </p>

      ${actions}
    </article>
  `;
}

function openSavePoint() {
  closeCustomSeedForm();

  openSavePointButton.classList.add("hidden");

  savePointForm.classList.remove("hidden");

  savePointSummary.classList.add("hidden");

  lootText.focus();
}

function closeSavePoint() {
  savePointForm.classList.add("hidden");

  if (!currentDaySaved) {
    openSavePointButton.classList.remove("hidden");
  }
}

function saveCurrentDay() {
  const loot = lootText.value.trim();

  if (!loot) {
    lootText.focus();
    return;
  }

  const completedSeeds = todaySeeds
    .filter((seed) => seed.status === "completed")
    .map((seed) => ({
      id: seed.id,
      garden: seed.garden,
      text: seed.text,
      xp: seed.xp,
    }));

  const todaysBlooms = collectedBlooms
    .filter((bloom) => bloom.dayId === currentDayId)
    .map((bloom) => ({ ...bloom }));

  const entry = {
    dayId: currentDayId,
    savedAt: new Date().toISOString(),
    energy: selectedEnergy,
    mood: selectedMood,
    gardens: [...selectedGardens],
    completedSeeds,
    blooms: todaysBlooms,
    loot,
    bloomMoment: bloomMomentText.value.trim(),
    dayNote: dayNoteText.value.trim(),
    tomorrowEase: tomorrowEaseText.value.trim(),
  };

  const existingEntryIndex = dayLogs.findIndex(
    (item) => item.dayId === currentDayId,
  );

  if (existingEntryIndex === -1) {
    dayLogs.push(entry);
  } else {
    dayLogs[existingEntryIndex] = entry;
  }

  currentDaySaved = true;

  renderTodaysPath();
  renderSavedDaySummary();
  showSavedDayState();

  narratorText.innerText =
    "The day has been saved. Nothing more is required of the Bloomkeeper tonight.";

  saveGame();
}

function renderSavedDaySummary() {
  const entry = dayLogs.find((item) => item.dayId === currentDayId);

  savePointSummaryContent.innerHTML = "";

  if (!entry) {
    savePointSummary.classList.add("hidden");

    return;
  }

  const date = new Date(entry.savedAt).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  addSummaryLine("📅", "Saved", date);

  addSummaryLine("⭐", "Loot", entry.loot);

  if (entry.bloomMoment) {
    addSummaryLine("🌼", "Bloom Moment", entry.bloomMoment);
  }

  if (entry.dayNote) {
    addSummaryLine("📖", "Day Note", entry.dayNote);
  }

  if (entry.tomorrowEase) {
    addSummaryLine("🌱", "Tomorrow", entry.tomorrowEase);
  }

  addSummaryLine("🌸", "Seeds Completed", String(entry.completedSeeds.length));

  savePointSummary.classList.remove("hidden");
}

function addSummaryLine(icon, label, value) {
  const row = document.createElement("div");

  row.className = "save-summary-row";

  const heading = document.createElement("strong");

  heading.innerText = `${icon} ${label}`;

  const text = document.createElement("p");

  text.innerText = value;

  row.appendChild(heading);
  row.appendChild(text);

  savePointSummaryContent.appendChild(row);
}

function showActiveDayState() {
  currentDaySaved = false;

  openCustomSeedButton.classList.remove("hidden");

  openSavePointButton.classList.remove("hidden");

  savePointForm.classList.add("hidden");
  savePointSummary.classList.add("hidden");
  newDayButton.classList.add("hidden");
}

function showSavedDayState() {
  closeCustomSeedForm();

  savePointForm.classList.add("hidden");

  openCustomSeedButton.classList.add("hidden");

  openSavePointButton.classList.add("hidden");

  newDayButton.classList.remove("hidden");

  renderSavedDaySummary();
}

function showFreshDayState() {
  closeCustomSeedForm();

  savePointForm.reset();
  savePointForm.classList.add("hidden");
  savePointSummary.classList.add("hidden");

  openSavePointButton.classList.add("hidden");

  newDayButton.classList.add("hidden");
}

function closeCustomSeedForm() {
  customSeedForm.reset();

  customSeedForm.classList.add("hidden");

  if (dayStarted && !currentDaySaved) {
    openCustomSeedButton.classList.remove("hidden");
  }
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

  todaySeeds = [];
  dayStarted = false;
  currentDayId = "";
  currentDaySaved = false;
  legacySeedStates = {};

  unlockDailyCheckIn();
  closeCustomSeedForm();
  savePointForm.reset();

  primarySeed.innerHTML = "";
  companionSeeds.innerHTML = "";
  narratorText.innerText = "";

  savePointSummaryContent.innerHTML = "";

  renderBloomLog();
  result.classList.add("hidden");

  showFreshDayState();
  updateGardenHint();
  updateContinueButton();
  saveGame();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function showJourneyLog() {
  closeCustomSeedForm();
  closeSavePoint();

  renderJourneyLog();

  cottageView.classList.add("hidden");
  journeyLogView.classList.remove("hidden");

  openJourneyLogButton.classList.add("hidden");
  backToCottageButton.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function showCottage() {
  journeyLogView.classList.add("hidden");
  cottageView.classList.remove("hidden");

  backToCottageButton.classList.add("hidden");
  openJourneyLogButton.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function renderJourneyLog() {
  journeyLogList.innerHTML = "";

  const sortedLogs = [...dayLogs].sort((firstEntry, secondEntry) => {
    const firstTime = new Date(firstEntry.savedAt).getTime() || 0;

    const secondTime = new Date(secondEntry.savedAt).getTime() || 0;

    return secondTime - firstTime;
  });

  const journeyXp = sortedLogs.reduce((total, entry) => {
    const dayXp = Array.isArray(entry.completedSeeds)
      ? entry.completedSeeds.reduce(
          (seedTotal, seed) =>
            seedTotal + (Number.isFinite(seed.xp) ? seed.xp : 0),
          0,
        )
      : 0;

    return total + dayXp;
  }, 0);

  const dayWord = sortedLogs.length === 1 ? "Day Saved" : "Days Saved";

  daysSavedDisplay.innerText = `${sortedLogs.length} ${dayWord}`;

  journeyXpDisplay.innerText = `${journeyXp} XP Earned`;

  if (sortedLogs.length === 0) {
    journeyEmptyState.classList.remove("hidden");
    return;
  }

  journeyEmptyState.classList.add("hidden");

  sortedLogs.forEach((entry) => {
    journeyLogList.appendChild(createJourneyCard(entry));
  });
}

function createJourneyCard(entry) {
  const card = document.createElement("details");
  card.className = "journey-card";

  const summary = document.createElement("summary");
  summary.className = "journey-card-summary";

  const dateText = document.createElement("span");
  dateText.className = "journey-card-date";
  dateText.innerText = formatJourneyDate(entry.savedAt);

  const preview = document.createElement("span");
  preview.className = "journey-card-preview";

  preview.innerText = entry.loot || "A day resting safely in the Journey Log.";

  summary.appendChild(dateText);
  summary.appendChild(preview);

  const content = document.createElement("div");
  content.className = "journey-card-content";

  const meta = document.createElement("div");
  meta.className = "journey-meta";

  addJourneyTag(meta, energyLabels[entry.energy] || "Energy not recorded");

  addJourneyTag(meta, moodLabels[entry.mood] || "Mood not recorded");

  if (Array.isArray(entry.gardens)) {
    entry.gardens.forEach((garden) => {
      const details = gardenDetails[garden];

      if (details) {
        addJourneyTag(meta, `${details.icon} ${details.name}`);
      }
    });
  }

  content.appendChild(meta);

  addJourneySection(content, "⭐ Loot", entry.loot);

  if (entry.bloomMoment) {
    addJourneySection(content, "🌼 Bloom Moment", entry.bloomMoment);
  }

  if (entry.dayNote) {
    addJourneySection(content, "📖 Day Note", entry.dayNote);
  }

  if (entry.tomorrowEase) {
    addJourneySection(content, "🌱 A Gift for Tomorrow", entry.tomorrowEase);
  }

  addCompletedSeedsSection(content, entry.completedSeeds);

  const dayXp = Array.isArray(entry.completedSeeds)
    ? entry.completedSeeds.reduce(
        (total, seed) => total + (Number.isFinite(seed.xp) ? seed.xp : 0),
        0,
      )
    : 0;

  const dayTotal = document.createElement("div");
  dayTotal.className = "journey-day-total";

  dayTotal.innerText = `🌸 ${dayXp} XP earned · ${
    Array.isArray(entry.blooms) ? entry.blooms.length : 0
  } Blooms collected`;

  content.appendChild(dayTotal);

  card.appendChild(summary);
  card.appendChild(content);

  return card;
}

function addJourneyTag(container, text) {
  const tag = document.createElement("span");
  tag.className = "journey-tag";
  tag.innerText = text;

  container.appendChild(tag);
}

function addJourneySection(container, headingText, bodyText) {
  if (!bodyText) {
    return;
  }

  const section = document.createElement("section");
  section.className = "journey-section";

  const heading = document.createElement("h3");
  heading.innerText = headingText;

  const body = document.createElement("p");
  body.innerText = bodyText;

  section.appendChild(heading);
  section.appendChild(body);

  container.appendChild(section);
}

function addCompletedSeedsSection(container, completedSeeds) {
  const section = document.createElement("section");
  section.className = "journey-section";

  const heading = document.createElement("h3");
  heading.innerText = "🌸 Seeds Completed";

  section.appendChild(heading);

  if (!Array.isArray(completedSeeds) || completedSeeds.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.innerText =
      "No Seeds were completed, and the day was still worth saving.";

    section.appendChild(emptyMessage);
    container.appendChild(section);

    return;
  }

  const list = document.createElement("ul");
  list.className = "journey-seed-list";

  completedSeeds.forEach((seed) => {
    const item = document.createElement("li");

    const details = gardenDetails[seed.garden];

    const icon = details ? details.icon : "🌱";

    const xp = Number.isFinite(seed.xp) ? seed.xp : 0;

    item.innerText = `${icon} ${seed.text} · +${xp} XP`;

    list.appendChild(item);
  });

  section.appendChild(list);
  container.appendChild(section);
}

function formatJourneyDate(savedAt) {
  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) {
    return "A saved day";
  }

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

loadGame();
restoreInterface();
renderJourneyLog();
