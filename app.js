// 🌱 Permanent Seed Bank
//
// These Seeds are the permanent originals.
// Adding one to Today must never remove or change it.

const seeds = [
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

// ☀️ Today's Path
//
// These are separate occurrences chosen from the Seed Bank.

let todayItems = [];

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

  oneOffInput.value = "";

  oneOffForm.classList.add("hidden");

  renderToday();
});

// -----------------------------
// COMPLETE TODAY ITEM
// -----------------------------

function completeTodayItem(itemId) {
  todayItems = todayItems.filter((item) => item.id !== itemId);

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

    row.appendChild(title);
    row.appendChild(addButton);

    seedList.appendChild(row);
  });
}

// -----------------------------
// START BLOOMKEEPER
// -----------------------------

renderToday();
