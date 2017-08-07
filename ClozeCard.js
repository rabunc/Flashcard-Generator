module.exports = ClozeCard;

function ClozeCard(text, cloze) {
    if (text.indexOf(cloze) >= 0) {
        this.partial = text.replace(cloze, '...');
        this.cloze = cloze;
        this.fullText = text;
    } else {
        // log an error
        console.log("Error! Cloze is not in text!")
    }
}
