//cndictmodule.js
const axios = require('axios');

function requestDeepl(userInput){
  var requestData = {
    text: userInput,
    target_lang: 'ZH'
  };

//  const apiUrl = 'http://localhost:10000';
  const apiUrl = 'https://deeplapi-b3sa.onrender.com';

  // Set up the Axios POST request
  axios.post(apiUrl, requestData, {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'checker-header': 'translate-please'
    }
  })
  .then(response => {
    console.log('Response:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

module.exports = { requestDeepl };