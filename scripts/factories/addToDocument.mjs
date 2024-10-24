const addToDocumentFactory = function(elementId, thingToAdd) {
    elementId = document.getElementById(elementId);
    thingToAdd.forEach(thing => elementId.append(thing));
}
export { addToDocumentFactory };