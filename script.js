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

// The Google API will be loaded once the windows is started.
window.addEventListener('load', () => {
  authenticate().then(loadClient);
});

// Inside the form I added an event listener to do all the necessary operations.
const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {

  e.preventDefault();
  const formData = new FormData(form);
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const time = new Date().toLocaleString('pt-br', options);
  let titleObject;

  if (formData.get('mudanca') === 'Local') {

    titleObject = {
      cliente: formData.get('nome'),
      tipo: 'Local'
    };

    const requestArray = [
      formRequest(formData.get('nome'), 'argumento1'),
      formRequest(formData.get('email'), 'argumento2'),
      formRequest(formData.get('numero'), 'argumento3'),
      formRequest(time, 'argumento4'),
      formRequest(formData.get('valor'), 'argumento5'),
      formRequest(formData.get('localDeEnvio'), 'argumento7')
    ]
    execute(titleObject, requestArray);
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
  gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v2/rest")
    .then(function () { console.log("GAPI client loaded for API"); },
      function (err) { console.error("Error loading GAPI client for API", err); })
  return gapi.client.load('https://docs.googleapis.com/$discovery/rest?version=v1')
    .then(function () { console.log('GAPI client loaded for API'); },
      function (err) { console.error('Error loading GAPI client for API', err); });
}

function execute(title, requestArray) {
  let copy = gapi.client.drive.files.copy({
    'fileId': MODELID,
    'resource': {}
  }).then((res) => res.result.id);

  const numbers = gapi.client.drive.files.list({
    "q": "title contains 'ORÇAMENTO'"
  }).then((res) => {
    res.result.files
      .map(item => item.name.match(/\d+/g)[0])
      .sort((a, b) => a - b);
  });

  const lastSent = parseInt(numbers.at(-1), 10) + 1;
  requestArray.push(formRequest(lastSent, 'argumento6'))
  gapi.client.drive.files.patch({
    "fileId": copy,
    "resource": {
      "title": 'ORÇAMENTO Nº ' + lastSent + ' | ' + title.cliente + ' | ' + title.tipo
    }
  });

  return gapi.client.docs.documents.batchUpdate({
    'documentId': copy.id,
    'resource': {
      'requests': requestArray
    }
  })
    .then(function (response) {
      console.log('Response', response);
    },
      function (err) { console.error('Execute error', err); });
}

gapi.load('client:auth2', function () {
  gapi.auth2.init({ client_id: CLIENTID });
});