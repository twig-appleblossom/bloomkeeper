// 🌱 Permanent Seed Bank
//
// These Seeds are the permanent originals.
// Adding one to Today must never remove or change it.

const defaultSeeds = [
  {
    id: "draw-5",
    title: "🎨 Draw for 5 minutes",
  },
  {
    id: "eyeliner",
    title: "🌸 Practice eyeliner",
  },
  {
    id: "pilates-10",
    title: "🌿 Pilates for 10 minutes",
  },
];

let seeds = [];

let editingSeedId = null;

// ☀️ Today's Path
//
// These are separate occurrences chosen from the Seed Bank.

let todayItems = [];

function getTodayDate() {
  return new Date().toLocaleDateString("en-CA");
}

// -----------------------------
// LOCAL STORAGE
// -----------------------------

function saveSeeds() {
  localStorage.setItem("bloomkeeper-seeds", JSON.stringify(seeds));
}

function loadSeeds() {
  const savedSeeds = localStorage.getItem("bloomkeeper-seeds");

  if (savedSeeds) {
    seeds = JSON.parse(savedSeeds);
    return;
  }

  seeds = defaultSeeds.map((seed) => ({ ...seed }));

  saveSeeds();
}

function saveToday() {
  const data = {
    date: getTodayDate(),
    items: todayItems,
  };

  localStorage.setItem("bloomkeeper-today", JSON.stringify(data));
}

function loadToday() {
  const savedData = localStorage.getItem("bloomkeeper-today");

  if (!savedData) {
    return;
  }

  const data = JSON.parse(savedData);

  // Only restore the plan if it belongs to today.
  if (data.date === getTodayDate()) {
    todayItems = data.items;
  }
}

// -----------------------------
// ELEMENTS
// -----------------------------

const todayScreen = document.querySelector("#today-screen");
const seedBankScreen = document.querySelector("#seed-bank-screen");

const todayList = document.querySelector("#today-list");
const seedList = document.querySelector("#seed-list");

const openSeedBankButton = document.querySelector("#open-seed-bank");

const backToTodayButton = document.querySelector("#back-to-today");
const addOneOffButton = document.querySelector("#add-one-off");

const oneOffForm = document.querySelector("#one-off-form");

const oneOffInput = document.querySelector("#one-off-input");

const saveOneOffButton = document.querySelector("#save-one-off");

const cancelOneOffButton = document.querySelector("#cancel-one-off");

const openSeedFormButton = document.querySelector("#open-seed-form");

const seedForm = document.querySelector("#seed-form");

const seedInput = document.querySelector("#seed-input");

const saveSeedButton = document.querySelector("#save-seed");

const cancelSeedButton = document.querySelector("#cancel-seed");

// -----------------------------
// SCREEN NAVIGATION
// -----------------------------

openSeedBankButton.addEventListener("click", () => {
  todayScreen.classList.add("hidden");
  seedBankScreen.classList.remove("hidden");

  renderSeedBank();
});

backToTodayButton.addEventListener("click", () => {
  seedBankScreen.classList.add("hidden");
  todayScreen.classList.remove("hidden");

  renderToday();
});

// -----------------------------
// ADD A SEED TO TODAY
// -----------------------------

function addSeedToToday(seedId) {
  // Don't add the same Seed twice on the same day.
  const alreadyAdded = todayItems.some((item) => item.seedId === seedId);

  if (alreadyAdded) {
    return;
  }

  const newTodayItem = {
    id: crypto.randomUUID(),
    type: "seed",
    seedId: seedId,
  };

  todayItems.push(newTodayItem);

  saveToday();

  renderSeedBank();
}

// -----------------------------
// ONE-OFFS
// -----------------------------

addOneOffButton.addEventListener("click", () => {
  oneOffForm.classList.remove("hidden");

  oneOffInput.focus();
});

cancelOneOffButton.addEventListener("click", () => {
  oneOffInput.value = "";

  oneOffForm.classList.add("hidden");
});

saveOneOffButton.addEventListener("click", () => {
  const title = oneOffInput.value.trim();

  if (title === "") {
    return;
  }

  const newOneOff = {
    id: crypto.randomUUID(),
    type: "oneoff",
    title: title,
  };

  todayItems.push(newOneOff);

  saveToday();

  oneOffInput.value = "";

  oneOffForm.classList.add("hidden");

  renderToday();
});

// -----------------------------
// COMPLETE TODAY ITEM
// -----------------------------

function completeTodayItem(itemId) {
  todayItems = todayItems.filter((item) => item.id !== itemId);

  saveToday();

  renderToday();
}

// -----------------------------
// RENDER TODAY
// -----------------------------

function renderToday() {
  todayList.innerHTML = "";

  if (todayItems.length === 0) {
    const emptyMessage = document.createElement("div");

    emptyMessage.className = "empty-state";

    emptyMessage.innerHTML = `
      Nothing chosen yet 🌱
      <br><br>
      What would make today a little nicer?
    `;

    todayList.appendChild(emptyMessage);

    return;
  }

  todayItems.forEach((item) => {
    const card = document.createElement("div");

    card.className = "today-item";

    const title = document.createElement("span");

    title.className = "today-item-title";

    if (item.type === "seed") {
      const seed = seeds.find((seed) => seed.id === item.seedId);

      if (!seed) {
        return;
      }

      title.textContent = seed.title;
    }

    if (item.type === "oneoff") {
      title.textContent = `📌 ${item.title}`;
    }

    const completeButton = document.createElement("button");

    completeButton.className = "complete-button";
    completeButton.textContent = "✓";

    completeButton.addEventListener("click", () => {
      completeTodayItem(item.id);
    });

    card.appendChild(title);
    card.appendChild(completeButton);

    todayList.appendChild(card);
  });
}

// -----------------------------
// MANAGE SEEDS
// -----------------------------

function openSeedForm(seed = null) {
  seedForm.classList.remove("hidden");

  if (seed) {
    editingSeedId = seed.id;

    seedInput.value = seed.title;

    saveSeedButton.textContent = "Save Changes";
  } else {
    editingSeedId = null;

    seedInput.value = "";

    saveSeedButton.textContent = "Add Seed";
  }

  seedInput.focus();
}

function closeSeedForm() {
  editingSeedId = null;

  seedInput.value = "";

  seedForm.classList.add("hidden");

  saveSeedButton.textContent = "Add Seed";
}

openSeedFormButton.addEventListener("click", () => {
  openSeedForm();
});

cancelSeedButton.addEventListener("click", () => {
  closeSeedForm();
});

saveSeedButton.addEventListener("click", () => {
  const title = seedInput.value.trim();

  if (title === "") {
    return;
  }

  // Editing an existing Seed
  if (editingSeedId) {
    const seed = seeds.find((seed) => seed.id === editingSeedId);

    if (seed) {
      seed.title = title;
    }
  } else {
    // Creating a brand-new Seed
    const newSeed = {
      id: crypto.randomUUID(),
      title: title,
    };

    seeds.push(newSeed);
  }

  saveSeeds();

  closeSeedForm();

  renderSeedBank();
});

// -----------------------------
// RENDER SEED BANK
// -----------------------------

function renderSeedBank() {
  seedList.innerHTML = "";

  seeds.forEach((seed) => {
    const row = document.createElement("div");

    row.className = "seed";

    const title = document.createElement("span");

    title.className = "seed-title";
    title.textContent = seed.title;

    const addButton = document.createElement("button");

    addButton.className = "seed-add";
    addButton.textContent = "+";

    const alreadyAdded = todayItems.some((item) => item.seedId === seed.id);

    if (alreadyAdded) {
      addButton.textContent = "✓";
      addButton.disabled = true;
    }

    addButton.addEventListener("click", () => {
      addSeedToToday(seed.id);
    });

    const editButton = document.createElement("button");

    editButton.className = "seed-edit";
    editButton.textContent = "✏️";

    editButton.addEventListener("click", () => {
      openSeedForm(seed);
    });

    const deleteButton = document.createElement("button");

    deleteButton.className = "seed-delete";
    deleteButton.textContent = "🗑️";

    deleteButton.addEventListener("click", () => {
      const shouldDelete = window.confirm(
        `Remove "${seed.title}" from the Seed Bank?`,
      );

      if (!shouldDelete) {
        return;
      }

      // Remove the permanent Seed.
      seeds = seeds.filter((existingSeed) => existingSeed.id !== seed.id);

      // If today's plan contains this Seed,
      // remove today's occurrence too.
      todayItems = todayItems.filter((item) => item.seedId !== seed.id);

      saveSeeds();
      saveToday();

      renderSeedBank();
    });

    const actions = document.createElement("div");

    actions.className = "seed-row-actions";

    actions.appendChild(addButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    row.appendChild(title);
    row.appendChild(actions);

    seedList.appendChild(row);
  });
}

// -----------------------------
// START BLOOMKEEPER
// -----------------------------
loadSeeds();
loadToday();

renderToday();
