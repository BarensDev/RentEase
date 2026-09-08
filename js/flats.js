"use strict";

/**
**Controller for the apartment listig page.

* Responsibilities:
- Read filter and sorting controls 
- Derive the visible flat colletion without persisting view changs
- Render cards and result feeback
- Persist favorite and del*tion actions

*/

const filtersForm = document.getElementById("filtersForm");
const cityFilter = document.getElementById("cityFilter");
const minPriceFilter = document.getElementById("minPriceFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const minAreaFilter = document.getElementById("minAreaFilter");
const maxAreaFilter = document.getElementById("maxAreaFilter");
const sortBy = document.getElementById("sortBy");
const sortDirection = document.getElementById("sortDirection");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const resultsCount = document.getElementById("resultsCount");
const flatsFeedback = document.getElementById("flatsFeedback");
const flatList = document.getElementById("flatList");
const modal = document.getElementById("delete-modal");

// Holds the selcted record while the confirmationmodal is open.
// It must be resetafter either cancellation or confimed deletion.
let flatIdToDelete = null;

function showFlatsFeedback(message, type = "success") {
  flatsFeedback.hidden = message === "";
  flatsFeedback.textContent = message;
  flatsFeedback.dataset.type = type;
}

function readOptionalNumber(input) {
  const value = input.value.trim();
  return value === "" ? null : Number(value);
}

/**
* Derives the currently visible flats from persisted data an* form controls.
*
* Filtering and sorting are view-only operations.This function does not
* write tolocalStorage.

*/
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

  const filteredFlats = allFlats.data.filter((flat) => {
    // Every active criterion must match. n empty criterion is ignored so usrs
    // can combine any subset of ci*y, price, and area filters.
    const cityMatch = !city || normalizeStrings(flat.city).includes(city);

    const minRentMatch = !minPrice || flat.rentPrice >= minPrice;

    const maxRentMatch = !maxPrice || flat.rentPrice <= maxPrice;

    const minAreaMatch = !minArea || flat.areaSize >= minArea;

    const maxAreaMatch = !maxArea || flat.areaSize <= maxArea;

    return (
      cityMatch && minRentMatch && maxRentMatch && minAreaMatch && maxAreaMatch
    );
  });

  // Array.sort muates its input. Sort a copy so theloaded collection and the
  // filteed result retain their original or
  let sortedFlats = [...filteredFlats];

  switch (sortBy.value) {
    case "city":
      sortedFlats.sort((a, b) => {
        return sortDirection.value === "asc"
          ? normalizeStrings(a.city).localeCompare(normalizeStrings(b.city))
          : normalizeStrings(b.city).localeCompare(normalizeStrings(a.city));
      });

      break;
    case "price":
      sortedFlats.sort((a, b) => {
        return sortDirection.value === "asc"
          ? a.rentPrice - b.rentPrice
          : b.rentPrice - a.rentPrice;
      });

      break;
    case "area":
      sortedFlats.sort((a, b) => {
        return sortDirection.value === "asc"
          ? a.areaSize - b.areaSize
          : b.areaSize - a.areaSize;
      });

      break;
    case "none":
      sortedFlats.sort((a, b) => {
        return sortDirection.value === "asc" ? a.id - b.id : b.id - a.id;
      });
      break;
  }
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

  const idElm = document.createElement("p");
  idElm.className = "property-card__id";
  idElm.textContent = `Id: ${flat.id}`;

  headingGroup.appendChild(title);
  headingGroup.appendChild(address);
  headingGroup.appendChild(idElm);
  header.appendChild(headingGroup);

  if (flat.isFavorite) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "Favorito";
    header.appendChild(badge);
    card.className = "property-card fav-border";
  }

  const facts = document.createElement("div");
  facts.className = "property-card__facts";
  facts.appendChild(createFact("Renda", formatCurrency(flat.rentPrice)));
  facts.appendChild(createFact("Área", `${flat.areaSize} m²`));
  facts.appendChild(createFact("Ano", `${flat.yearBuilt}`));
  facts.appendChild(
    createFact("Ar condicionado", `${flat.hasAC ? "Sim" : "Não"}`),
  );
  facts.appendChild(
    createFact("Disponibilidade a partir de", formatDate(flat.dateAvailable)),
  );

  const actions = document.createElement("div");
  actions.className = "property-card__actions";

  const editButton = document.createElement("button");
  editButton.className = "button button--secondary button--small";
  editButton.type = "button";
  editButton.textContent = "Editar";
  editButton.addEventListener(
    "click",
    () => (window.location.href = `./new-flat.html?id=${flat.id}`),
  );

  const favouriteButton = document.createElement("button");
  favouriteButton.className = "button button--secondary button--small";
  favouriteButton.type = "button";
  favouriteButton.id = `fav-button_${flat.id}`;
  favouriteButton.textContent = flat.isFavorite
    ? "Remover dos favoritos"
    : "Marcar como favorito";
  favouriteButton.addEventListener("click", () => toggleFavourite(flat.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "button button--danger button--small";
  deleteButton.type = "button";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
    flatIdToDelete = flat.id;
  });

  actions.appendChild(editButton);
  actions.appendChild(favouriteButton);
  actions.appendChild(deleteButton);
  card.appendChild(header);
  card.appendChild(facts);
  card.appendChild(actions);
  return card;
}

/**
* Rebuilds the result listfrom the current filters and sortig controls.

* The list is cleaed before rendering to prevent dupicate cards when users
* repeatedy change filters, sorting, favorits, or stored records.
*/
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

/**
* Toggles the favorie state of one flat, persists the omplete store, and
* re-renders te current filtered view.

* Visal favorite styling is recreated b renderFlats, so this function doe*
* not manipulate the existing ca*d directly.
*/
function toggleFavourite(flatId) {
  let isFav = undefined;
  try {
    const flats = loadFlats();
    const UpdatedFlats = { data: [...flats.data], errors: { ...flats.errors } };
    UpdatedFlats.data.forEach((flat) => {
      if (flat.id === flatId) {
        flat.isFavorite = !flat.isFavorite;
        isFav = flat.isFavorite;
      }
    });
    saveFlats(UpdatedFlats);
  } catch (error) {
    showFlatsFeedback(
      `Something went while adding flat with id:${flatId} to the favorites.`,
      "error",
    );
  }
  isFav
    ? showFlatsFeedback(
        `Flats with id:${flatId} Added to the Favorites Successfully.`,
        "success",
      )
    : showFlatsFeedback(
        `Flats with id:${flatId} removed from the Favorites Successfully.`,
        "warning",
      );
  renderFlats();
}

/**
 * Removes the flat identified by its stable ID and persists the updated store.
 *
 * The selected ID originates from the confirmation modal, not from the
 * apartment card's current index in the rendered collection.
 *
 */
function deleteFlat(flatId) {
  try {
    const flats = loadFlats();
    let flatsCopy = { data: [...flats.data], errors: { ...flats.errors } };
    const updatedFlats = flatsCopy.data.filter((flat) => flat.id !== flatId);

    flatsCopy.data = updatedFlats;

    const isSaved = saveFlats(flatsCopy);
    if (isSaved) {
      showFlatsFeedback(
        `O apartamento com id: ${flatId}, foi eliminado com successo.`,
        "success",
      );
    } else {
      showFlatsFeedback(
        `Ocorreu um erro ao eliminar o flat com id: ${flatId}. Por favor tente mais tarde`,
        "warning",
      );
    }
    document.getElementById("delete-modal").classList.add("hidden");
  } catch (error) {
    showFlatsFeedback(
      `Ocorreu um erro durante o processo de Eliminação do apartamento.\n Erro: ${error}.`,
      "erro",
    );
  }
  flatIdToDelete = null;
  renderFlats();
}

document.getElementById("confirm-delete").addEventListener("click", (event) => {
  deleteFlat(flatIdToDelete);
});

document.getElementById("cancel-delete").addEventListener("click", () => {
  modal.classList.add("hidden");
  flatIdToDelete = null;
});

filtersForm.addEventListener("input", () => renderFlats());
filtersForm.addEventListener("change", () => renderFlats());

clearFiltersButton.addEventListener("click", (event) => {
  event.preventDefault();
  filtersForm.reset();
  renderFlats();
});

renderFlats();
