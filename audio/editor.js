document.body.addEventListener('click', function() {
    var image = document.getElementById('image');
    if (image.style.display !== 'none') {
        image.style.display = 'none';
    }
});