//cndictscript.js
//import {requestDeepl} from './cndictmodule.js';
//const { requestDeepl } = require('./cndictmodule.js');

//const axios = require('axios');

var deeplOutput = document.getElementById("translateDeeplBox");
var deeplStatus = document.getElementById("deeplBoxStatus");
var textArray;

function requestDeepl(userInput) {
  
  if (Array.isArray(userInput)) {
    textArray = userInput; // Use the array directly if it's already an array
  } else {
    textArray = [userInput]; // Wrap the string in an array if it's a single string
  }

  var requestData = {
    text: textArray,
    target_lang: 'ZH'
  };

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
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Parse the JSON response and extract the text field
    const translations = data.translations;
    if (translations && translations.length > 0) {
      const translatedText = translations[0].text;
      console.log('Translated Text:', translatedText);
      deeplOutput.value = translatedText;
      deeplStatus.placeholder = 'DeepL API Status: Ready, idle';
      return translatedText;
    } else {
      throw new Error('No translations found in the response');
    }
  })
  .catch(error => console.error('Error:', error));
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

var dictButton = document.getElementById("dictionarySearchButton");
var dictSearchBox = document.getElementById("searchInputBox");
dictButton.addEventListener("click", function(){
  var str = dictSearchBox.value;
  console.log(str);
});
dictSearchBox.addEventListener("keydown",function(event){
  //if ENTER, press button
  if(event.keyCode == 13){
    dictButton.click();
  }
});

var dictButton = document.getElementById("dictionarySearchButton");
var dictSearchBox = document.getElementById("searchInputBox");
dictButton.addEventListener("click", function(){
  var str = dictSearchBox.value;
  console.log(str);
});
dictSearchBox.addEventListener("keydown",function(event){
  //if ENTER, press button
  if(event.keyCode == 13){
    dictButton.click();
  }
});

var translateButton = document.getElementById("translateButton");
var translateBox = document.getElementById("translateInputBox");
translateButton.addEventListener("click", function(){
  var strTrans = translateBox.value;
  console.log(strTrans);
});
translateBox.addEventListener("keydown",function(event){
  //if ENTER, press button
  if(event.keyCode == 13){
    translateButton.click();
  }
});

function searchWebsites(){
      var searchTerm = document.getElementById("searchInputBox").value;
      // Update the source of each iframe to include the search term
      document.getElementById("naverFrame").src = "https://zh.dict.naver.com/#/search?query=" + encodeURIComponent(searchTerm);
      document.getElementById("weblioFrame").src = "https://cjjc.weblio.jp/content/" + encodeURIComponent(searchTerm);
      //document.getElementById("reversoFrame").src = "https://context.reverso.net/%E7%BF%BB%E8%AF%91/%E4%B8%AD%E6%96%87-%E8%8B%B1%E8%AF%AD/" + encodeURIComponent(searchTerm);
      document.getElementById("wikitFrame").src = "https://en.wiktionary.org/wiki/" + encodeURIComponent(searchTerm);
      document.getElementById("forvoFrame").src = "https://forvo.com/word/" + encodeURIComponent(searchTerm);
      document.getElementById("deeplFrame").src = "https://www.deepl.com/translator#zh/en/" + encodeURIComponent(searchTerm);
      document.getElementById("papagoFrame").src = "https://papago.naver.com/?sk=zh-CN&tk=en&st=" + encodeURIComponent(searchTerm);
      document.getElementById("baiduFrame").src = "https://fanyi.baidu.com/mtpe-individual/multimodal?query=" + encodeURIComponent(searchTerm) + "&lang=zh2en";
      document.getElementById("hanziFrame").src = "https://www.qhanzi.com/";
      //deeplStatus.placeholder = 'Sending API request...';
      //requestDeepl(searchTerm);
}

function translateWebsites(){
      var translateInput = document.getElementById("translateInputBox").value;
      document.getElementById("deeplFrame").src = "https://www.deepl.com/translator#zh/en/" + encodeURIComponent(translateInput);
      document.getElementById("papagoFrame").src = "https://papago.naver.com/?sk=zh-CN&tk=en&st=" + encodeURIComponent(translateInput);
      document.getElementById("baiduFrame").src = "https://fanyi.baidu.com/mtpe-individual/multimodal?query=" + encodeURIComponent(translateInput) + "&lang=zh2en";
      deeplStatus.placeholder = 'Sending API request...';
      requestDeepl(translateInput);
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