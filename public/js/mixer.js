

// Web Audio Api Instance
const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Our audio context
const analyserNode = audioContext.createAnalyser();
analyserNode.smoothingTimeConstant = 0.90;
const compressorNode = audioContext.createDynamicsCompressor();
// Volume Controls
const masterGain = audioContext.createGain();
const mainGain = audioContext.createGain();
const sourceGain = audioContext.createGain();
// Equalizier component - 4 biquadFilters creating a 3-band eq with a low pass filter sweep
// cut off frequency controlled via dom
const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 20050;
    filter.Q.value = 0.71;
// this is my bassline...my bassline...move move your wasteline...to my bassline
// low shelf amps <= frequency value....high shelf does the opposite
const low = audioContext.createBiquadFilter();
    low.type = 'lowshelf';
    low.frequency.value = 500.0;
    low.gain.value = 0.0;
// mids use peaking filter to amp frequency value
// q value is like a spread cooef
const mid = audioContext.createBiquadFilter();
    mid.type ='peaking';
    mid.frequency.value = 1000.0;
    mid.Q.value = 0.71;
    mid.gain.value = 0.0;
// da hizziees
const high = audioContext.createBiquadFilter();
    high.type = 'highshelf';
    high.frequency.value = 2000.0 ;
    high.gain.value = 0.0;
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//CANVAS VISUALIZATIONS FROM ANALYZER NODE----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

// canvas variable definitions
var canvas = $(visualizer)[0];
console.log(canvas);
var canvasContext = canvas.getContext("2d");


// visualize function adapted from web-audio-api voice-change-o-matic
function visualize() {
    // define the canvas where animation occurs
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    // empty the canvas
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
    // get our data to plot from analyzer node
    // provides us with real time frequency and time-domain analysis information
    // fft fast fourier transform.... determine freq domain
    analyserNode.fftSize = 1024;
    // half the fftSize - represents the datavalues we plot
    var bufferLength = analyserNode.frequencyBinCount;
    // array of 8-bit ints - length set to our buffer length
    var dataArray = new Uint8Array(bufferLength);
    // animation function
    function draw() {
        // calls the draw function - this function - recurrsively
        drawVisual = requestAnimationFrame(draw);
        // passes the current waveform into our  Uint8Array - so we have the current waveform represented as 64 binary numbers
        analyserNode.getByteTimeDomainData(dataArray);
        // paints the background of the canvas black
        canvasContext.fillStyle = 'rgb(0, 0, 0)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        // visual width + color 
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(236, 2, 55)';
        // starts to draw our wave
        canvasContext.beginPath();
        // chops canvas into equal width sections
        const sliceWidth = WIDTH * 1.0 / bufferLength;
        // x-axis
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] / 128;
            let y = v * HEIGHT / 2;
            if (i === 0) {
                // if its the first data point we move to begin drawing
                canvasContext.moveTo(x, y);
            } else {
                // we draw our line to the next point
                canvasContext.lineTo(x, y);
            }
            // where we are along the x-axis
            x += sliceWidth;
        }
        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();
    }
    draw();
}