"use strict";

const STORAGE_KEY = "renteaseFlats";
let storageMessage = "";
/*const STORAGE_TEST_VALUE =
  '{"data":[{"city":"Olhão","streetName":"Rua da Igreja","streetNumber":2,"areaSize":100,"hasAC":false,"yearBuilt":1920,"rentPrice":900,"dateAvailable":"2026-10-01","isFavorite":false,"id":1788391492486}],"errors":{}}';

console.log(STORAGE_TEST_VALUE);*/

function loadFlats() {
  storageMessage = "";
  try {
    const flatsStored = localStorage.getItem(STORAGE_KEY);

    if (flatsStored) {
      let flats = JSON.parse(flatsStored);
      //console.log(flats);
      //console.log(flatsStored);
      return flats;
    } else {
      storageMessage = "Something went wrong while loading the flats data...\n";
    }
  } catch (error) {
    throw new Error(error);
  }
  return { data: [{}], errors: {} };
}

function saveFlats(flats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flats));
    return true;
    storageMessage = "Flat guardado corretamente!";
  } catch (error) {
    storageMessage = "Erro ao guardar... Tente Novamente mais tarde...";
    throw new Error("Erro ao guardar... Tente Novamente mais tarde..." + error);
  }
  return false;
}

function getStorageMessage() {
  return storageMessage;
}

function formatCurrency(value) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

function formatDate(dateText) {
  const dateParts = dateText.split("-");

  if (dateParts.length !== 3) {
    return "Data inválida";
  }

  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}
