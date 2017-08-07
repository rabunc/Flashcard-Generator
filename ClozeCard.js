module.exports = ClozeCard;

function ClozeCard(text, cloze) {
    this.cloze = cloze;
    this.fullText = text;
    this.partial = function () {
        // if the cloze is in the text
        if (text.indexOf(cloze) >= 0) {
            var partialText = text.replace(cloze, '...');
            return partialText
        } else {
            // log an error
            console.log("Error! Cloze is not in text!")
        }
    }
}
