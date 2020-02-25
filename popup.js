// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var styles = `\`/* The Modal (background) */
    .modal {
      display: none; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }
    
    /* Modal Content/Box */
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto; /* 15% from the top and centered */
      padding: 20px;
      border: 1px solid #888;
      width: 80%; /* Could be more or less, depending on screen size */
    }
    
    /* The Close Button */
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }\``


let addedWords = [];
let uncommonWords = [];
let knownWords = {};


function open_modal() {
  //block
  chrome.tabs.executeScript({
    code: `var modal = document.getElementById("myModal");
        modal.style.display = "block";`
  });
}

function close_modal() {
  chrome.tabs.executeScript({
    code: `var modal = document.getElementById("myModal");
    modal.style.display = "none";`
  });
}

getNewVocab.onclick = function () {
  chrome.storage.local.get(knownWords, function (result) {
    if (!result) {
      result = {};
    }
    knownWords = Object.keys(result);

    chrome.tabs.executeScript({
      code: "window.getSelection().toString();"
    }, function (selection) {
      var res = selection[0].split(" ");
      res.forEach(element => {
        element = element.replace(/[.,\/#!$%\^&\*;\':{}=\-_`~()]/g, "");
        element = element.toLowerCase();
        if (!(knownWords.includes(element))) {
          uncommonWords.push(element);
          chrome.tabs.executeScript({
            code: `window.getSelection().removeAllRanges();`
          });
        }
      });

      //insert css for modal
      chrome.tabs.executeScript({
        code: `var styleSheet = document.createElement("style");
               styleSheet.type = "text/css";
               styleSheet.innerText = ${styles};
               document.head.appendChild(styleSheet);`
      });

      //create html options
      let htmlOptions = "";
      let index = 0;

      uncommonWords.forEach(element => {
        htmlOptions += ` <option value ="${index}">${element}</option>`;
        index++;
      });

      //add html for modal
      chrome.tabs.executeScript({
        code: `var block_to_insert;
        block_to_insert = document.createElement('div');
        block_to_insert.innerHTML =
        \`<!-- The Modal --> <div id="myModal" class="modal"> <!-- Modal content --> <div class="modal-content"> <span class="close">&times;</span> <body>
        <h2>Move Items From One List to Another</h2>
        <select id="sbOne" multiple="multiple">
        ${htmlOptions}
        </select>
     
        <select id="sbTwo" multiple="multiple">
        </select>
     
        <br />
     
        <input type="button" id="left" value="<" />
        <input type="button" id="right" value=">" />
        <input type="button" id="submit" value="Submit" />
  
        </body>
  
         </div> </div>\`; document.body.appendChild(block_to_insert);
        // When the user clicks on <span> (x), close the modal
        var span = document.getElementsByClassName("close")[0];
  
        span.onclick = function() {
        modal.style.display = "none";
        }
      
      var right = document.getElementById("right");
      var left = document.getElementById("left");
      var submit = document.getElementById("submit");
  
      var firstList = document.getElementById("sbOne");
      var secondList = document.getElementById("sbTwo");
  
      var moveItems = function(origin, dest) {
        let opt = document.createElement("option");
        opt.text = origin[origin.selectedIndex].innerText;
        opt.value = origin.value;
        origin.remove(origin.selectedIndex);
        dest.add(opt);
      }
      right.onclick = function() {
        moveItems(firstList, secondList);
      }
      left.onclick = function() {
        moveItems(secondList, firstList);
      }
  
      submit.onclick = function() {
        modal.style.display = "none";
        let knownWords = {};
        chrome.storage.local.get(knownWords, function (result) {
          if (!result) {
            result = {};
          }
      

      
  
        let chosenVocab = firstList.children;
  
        for (let index = 0; index < chosenVocab.length; index++) {
  
          let wordToHighlight = chosenVocab[index].text;
          console.log(wordToHighlight);
          knownWords[wordToHighlight] = '';
          while(window.find(wordToHighlight)){
            try{
            window.getSelection().getRangeAt(0).surroundContents(document.createElement("MARK"));
            }
            catch(err){
              continue;
            }
          }
          window.getSelection().removeAllRanges();
          
        }
          chrome.storage.local.set(knownWords);
          console.log(knownWords);
        
      });}
    
     
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }`
      });
      open_modal();
    });

  });



};






/*if (window.confirm(`Do you want to add ${element} to your dictionary?`)) {
  addedWords.push(element);
  chrome.tabs.executeScript({
    code: `while(window.find("${element}")) {window.getSelection().getRangeAt(0).surroundContents(document.createElement("MARK"));}`
  });

}*/