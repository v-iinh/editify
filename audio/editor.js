document.body.addEventListener('click', function() {
    var image = document.getElementById('image');
    if (image.style.display !== 'none') {
        image.style.display = 'none';
    }
    document.getElementById('area').style.display = 'flex';
});

function importMedia(event) {
    const file = event.target.files[0];
    const audioPlayer = document.getElementById('audioPlayer');
    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            audioPlayer.src = event.target.result;
            audioPlayer.play();
        };
        fileReader.readAsDataURL(file);
    }
}

function visualize() {
    const audioContext = new AudioContext();
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSrc = audioContext.createMediaElementSource(audioPlayer);
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');
    const analyser = audioContext.createAnalyser();

    canvas.style.display = "flex";
    audioPlayer.style.display = "none";

    audioSrc.connect(analyser);
    analyser.connect(audioContext.destination);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = '#1f1f1f';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
        const numCircles = bufferLength;
        const angleIncrement = (Math.PI * 2) / numCircles;
        const centerX = WIDTH / 2;
        const centerY = HEIGHT / 2;
        const maxRadius = Math.min(WIDTH, HEIGHT) / 2;
        
        for (let i = 0; i < numCircles; i++) {
            const angle = i * angleIncrement;
            const magnitude = dataArray[i] / 255;
            const circleRadius = magnitude * maxRadius;
            const x = centerX + (maxRadius - circleRadius) * Math.cos(angle);
            const y = centerY + (maxRadius - circleRadius) * Math.sin(angle);
    
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, circleRadius, 0, 2 * Math.PI);
            canvasCtx.fillStyle = `rgb(${Math.floor(255 * magnitude)}, ${Math.floor(255 * magnitude)}, ${Math.floor(255 * magnitude)})`;
            canvasCtx.fill();
            canvasCtx.closePath();
        }
    }
    draw();
}

function slowDown() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.playbackRate -= 0.25;
}

function speedUp() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.playbackRate += 0.25;
}

function pitchDown() {
    const audioCtx = new AudioContext();
    const audioPlayer = document.getElementById('audioPlayer');
    const source = audioCtx.createMediaElementSource(audioPlayer);
    const pitchShift = 0.5;

    const processor = audioCtx.createScriptProcessor(1024, 1, 1);
    processor.onaudioprocess = function(event) {
        const inputData = event.inputBuffer.getChannelData(0);
        const outputData = event.outputBuffer.getChannelData(0);

        for (let sample = 0; sample < inputData.length; sample++) {
            outputData[sample] = inputData[sample * pitchShift];
        }
    };
    source.connect(processor);
    processor.connect(audioCtx.destination);
    audioPlayer.play();
}

function pitchUp() {
    const audioCtx = new AudioContext();
    const audioPlayer = document.getElementById('audioPlayer');
    const source = audioCtx.createMediaElementSource(audioPlayer);
    const pitchShift = 1.5;

    const processor = audioCtx.createScriptProcessor(1024, 1, 1);
    processor.onaudioprocess = function(event) {
        const inputData = event.inputBuffer.getChannelData(0);
        const outputData = event.outputBuffer.getChannelData(0);

        for (let sample = 0; sample < inputData.length; sample++) {
            outputData[sample] = inputData[Math.floor(sample / pitchShift)];
        }
    };
    source.connect(processor);
    processor.connect(audioCtx.destination);
    audioPlayer.play();
}