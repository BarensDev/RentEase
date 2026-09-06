"use strict";

const STORAGE_KEY = "renteaseFlats";
let storageMessage = "";
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
