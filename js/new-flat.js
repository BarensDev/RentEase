"use strict";

/**
* Controller for the crate and edit flat form.

* Models selected through the URL:
* - o valid id parameter: create a newflat.
* - Valid id parameter: load and update the matching flat.

*/

const params = new URLSearchParams(window.location.search);
// A finite posiive ID selects edit mode. Missing,malformed, or non-positive valus leave the page in create mode.
const requestedId = Number(params.get("id"));
const isEditMode = Number.isFinite(requestedId) && requestedId > 0;

const pageTitle = document.getElementById("page-title");
const newFlatForm = document.getElementById("newFlatForm");
const yearBuiltInput = document.getElementById("yearBuilt");
const formFeedback = document.getElementById("formFeedback");
const formFeedbackText = document.getElementById("formFeedbackText");
const viewFlatsLink = document.getElementById("viewFlatsLink");
const currentYear = new Date().getFullYear();
const buttonExemples = document.getElementById("btnExamples");
let counter = 0;
yearBuiltInput.max = currentYear;
isEditMode
  ? pageTitle.classList.add("hidden")
  : pageTitle.classList.remove("hidden");
isEditMode
  ? buttonExemples.classList.add("hidden")
  : buttonExemples.classList.remove("hidden");

function showFormFeedback(message, type = "success", showLink = false) {
  formFeedback.hidden = message === "";
  formFeedback.dataset.type = type;
  formFeedbackText.textContent = message;
  viewFlatsLink.hidden = !showLink;
}

function readRequiredNumber(fieldName) {
  const value = newFlatForm.elements[fieldName].value.trim();
  return value === "" ? Number.NaN : Number(value);
}

function isValidDateText(dateText) {
  const dateParts = dateText.split("-");

  if (
    dateParts.length !== 3 ||
    dateParts[0].length !== 4 ||
    dateParts[1].length !== 2 ||
    dateParts[2].length !== 2
  ) {
    return false;
  }

  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
* Reads, normalizes, and validates all form fields n one pass.

* The returned data object contains typed values read for persistence.
* Validation erors are keyed by field name so the* map directly to the
* correspond*ng input and error element.
*
*/
function validateForm() {
  const city = newFlatForm.elements.city.value.trim();
  const streetName = newFlatForm.elements.streetName.value.trim();
  const streetNumber = readRequiredNumber("streetNumber");
  const areaSize = readRequiredNumber("areaSize");
  const yearBuilt = readRequiredNumber("yearBuilt");
  const rentPrice = readRequiredNumber("rentPrice");
  const dateAvailable = newFlatForm.elements.dateAvailable.value;
  const errors = {};

  if (city.length < 2) {
    errors.city = "Indica uma cidade com pelo menos 2 caracteres.";
  }

  if (streetName.length < 2) {
    errors.streetName = "Indica uma rua com pelo menos 2 caracteres.";
  }

  if (!Number.isInteger(streetNumber) || streetNumber <= 0) {
    errors.streetNumber =
      "O número da porta tem de ser um número inteiro positivo.";
  }

  if (!Number.isFinite(areaSize) || areaSize <= 0) {
    errors.areaSize = "A área tem de ser um número superior a zero.";
  }

  if (
    !Number.isInteger(yearBuilt) ||
    yearBuilt < 1900 ||
    yearBuilt > currentYear
  ) {
    errors.yearBuilt = `O ano tem de ser um número inteiro entre 1900 e ${currentYear}.`;
  }

  if (!Number.isFinite(rentPrice) || rentPrice <= 0) {
    errors.rentPrice = "A renda tem de ser um número superior a zero.";
  }

  if (!isValidDateText(dateAvailable)) {
    errors.dateAvailable = "Escolhe uma data de disponibilidade válida.";
  }

  return {
    data: {
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC: newFlatForm.elements.hasAC.checked,
      yearBuilt,
      rentPrice,
      dateAvailable,
    },
    errors,
  };
}

function showValidationErrors(errors) {
  const fieldNames = [
    "city",
    "streetName",
    "streetNumber",
    "areaSize",
    "yearBuilt",
    "rentPrice",
    "dateAvailable",
  ];

  for (const fieldName of fieldNames) {
    const input = newFlatForm.elements[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);
    const message = errors[fieldName] || "";

    input.classList.toggle("input-error", message !== "");
    errorElement.textContent = message;
  }

  const firstInvalidField = fieldNames.find((fieldName) => errors[fieldName]);

  if (firstInvalidField) {
    newFlatForm.elements[firstInvalidField].focus();
  }
}

newFlatForm.addEventListener("input", (event) => {
  const errorElement = document.getElementById(`${event.target.name}Error`);

  if (errorElement) {
    errorElement.textContent = "";
    event.target.classList.remove("input-error");
  }
});

newFlatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showFormFeedback("");

  const validationResult = validateForm();
  showValidationErrors(validationResult.errors);
  const hasErrors = Object.values(validationResult.errors).some(
    (message) => message !== "",
  );

  if (hasErrors) {
    showFormFeedback(
      "Corrige os campos assinalados antes de guardar.",
      "error",
    );
    return;
  }

  let oldFlats = loadFlats();
  let editedFlats = [];
  let newFlat = {};
  if (isEditMode) {
    editedFlats = oldFlats.data.map((flat) => {
      if (flat.id === requestedId) {
        return (flat = {
          ...validationResult.data,
          isFavorite: flat.isFavorite,
          id: requestedId,
        });
      }
      return flat;
    });
  } else {
    newFlat = {
      ...validationResult.data,
      isFavorite: false,
      id: Date.now(),
    };
  }

  const flatsContent = isEditMode
    ? [...editedFlats]
    : [...oldFlats.data, newFlat];
  const flats = {
    data: [...flatsContent],
    errors: { ...oldFlats.errors },
  };

  const isSaved = saveFlats(flats);

  if (isSaved) {
    clearForm;
    if (isEditMode) {
      window.location.href = "./flats.html";
      return;
    }
    showFormFeedback("O apartamento foi guardado com sucesso.", "success");
  } else {
    showFormFeedback(
      "Os dados são válidos.Algo correu mal ao guardar os dados.",
      "warning",
    );
  }
});

// Cycle through predefined examles and populate the form only.
// The example is persisted only if te user submits the form successful*y.
buttonExemples.addEventListener("click", () => {
  const flat = EXEMPLE_DATA[counter];
  if (counter === 2) {
    counter = 0;
  } else {
    counter++;
  }
  console.log(flat);
  document.getElementById("city").value = flat.city;
  document.getElementById("streetName").value = flat.streetName;
  document.getElementById("streetNumber").value = flat.streetNumber;
  document.getElementById("areaSize").value = flat.areaSize;
  document.getElementById("yearBuilt").value = flat.yearBuilt;
  document.getElementById("rentPrice").value = flat.rentPrice;
  document.getElementById("dateAvailable").value = flat.dateAvailable;
  document.getElementById("hasAC").checked = flat.hasAC;
});

/**
* Populates the form with the requested flat when the pge is in edit mode.

* A missing record must be handled as an invaid edit request rather than
* attmpting to read properties from und*fined.
*/
function renderNewFlat() {
  if (requestedId) {
    const allFlats = loadFlats();
    const flats = [...allFlats.data];

    const flatFiltered = flats.filter((flat) => flat.id == requestedId);
    let flat = flatFiltered[0];
    document.getElementById("city").value = flat.city;
    document.getElementById("streetName").value = flat.streetName;
    document.getElementById("streetNumber").value = flat.streetNumber;
    document.getElementById("areaSize").value = flat.areaSize;
    document.getElementById("yearBuilt").value = flat.yearBuilt;
    document.getElementById("rentPrice").value = flat.rentPrice;
    document.getElementById("dateAvailable").value = flat.dateAvailable;
    document.getElementById("hasAC").checked = flat.hasAC;
  }
}

if (getStorageMessage()) {
  showFormFeedback(getStorageMessage(), "warning");
}

function clearForm() {
  newFlatForm.elements.city.value = "";
  newFlatForm.elements.streetName.value = "";
  document.getElementById("streetNumber").value = "";
  document.getElementById("areaSize").value = "";
  document.getElementById("yearBuilt").value = "";
  document.getElementById("rentPrice").value = "";
  newFlatForm.elements.dateAvailable.value = "";
}
renderNewFlat();
