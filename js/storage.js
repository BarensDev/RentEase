"use strict";

const STORAGE_KEY = "renteaseFlats";
let storageMessage = "";

function loadFlats() {
  storageMessage = "";

  /*
   * TODO JS-STORAGE-1
   * 1. Lê STORAGE_KEY com localStorage.getItem().
   * 2. Se a chave não existir, devolve [].
   * 3. Converte a string com JSON.parse().
   * 4. Confirma que o resultado é um array.
   * 5. Se ocorrer um erro, define storageMessage e devolve [].
   */

  return [];
}

function saveFlats(flats) {
  /*
   * TODO JS-STORAGE-2
   * 1. Converte o array com JSON.stringify().
   * 2. Guarda a string com localStorage.setItem().
   * 3. Devolve true quando a gravação termina.
   * 4. Se ocorrer um erro, define storageMessage e devolve false.
   */

  storageMessage = "Completa saveFlats() para guardar o array no browser.";
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
