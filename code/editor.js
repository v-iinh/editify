function showTextArea(language) {
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.style.display = 'none';
        document.getElementById("output").style.display = 'none';
    });
    document.getElementById(language).style.display = 'block';
}

const htmlCodeEl = document.querySelector("#html");
const cssCodeEl = document.querySelector("#css");
const jsCodeEl = document.querySelector("#js");
const outputEl = document.querySelector("#output");

function run() {
    localStorage.setItem('htmlCodeEl', htmlCodeEl.value);
    localStorage.setItem('cssCodeEl', cssCodeEl.value);
    localStorage.setItem('jsCodeEl', jsCodeEl.value);

    outputEl.contentDocument.body.innerHTML = `<style>${localStorage.cssCodeEl}</style>` + localStorage.htmlCodeEl;
    outputEl.contentWindow.eval(localStorage.jsCodeEl);
}

htmlCodeEl.value = localStorage.htmlCodeEl;
cssCodeEl.value = localStorage.cssCodeEl;
jsCodeEl.value = localStorage.jsCodeEl;

const fileInput = document.getElementById("fileInput");

function handleFile() {
const file = fileInput.files[0];
if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const fileContent = e.target.result;
        const fileType = getFileType(file.name);

        switch (fileType) {
            case 'html':
                htmlCodeEl.value = fileContent;
                break;
            case 'css':
                cssCodeEl.value = fileContent;
                break;
            case 'js':
                jsCodeEl.value = fileContent;
                break;
            default:
                alert('Unsupported file type');
        }
    };
        reader.readAsText(file);
    }
}

function exportFiles() {
    const htmlContent = htmlCodeEl.value;
    const cssContent = cssCodeEl.value;
    const jsContent = jsCodeEl.value;

    const combinedContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>BLS Web Development</title>
            <style>${cssContent}</style>
        </head>
        <body>
            ${htmlContent}
            <script>${jsContent}</script>
        </body>
        </html>
    `;

    const blob = new Blob([combinedContent], { type: 'text/html' });
    const confirmed = window.confirm("Press OK to Download File");
    if (confirmed) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'exported_code.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

function getFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    return extension;
}

function loadFileContent() {
    document.getElementById("output").style.display = 'flex';
    run();
}

document.body.addEventListener('click', function() {
    var image = document.getElementById('image');
    if (image.style.display !== 'none') {
        image.style.display = 'none';
    }
});