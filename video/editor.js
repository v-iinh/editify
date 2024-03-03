let video;
document.body.addEventListener('click', function() {
    var image = document.getElementById('image');
    if (image.style.display !== 'none') {
        image.style.display = 'none';
    }
});

function slowDown() {
    const area = document.getElementById('area');
    video = area.querySelector('video');
    if (video && video.playbackRate > 0.25) {
        video.playbackRate -= 0.25;
    }
}

function speedUp() {
    const area = document.getElementById('area');
    video = area.querySelector('video');
    if (video) {
        video.playbackRate += 0.25;
    }
}

function greenScreen() {
    const area = document.querySelector('.area');
    const videos = area.querySelectorAll('video');

    videos.forEach(video => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        area.insertBefore(canvas, video.nextSibling);

        function updateSize() {
            const areaWidth = area.offsetWidth;
            const newVideoWidth = areaWidth * 0.45;
            const newVideoHeight = (newVideoWidth / video.videoWidth) * video.videoHeight;

            video.style.width = `${newVideoWidth}px`;
            video.style.height = `${newVideoHeight}px`;

            canvas.width = newVideoWidth;
            canvas.height = newVideoHeight;
        }

        function updateCanvas() {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const greenMin = [0, 100, 0];
            const greenMax = [100, 255, 100];

            for (let i = 0; i < data.length; i += 4) {
                const pixel = [data[i], data[i + 1], data[i + 2]];
                if (
                    pixel[0] >= greenMin[0] && pixel[0] <= greenMax[0] &&
                    pixel[1] >= greenMin[1] && pixel[1] <= greenMax[1] &&
                    pixel[2] >= greenMin[2] && pixel[2] <= greenMax[2]
                ) {
                    data[i + 3] = 0;
                }
            }

            context.putImageData(imageData, 0, 0);
            requestAnimationFrame(updateCanvas);
        }
        updateSize();
        updateCanvas();
        window.addEventListener('resize', () => {
            updateSize();
            updateCanvas();
        });
    });
}
greenScreen();



function toggleSubtitles() {
    const area = document.getElementById('area');
    video = area.querySelector('video');
    if (video) {
        const textTracks = video.textTracks;
        if (textTracks.length > 0) {
            textTracks[0].mode = (textTracks[0].mode === 'showing') ? 'hidden' : 'showing';
        }
    }
}

function toggleSound() {
    const area = document.getElementById('area');
    video = area.querySelector('video');
    if (video) {
        video.muted = !video.muted;
    }
}

function importMedia(event) {
    const fileInput = event.target;
    const area = document.getElementById('area');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (fileInput.files[0].type.startsWith('video/')) {
                const previewImage = document.getElementById('image');
                if (previewImage) {
                    previewImage.parentNode.removeChild(previewImage);
                }
                const video = document.createElement('video');
                video.src = e.target.result;
                video.controls = true;
                video.controlsList = "nofullscreen nodownload noplaybackrate";
                video.disablePictureInPicture = true
                video.style.width = '100%';
                video.style.height = '100%';
                area.appendChild(video);
            }
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}