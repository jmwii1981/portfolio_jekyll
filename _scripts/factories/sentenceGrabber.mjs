/* 
    SENTENCE GRABBER FACTORY
    ------------------------
    OPTIONS
        • <option>

*/
const sentenceGrabberFactory = function(sentenceToGrab) {
    // Let's get the ball rolling ...
    let sentenceToGrabContent = document.getElementById(sentenceToGrab).textContent;

    const sentenceToGrabEl = document.getElementById(sentenceToGrab)
    let textNode = sentenceToGrabEl.firstChild;
    let nextTextNode = ``;

    while (textNode) {
        nextTextNode = textNode.nextSibling;
        if (textNode.nodeType == 3) {
            sentenceToGrabEl.removeChild(textNode);
        }
        textNode = nextTextNode;
    }
    return sentenceToGrabContent;
}
export { sentenceGrabberFactory };