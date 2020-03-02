submit.onclick = function () {
  let chosenVocab = firstList.children;

  for (let index = 0; index < chosenVocab.length; index++) {

    let wordToHighlight = chosenVocab[index].text;

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
}