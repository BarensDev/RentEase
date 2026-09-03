"use strict";

const filtersForm = document.getElementById("filtersForm");
const cityFilter = document.getElementById("cityFilter");
const minPriceFilter = document.getElementById("minPriceFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const minAreaFilter = document.getElementById("minAreaFilter");
const maxAreaFilter = document.getElementById("maxAreaFilter");
const sortBy = document.getElementById("sortBy");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const resultsCount = document.getElementById("resultsCount");
const flatsFeedback = document.getElementById("flatsFeedback");
const flatList = document.getElementById("flatList");

function showFlatsFeedback(message, type = "success") {
  flatsFeedback.hidden = message === "";
  flatsFeedback.textContent = message;
  flatsFeedback.dataset.type = type;
}

function readOptionalNumber(input) {
  const value = input.value.trim();
  return value === "" ? null : Number(value);
}

function getProcessedFlats() {
  const allFlats = loadFlats();
  const city = cityFilter.value.trim().toLowerCase();
  const minPrice = readOptionalNumber(minPriceFilter);
  const maxPrice = readOptionalNumber(maxPriceFilter);
  const minArea = readOptionalNumber(minAreaFilter);
  const maxArea = readOptionalNumber(maxAreaFilter);

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return {
      flats: [],
      error: "O preço mínimo não pode ser superior ao preço máximo.",
    };
  }

  if (minArea !== null && maxArea !== null && minArea > maxArea) {
    return {
      flats: [],
      error: "A área mínima não pode ser superior à área máxima.",
    };
  }

  /*
   * TODO JS-FLATS-1
   * Usa filter() sobre allFlats.
   * Um filtro vazio não deve excluir apartamentos.
   * Os cinco filtros devem funcionar em conjunto.
   * As variáveis city, minPrice, maxPrice, minArea e maxArea já estão preparadas.
   */
  const filteredFlats = allFlats.data;

  // Esta cópia evita ordenar directamente o array carregado.
  const sortedFlats = [...filteredFlats];

  /*
   * TODO JS-FLATS-2
   * Ordena sortedFlats de acordo com sortBy.value:
   * city, price ou area. Se o valor for none, conserva a ordem.
   */

  return { flats: sortedFlats, error: "" };
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

function createFlatCard(flat) {
  const card = document.createElement("article");
  card.className = "property-card";

  const header = document.createElement("div");
  header.className = "property-card__header";

  const headingGroup = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = flat.city;

  const address = document.createElement("p");
  address.className = "property-card__address";
  address.textContent = `${flat.streetName}, ${flat.streetNumber}`;

  headingGroup.appendChild(title);
  headingGroup.appendChild(address);
  header.appendChild(headingGroup);

  if (flat.isFavourite) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Favorito";
    header.appendChild(badge);
  }

  const facts = document.createElement("div");
  facts.className = "property-card__facts";
  facts.appendChild(createFact("Renda", formatCurrency(flat.rentPrice)));
  facts.appendChild(createFact("Área", `${flat.areaSize} m²`));

  // TODO JS-FLATS-3: acrescenta ano, ar condicionado e disponibilidade.

  const actions = document.createElement("div");
  actions.className = "property-card__actions";

  const favouriteButton = document.createElement("button");
  favouriteButton.className = "button button--secondary button--small";
  favouriteButton.type = "button";
  favouriteButton.textContent = flat.isFavourite
    ? "Remover dos favoritos"
    : "Marcar como favorito";
  favouriteButton.addEventListener("click", () => toggleFavourite(flat.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "button button--danger button--small";
  deleteButton.type = "button";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => deleteFlat(flat.id));

  actions.appendChild(favouriteButton);
  actions.appendChild(deleteButton);
  card.appendChild(header);
  card.appendChild(facts);
  card.appendChild(actions);
  return card;
}

function renderFlats(actionMessage = "", actionType = "success") {
  const processed = getProcessedFlats();
  flatList.replaceChildren();
  resultsCount.textContent = `${processed.flats.length} resultado${processed.flats.length === 1 ? "" : "s"}`;

  if (processed.error) {
    showFlatsFeedback(processed.error, "error");
    return;
  }

  const message = actionMessage || getStorageMessage();

  if (message) {
    showFlatsFeedback(message, actionMessage ? actionType : "warning");
  } else if (processed.flats.length === 0) {
    showFlatsFeedback("Não existem apartamentos para apresentar.", "warning");
  } else {
    showFlatsFeedback("");
  }

  for (const flat of processed.flats) {
    flatList.appendChild(createFlatCard(flat));
  }
}

function toggleFavourite(flatId) {
  /*
   * TODO JS-FLATS-4
   * 1. Carrega o array completo.
   * 2. Alterna isFavourite apenas no apartamento com flatId.
   * 3. Guarda o array completo.
   * 4. Volta a renderizar.
   */

  showFlatsFeedback(
    `Falta implementar a alteração do favorito ${flatId}.`,
    "warning",
  );
}

function deleteFlat(flatId) {
  /*
   * TODO JS-FLATS-5
   * 1. Pede confirmação ao utilizador.
   * 2. Usa filter() para criar um array sem o apartamento escolhido.
   * 3. Guarda o novo array.
   * 4. Volta a renderizar.
   */

  showFlatsFeedback(
    `Falta implementar a eliminação do apartamento ${flatId}.`,
    "warning",
  );
}

filtersForm.addEventListener("input", () => renderFlats());
filtersForm.addEventListener("change", () => renderFlats());

clearFiltersButton.addEventListener("click", (event) => {
  event.preventDefault();
  filtersForm.reset();
  renderFlats();
});

renderFlats();
