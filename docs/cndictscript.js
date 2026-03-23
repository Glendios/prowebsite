//cndictscript.js
//import {requestDeepl} from './cndictmodule.js';
//const { requestDeepl } = require('./cndictmodule.js');

//const axios = require('axios');

var deeplOutput = document.getElementById("deeplResultText");
var deeplStatus = document.getElementById("deeplStatus");

function requestDeepl(userInput) {
  if (Array.isArray(userInput)) {
    textArray = userInput;
  } else {
    textArray = [userInput];
  }

  var requestData = {
    text: textArray,
    target_lang: 'ZH'
  };

  deeplStatus.textContent = 'Waiting for API — may take ~30s...';

  fetch('https://deeplapi-xx79.onrender.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'KRSK CNDict/1.0.0',
      'checker-header': 'translate-please'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    const translations = data.translations;
    if (translations && translations.length > 0) {
      const translatedText = translations[0].text;
      console.log('Translated Text:', translatedText);
      deeplOutput.textContent = translatedText;
      deeplStatus.textContent = 'Ready';
    } else {
      throw new Error('No translations found in the response');
    }
  })
  .catch(error => {
    deeplStatus.textContent = 'API error: ' + error.message;
    console.error('Error:', error);
  });
}



var timeHideElement = document.querySelector('.tohide-element');
setTimeout(function(){
  timeHideElement.style.transform = 'translateY(-500%)';
  timeHideElement.style.margin = 0;
  //timeHideElement.style.maxHeight = '0';
  //document.querySelector('.content').style.marginTop = '0';
  //document.querySelector('.arrow-reshow').style.display = 'block';  
  setTimeout(function(){
    timeHideElement.style.maxHeight = '0';
  },100);
},3000);

function toggleSource(frameId, btn) {
  btn.classList.toggle('on');
  document.getElementById('card-' + frameId).classList.toggle('hidden');
}

document.querySelectorAll('.toggle-btn:not(.link-btn)').forEach(function(btn) {
  btn.addEventListener('click', function() { toggleSource(btn.dataset.frame, btn); });
});

document.getElementById('scrollTopButton').addEventListener('click', scrollToTop);

var dictButton = document.getElementById("dictionarySearchButton");
var dictSearchBox = document.getElementById("searchInputBox");
dictButton.addEventListener("click", searchWebsites);
dictSearchBox.addEventListener("keydown", function(event) {
  if (event.keyCode == 13) { dictButton.click(); }
});

function searchWebsites(){
      var searchTerm = document.getElementById("searchInputBox").value;
      // Update the source of each iframe to include the search term
      document.getElementById("naverFrame").src = "https://zh.dict.naver.com/#/search?query=" + encodeURIComponent(searchTerm);
      document.getElementById("weblioFrame").src = "https://cjjc.weblio.jp/content/" + encodeURIComponent(searchTerm);
      document.getElementById("wikitFrame").src = "https://en.wiktionary.org/wiki/" + encodeURIComponent(searchTerm);
      document.getElementById("baiduLink").href = "https://fanyi.baidu.com/mtpe-individual/transText?query=" + encodeURIComponent(searchTerm) + "&lang=zh2en";
      document.getElementById("hanziFrame").src = "https://www.qhanzi.com/";
      document.getElementById("zdicLink").href = "https://www.zdic.net/hans/" + encodeURIComponent(searchTerm);
      document.getElementById("baiduDictFrame").src = "https://dict.baidu.com/s?wd=" + encodeURIComponent(searchTerm);
      // open-tab links (these sites block iframing)
      document.getElementById("forvoLink").href = "https://forvo.com/word/" + encodeURIComponent(searchTerm);
}

function scrollToTop(){
  // window.scrollTo(xCoord, yCoord);
  window.scrollTo(0,0);
}

function scrollToTopFrame(iframeId){
  var iframe = document.getElementById(iframeId);
  iframe.contentWindow.scrollTo(0,0);
  //iframe.contentWindow.scrollBy(0, -iframeWindow.pageYOffset);
}

function scrollToTopIframes() {
    //var iframeWindow = iframe.contentWindow;
    //scrollToTopFrame(naverFrame);
    scrollToTopFrame('weblioFrame');
    scrollToTopFrame("wikitFrame");
    var iframeArray = ['naverFrame','weblioFrame','wikitFrame','forvoFrame'];
    iframeArray.forEach(scrollToTopFrame);
    
}

function scrollDown(){
  window.scroll(0,window.scrollY+50);
}