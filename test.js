submit.onclick = function () {
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
      while (window.find(wordToHighlight)) {
        try {
          window.getSelection().getRangeAt(0).surroundContents(document.createElement("MARK"));
        }
        catch (err) {
          continue;
        }
      }
      window.getSelection().removeAllRanges();

    }
    chrome.storage.local.set(knownWords);

  });
}
