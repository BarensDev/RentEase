"use strict";

/**
 * Controller for the RentEase summary page.
 *
 * The page derives all statistics and favorite cards from the saved flat
 * collection. Summary values are not stored separately.
 *
 */

const totalFlatsCount = document.getElementById("totalFlatsCount");
const favouriteFlatsCount = document.getElementById("favouriteFlatsCount");
const favouriteList = document.getElementById("favouriteList");
const homeFeedback = document.getElementById("homeFeedback");
const rendaMed = document.getElementById("rendaMedia");
const cityApartList = document.getElementById("cityApartList");

function showHomeFeedback(message, type = "success") {
  homeFeedback.hidden = message === "";
  homeFeedback.textContent = message;
  homeFeedback.dataset.type = type;
}

function createFact(label, value) {
  const fact = document.createElement("div");
  fact.className = "property-card__fact";

  const factLabel = document.createElement("p");
  factLabel.className = "property-card__fact-label";
  factLabel.textContent = label;

  const factValue = document.createElement("p");
  factValue.className = "property-card__fact-value";
  factValue.textContent = value;

  fact.appendChild(factLabel);
  fact.appendChild(factValue);
  return fact;
}

function createFavouriteCard(flat) {
  const card = document.createElement("article");
  card.className = "property-card";

  const headingGroup = document.createElement("div");
  const header = document.createElement("div");
  header.className = "property-card__header";

  const title = document.createElement("h3");
  title.textContent = flat.city;

  const address = document.createElement("p");
  address.className = "property-card__address";
  address.textContent = `${flat.streetName}, ${flat.streetNumber}`;

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = "Favorito";
  card.className = "property-card fav-border";

  headingGroup.appendChild(title);
  headingGroup.appendChild(address);
  header.appendChild(headingGroup);
  header.appendChild(badge);

  const facts = document.createElement("div");
  facts.className = "property-card__facts";
  facts.appendChild(createFact("Renda", formatCurrency(flat.rentPrice)));
  facts.appendChild(createFact("Área", `${flat.areaSize} m²`));
  facts.appendChild(
    createFact("Disponibilidade a partir de", formatDate(flat.dateAvailable)),
  );
  facts.appendChild(
    createFact("Ar condicionado", `${flat.hasAC ? "Sim" : "Não"}`),
  );

  const removeButton = document.createElement("button");
  removeButton.className = "button button--secondary button--small";
  removeButton.type = "button";
  removeButton.textContent = "Remover dos favoritos";
  removeButton.addEventListener("click", () => removeFavourite(flat.id));

  card.appendChild(header);
  card.appendChild(facts);
  card.appendChild(removeButton);
  return card;
}

/**
 * Recomputes and renders dashboard statistics and favorite cards from storage.
 *
 * Recalculation on every render keeps totals, average rent, city counts, and
 * favorite state synchronized with the persisted flat collection.
 *
 */
function renderHome(actionMessage = "") {
  const flats = loadFlats();
  totalFlatsCount.textContent = flats.data.length;

  rendaMed.textContent = formatCurrency(calcRendaMed(flats.data));

  createListItems(flats.data);

  const favouriteFlats = flats.data.filter((flat) => flat.isFavorite);
  let favouriteFlatsCards = [];
  for (const flat of favouriteFlats) {
    let favCard = createFavouriteCard(flat);
    favouriteFlatsCards.push(favCard);
  }

  favouriteFlatsCount.textContent = favouriteFlats.length;
  favouriteList.replaceChildren(...favouriteFlatsCards);

  for (const flat of flats.data) {
  }

  const message = actionMessage || getStorageMessage();

  if (message) {
    showHomeFeedback(message, actionMessage ? "success" : "warning");
  } else if (favouriteFlats.length === 0) {
    showHomeFeedback("Ainda não existem apartamentos favoritos.", "warning");
  } else {
    showHomeFeedback("");
  }
}

function removeFavourite(flatId) {
  const flats = loadFlats();
  let flatsCopy = { data: [...flats.data], errors: { ...flats.errors } };

  flatsCopy.data.map((flat) => {
    if (flat.id === flatId) {
      flat.isFavorite = false;
    }
    return flat;
  });

  const isSaved = saveFlats(flatsCopy);

  isSaved
    ? showHomeFeedback(
        "Apartamento removido dos favoritos com successo",
        "success",
      )
    : showHomeFeedback(
        "Erro ao remover o Apartamento dos Favoritos...",
        "warning",
      );
  renderHome();
}

function calcRendaMed(flats) {
  let media = 0;
  if (flats.length === 0) {
    return 0;
  }
  for (const flat of flats) {
    media += flat.rentPrice;
  }
  return media / flats.length;
}

/**
 * Groups flats by a case-insensitive and accent-insensitive city key, then
 * renders one count per city.
 *
 * The list is cleared before rebuilding so repeated renders do not duplicate
 * city entries.
 *
 */
function createListItems(flats) {
  const flatsPerCity = Object.entries(
    flats.reduce((acc, flat) => {
      const city = normalizeStrings(flat.city);
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {}),
  ).map(([city, count]) => ({
    city,
    count,
  }));

  for (const item of flatsPerCity) {
    const p = document.createElement("p");
    p.classList.add("eyebrow");
    p.innerHTML = `<strong>${item.city}</strong> tem <strong>${item.count}</strong> apartamento${item.count == 1 ? "" : "s"}`;
    cityApartList.appendChild(p);
  }
}
renderHome();
