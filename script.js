// Script to show/hide selector in the form.
const selectTransporte = document.querySelector('#select-transporte');
document.querySelector('#select-mudanca').addEventListener(
  'change',
  (e) => {
    const isLocal = e.target.selectedOptions[0].textContent === 'Local';

    selectTransporte.required = !isLocal;
    selectTransporte.parentElement.classList.toggle('hide', isLocal);
    if (isLocal) selectTransporte.options[0].selected = true;
  },
  { passive: true }
);

//GOOGLE DOCS API SCRIPT

const APIKEY = 'AIzaSyAt8lfnPF6nwN9a02YWTzHWPQEtuY6ZRBU';
const CLIENTID = '729387998943-ii34osakf0qqa6qlcvn6f1dq9r5bov9r.apps.googleusercontent.com';
let MODELID = '1PeiHamkA9BRvEPTeIbQX_cb12UuOdq4wlMZAJfYqJV8';

import * as fs from 'fs';

// Made a fs read operation to fetch all the latest sent files.
const sentList = fs.readdirSync('H:/Meu Drive/ORÇAMENTOS').filter(file => file.match('ORÇAMENTO'));
let numbers = [];
for (each of sentList) {
  numbers.push(each.match(/\d+/g)[0]);
}
numbers.sort((a,b) => a - b);
const lastSent = parseInt(numbers.slice(-1)) + 1;

// The Google API will be loaded once the windows is started.
window.addEventListener('load', () => {
  authenticate().then(loadClient);
});

// Inside the form I added an event listener to do all the necessary operations.
const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {

  e.preventDefault();
  const formData = new FormData(form);

  let title = 'ORÇAMENTO ' + lastSent + ' ' +  formData.get('nome') + formData.get('origem') + ' X ' + formData.get('destino');
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  const time = new Date().toLocaleString('pt-br', options);

  if (formData.get('mudanca') === 'Local') {

    title = 'ORÇAMENTO ' + lastSent + ' — ' + formData.get('nome') + '— LOCAL';

    const requestArray = [
      formRequest(formData.get('nome'), 'argumento1'),
      formRequest(formData.get('email'), 'argumento2'),
      formRequest(formData.get('numero'), 'argumento3'),
      formRequest(time, 'argumento4'),
      formRequest(formData.get('valor'), 'argumento5'),
      formRequest(lastSent, 'argumento6')
    ]
    execute(title, requestArray);
  }
});

/**
 * Creates a json body with a Google API request body for batch update method.
 * 
 * @param {string} newText Text that will replace the old text.
 * @param {string} toReplace The old text.
 * @returns One replaceAllText kind request.
 */
function formRequest(newText, toReplace) {

  let request = {
    "replaceAllText": {
      "replaceText": newText,
      "containsText": {
        "text": `[${toReplace}]`,
        "matchCase": false
      }
    }
  }
  return request
}
function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive' })
    .then(function () { console.log('Sign-in successful'); },
      function (err) { console.error('Error signing in', err); });
}
function loadClient() {
  gapi.client.setApiKey(APIKEY);
  return gapi.client.load('https://docs.googleapis.com/$discovery/rest?version=v1')
    .then(function () { console.log('GAPI client loaded for API'); },
      function (err) { console.error('Error loading GAPI client for API', err); });
}

function execute(title, requestArray) {

  let copy = gapi.client.drive.files.copy({
    'fileId': MODELID,
    'resource': {}
  });

  gapi.client.request({
    'path': 'https://www.googleapis.com/drive/v3/files/' + id + '?key=' + APIKEY,
    'method': 'PATCH',
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + CLIENTID,
    },
    'data': {
      'name': title
    }
  });

  return gapi.client.docs.documents.batchUpdate({
    'documentId': copy.id,
    'resource': {
      'requests': requestArray
    }
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response);
    },
      function (err) { console.error('Execute error', err); });
}

gapi.load('client:auth2', function () {
  gapi.auth2.init({ client_id: CLIENTID });
});