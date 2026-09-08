"use strict";

/**
 * Shared data-access and formatting utilities for RentEase.
 *
 * This file is loaded before each page-specific script and exposes the
 * functions and constants used to read, write, normalize, and format flat data.
 *
 * Persisted storage shape:
 * {
 * data: Flat[],
 * errors: Object
 * }
 */

const STORAGE_KEY = "renteaseFlats";

// Stores the latest strage-layer warning so page controlers can present it
// through thei* own feedback component after a load or save operation.
let storageMessage = "";

// Sample values used only topopulate the creation form.
// The are not persisted until the user ubmits a valid form.
const EXEMPLE_DATA = [
  {
    areaSize: 100,
    city: "Beja",
    dateAvailable: "2027-01-01",
    hasAC: false,
    rentPrice: 850,
    streetName: "Rua do Alentejano",
    streetNumber: 77,
    yearBuilt: 2026,
  },
  {
    areaSize: 33,
    city: "Portimão",
    dateAvailable: "2027-05-01",
    hasAC: true,
    rentPrice: 525,
    streetName: "Av. da Escola da Sardinha",
    streetNumber: 66,
    yearBuilt: 2001,
  },
  {
    areaSize: 250,
    city: "Moncarapacho",
    dateAvailable: "2027-02-01",
    hasAC: false,
    rentPrice: 1800,
    streetName: "Av. Rei de Moncarapacho",
    streetNumber: 3,
    yearBuilt: 2020,
  },
];

/**
* Loads and parses the complete RentEase stor* from localStorage.

* Reading torage resets the previous storagemessage. A missing or invalid
* vlue should be treated as an empty tore, not as a flat containing empy data.
*/
function loadFlats() {
  storageMessage = "";
  try {
    const flatsStored = localStorage.getItem(STORAGE_KEY);

    if (flatsStored) {
      const flats = JSON.parse(flatsStored);
      return flats;
    } else {
      storageMessage = "Something went wrong while loading the flats data...\n";
    }
  } catch (error) {
    throw new Error(error);
  }
  return { data: [], errors: {} };
}

/**
* Serializes and replaces the complete RentEase store in localStoage.

* Callers must provide th entire store because localStoragedoes not merge
* individual recor*s.

*/
function saveFlats(flats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flats));
    storageMessage = "Flat guardado corretamente!";
    return true;
  } catch (error) {
    storageMessage = `Erro ao guardar... Tente Novamente mais tarde...\n${error}`;
  }
  return false;
}

function getStorageMessage() {
  return storageMessage;
}

/**
* Fromats a numeric rent value for dislay using Portuguese currency conv*ntions.
  Converts a numeric value into a string
*/
function formatCurrency(value) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

/* The function rearranges date components without creating a Date bject,
 * avoiding timezone converion for a date-only value.
 *
 * @aram {string} dateText
 * @returns{string}
 */
function formatDate(dateText) {
  const dateParts = dateText.split("-");

  if (dateParts.length !== 3) {
    return "Data inválida";
  }

  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

/*
* Produces a comparison key for case-insensitive ad accent-insensitive
* grouping o searching.

* This value is inended for comparison only and mustnot replace the original
* user-etered city name used for display.
*/
function normalizeStrings(str) {
  return str
    .normalize("NFD") // retorna a string conforme canonical decomposition: "á" = "a´"
    .replace(/[\u0300-\u036f]/g, "") //troca todos os caracteres acentuados por ""
    .toLowerCase()
    .trim();
}
