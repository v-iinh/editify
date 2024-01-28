var showingSourceCode = false;
var isInEditMode = true;
var isUnorderedList = true;

function enableEditMode() {
    richTextField.document.designMode = 'On';
    richTextField.document.body.style.color = 'white';
    richTextField.document.body.style.fontFamily = '"Fira Code", monospace';
}

function execCmd(command) {
    richTextField.document.execCommand(command, false, null);
}

function execCommandWithArg(command, arg) {
    richTextField.document.execCommand(command, false, arg);
}
function toggleSource () {
    if(showingSourceCode){
        richTextField.document.getElementsByTagName('body')[0].innerHTML = 
        richTextField.document.getElementsByTagName('body')[0].textContent;
        showingSourceCode = false;
    }else{
        richTextField.document.getElementsByTagName('body')[0].textContent = 
        richTextField.document.getElementsByTagName('body')[0].innerHTML;
        showingSourceCode = true;
    }
}

function toggleEdit() {
    if(isInEditMode){
        richTextField.document.designMode = 'Off';
        isInEditMode = false;
    }else{
        richTextField.document.designMode = 'On';
        isInEditMode = true;
    }
}
function toggleDarkLight() {
    var element = document.body
    element.classList.toggle("dark-mode");
}

function toggleListType() {
    if (isUnorderedList) {
        execCmd('insertOrderedList');
    } else {
        execCmd('insertUnorderedList');
    }
    isUnorderedList = !isUnorderedList;
}

var alignmentOptions = ['justifyLeft', 'justifyCenter', 'justifyRight'];
var currentAlignmentIndex = 0;

function toggleAlignment() {
    currentAlignmentIndex = (currentAlignmentIndex + 1) % alignmentOptions.length;
    var selectedAlignment = alignmentOptions[currentAlignmentIndex];
    execCmd(selectedAlignment);
}

var fontSizeOptions = ['3', '4', '5', '6', '7'];
var currentFontSizeIndex = 0;

function toggleFontSize() {
    currentFontSizeIndex = (currentFontSizeIndex + 1) % fontSizeOptions.length;
    var selectedFontSize = fontSizeOptions[currentFontSizeIndex];
    execCommandWithArg('fontSize', selectedFontSize);
}

document.body.addEventListener('click', function() {
    var image = document.getElementById('image');
    if (image.style.display !== 'none') {
        image.style.display = 'none';
    }
});