"use strict";

const totalFlatsCount = document.getElementById("totalFlatsCount");
const favouriteFlatsCount = document.getElementById("favouriteFlatsCount");
const favouriteList = document.getElementById("favouriteList");
const homeFeedback = document.getElementById("homeFeedback");

function showHomeFeedback(message, type = "success") {
  homeFeedback.hidden = message === "";
  homeFeedback.textContent = message;
  homeFeedback.dataset.type = type;
}

/* Exemplo: cada nome/valor é criado com elementos e textContent. */
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

  const title = document.createElement("h3");
  title.textContent = flat.city;

  const address = document.createElement("p");
  address.className = "property-card__address";
  address.textContent = `${flat.streetName}, ${flat.streetNumber}`;

  const facts = document.createElement("div");
  facts.className = "property-card__facts";
  facts.appendChild(createFact("Renda", formatCurrency(flat.rentPrice)));
  facts.appendChild(createFact("Área", `${flat.areaSize} m²`));

  // TODO JS-HOME-1: acrescenta a data de disponibilidade e o ar condicionado.

  const removeButton = document.createElement("button");
  removeButton.className = "button button--secondary button--small";
  removeButton.type = "button";
  removeButton.textContent = "Remover dos favoritos";
  removeButton.addEventListener("click", () => removeFavourite(flat.id));

  card.appendChild(title);
  card.appendChild(address);
  card.appendChild(facts);
  card.appendChild(removeButton);
  return card;
}

function renderHome(actionMessage = "") {
  const flats = loadFlats();

  totalFlatsCount.textContent = flats.length;

  // TODO JS-HOME-2: usa filter() para obter apenas os favoritos.
  const favouriteFlats = [];

  favouriteFlatsCount.textContent = favouriteFlats.length;
  favouriteList.replaceChildren();

  const message = actionMessage || getStorageMessage();

  if (message) {
    showHomeFeedback(message, actionMessage ? "success" : "warning");
  } else if (favouriteFlats.length === 0) {
    showHomeFeedback("Ainda não existem apartamentos favoritos.", "warning");
  } else {
    showHomeFeedback("");
  }

  // TODO JS-HOME-3: percorre favouriteFlats e acrescenta cada cartão a favouriteList.
}

function removeFavourite(flatId) {
  /*
   * TODO JS-HOME-4
   * 1. Carrega o array completo.
   * 2. Usa map() para mudar apenas isFavourite do apartamento escolhido.
   * 3. Guarda o array actualizado.
   * 4. Volta a chamar renderHome() com uma mensagem de sucesso.
   */

  showHomeFeedback(`Falta implementar a remoção do favorito ${flatId}.`, "warning");
}

renderHome();
