//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// GLOBAL VARIABLE DEFINITIONS-------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

var playButton = $('#playbtn');
var powerButton = $('#btn1-container');
var blueButton = $('#btn2-container');
var vaderSVG = $('.vader');
var powerSVG = $('.power');
var playSVG = $('.play');
var input = $('#audioFile');
var muteButton = $('#mutebtn');
var stopButton = $('#stopbtn');
var source = null; // This is the BufferSource containing the buffered audio
var powerLED;


//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// WEB AUDIO COMPONENT SETUP---------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

// Web Audio Api Instance
var audioContext = new (window.AudioContext || window.webKitAudioContext)(); // Our audio context
// Volume Controls
var masterGain = audioContext.createGain();
var sourceGain = audioContext.createGain();
var mainGain = audioContext.createGain();

//compressing sound for quality (not doing anything currently but set up to)
var compressorNode = audioContext.createDynamicsCompressor();

//analyzes audio context for visuals
var analyserNode = audioContext.createAnalyser();
analyserNode.smoothingTimeConstant = 0.90;

// Equalizier component - 4 biquadFilters creating a 3-band eq with a low pass filter sweep
// this is my bassline...my bassline...move move your wasteline...to my bassline
// low shelf amps <= frequency value....high shelf does the opposite
var low = audioContext.createBiquadFilter();
low.type = "lowshelf";
low.frequency.value = 500.0;
low.gain.value = 0.0;

// mids use peaking filter to amp frequency value
// q value is like a spread cooef
var mid = audioContext.createBiquadFilter();
mid.type = "peaking";
mid.frequency.value = 1000.0;
mid.Q.value = 0.61;
mid.gain.value = 0.0;

// da hizziees
var high = audioContext.createBiquadFilter();
high.type = "highshelf";
high.frequency.value = 2000.0;
high.gain.value = 0.0;

// cut off frequency controlled via dom
var filter = audioContext.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 20050;
filter.Q.value = 0.71;    


//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// PLAYBACK FUNCTIONS----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

//utility function to check state
function powerIsOn(){
    console.log('fugittaboutit')
    var pwr = $(powerButton).hasClass('on') ? true : false;
    return pwr;
}
function loadTrack(){
    request = new XMLHttpRequest();
    request.open('GET', '../assets/audio/gta.mp3', true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        let mp3ArrayBuffer = request.response;
        decodeArrayBuffer(mp3ArrayBuffer);
    };
    request.send();
}
function playTrack(){
    source.start(0);    
    $(playSVG).toggleClass('on');
    $(vaderSVG).toggleClass('on');
    triggerVisuals();    
}

function stopPlayback(){
  if (source !== null) {
    source.disconnect(sourceGain);
    console.log('disconnected');
    source = null;
    $(playSVG).removeClass('on');
    $(vaderSVG).removeClass('on');

  }
}

//process the buffer and prep for playback
function decodeArrayBuffer(mp3ArrayBuffer) {
    audioContext.decodeAudioData(mp3ArrayBuffer, function (decodedAudioData) {
        // Clear any existing audio source that we might be using        
        stopPlayback();
        // create our audio source 
        source = audioContext.createBufferSource();
        source.buffer = decodedAudioData;
        connectMixer();
    }); 
}

// web audio component connections to make an audio grid
function connectMixer(){
    // handler for visualiztion events
    console.log('inside conncection');
    console.log('your track is: ')
    console.log(source);
    // audio grid begins with audio source
    source.connect(sourceGain)
    // filter sweep first 
    .connect(filter)
    // passes directrly through eq components
    .connect(low).connect(mid).connect(high)
    // send gain - how much sound we let out of our eq
    // currently set a full and inaccessible via dom
    .connect(mainGain)
    // compressor to handle future implementations of component nodes
    .connect(compressorNode)
    // output volume - analyzer for visuals - destination = speakers
    .connect(masterGain).connect(analyserNode).connect(audioContext.destination);
}


//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// UI COMPONENT CONSTRUCTORS----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

// constructor functions for ui round sliders (knobs) using jquery module
function createRoundSlider(name, type, input, sliderType, radius, width, min, max, initValue, step, stAngle, endAngle){
    $(name).roundSlider({
        sliderType: sliderType,
        radius: radius,
        width: width,
        min: min,
        max: max,
        value: initValue,
        step: step,
        startAngle: stAngle,
        endAngle: endAngle,
        mouseScrollAction: true,
        change: function(event){
            let eq = $(name).data('roundSlider');
            type.gain.value = eq.option('value');
        }
    });
}
// creates the filter knob - can be refactored into above function
function createFilterSweep(name, type, input, sliderType, radius, width, min, max, stAngle, endAngle, step){
    $(name).roundSlider({
        sliderType: sliderType,
        radius: radius,
        width: width,
        min: min,
        max: max,
        step: step,
        value: 20050.0,
        startAngle: stAngle,
        endAngle: endAngle,
        mouseScrollAction: true,
        change: function(event){
            let eq = $(name).data('roundSlider');
            type.frequency.value = eq.option('value');
        }
    });
}

// creates tempo and master volume sliders (different from above round sliders) 
function createEffectControl(controlName, elemID, inputValueID, orientation, range, min, max, initValue, step ){
    $(elemID).slider({
        orientation : orientation,
        range : range,
        min : min,
        max : max,
        value : initValue,
        step : step,
        slide : function(event, ui) {
            let input = $(inputValueID).val(ui.value);
            let val = input[0].value;
            controlName.gain.value = val;
            let myLEDs = $('.powerLED');
            let myOtherLEDs = myLEDs[1].children;            
            myLEDs = myLEDs[0].children;
            isLEDActive(myLEDs);
            isLEDActive(myOtherLEDs);
        }
    });
}

// creates ui master volume 'lights'
function $createLEDContainer(){
    powerLED = $('<div>').addClass('powerLED mixer-item');
    for(let i = 0; i < 10; i++){
        let min = (i * 10) + 1;
        let led = $('<div>').addClass('LED').addClass('inactive').data("min", min);
        led = led[0];
        $(led).appendTo(powerLED);
        console.log('updated powerLED');
    }
}

//sets class active class on each led based on master gain value
function isLEDActive(LEDs) {
    if(powerIsOn()){
        let amount = masterGain.gain.value * 100;
        $(LEDs).each(function() {
            let min = $(this).data().min;
            console.log(min);
            if (min <= amount) {
                $(this).removeClass('inactive').removeClass('active').addClass('active');
            } else {
                $(this).removeClass('active').removeClass('inactive').addClass('inactive');
            }
        });
    } 
}


//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//CANVAS VISUALIZERS-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

// canvas variable definitions
var canvas = $('#visualizer')[0];
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
            // y-axis point
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

// can handle multiple visualizations
function triggerVisuals(){
    visualize();
}


//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// DOCUMENT READY--------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

$(document).ready(function(){
    $createLEDContainer();
    $(powerLED).appendTo(".mixer");
 
    $createLEDContainer();
    $(powerLED).prependTo(".mixer");

    //createEffectControl(controlName, elemID, inputValueID, orientation, range, min, max, initValue, step )
    createEffectControl(masterGain, '#master-gain', '#amount', 'vertical', 'min', 0, 1, 1, 0.1);
    createEffectControl(sourceGain, '#source-gain', '#source-input', 'vertical', 'min', 0, 1, 1, 0.1);
    createEffectControl(mainGain, '#main-gain', '#main-input', 'horizontal', 'min', 0, 1, 1, 0.1);
   
    //createRoundSlider(name, type, property, input, sliderType, radius, width, min, max, initValue, step, stAngle, endAngle)
    createRoundSlider('#low-slider', low, '#low-input', 'min-range', 16, 7, -12, 12, 0, 0.2, 315, 225);
    createRoundSlider('#mid-slider', mid, '#mid-input', 'min-range', 16, 7, -12, 12, 0, 0.2, 315, 225);
    createRoundSlider('#high-slider', high, '#high-input', 'min-range', 16, 8, -12, 12, 0, 0.2, 315, 225);
    //createRoundSlider(name, type, property, input, sliderType, radius, width, min, max, initValue, step, stAngle, endAngle, step)
    createFilterSweep('#filter-slider', filter, '#filter-input', 'min-range', 24, 12, 10, 20050, 315, 90, 650);

    // create tempo slide from the source playbackRate
    // refactor this into  effect control
    $("#tempo-slider" ).slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 2,
        value: 1,
        step: 0.01,
        slide: function( event, ui ) {
            let tempo = $("#tempo-slider").slider("value");
            console.log(tempo);
            source.playbackRate.value = tempo;
            }
    });
    $( "#tempo-input" ).val( $( "#tempo-slider" ).slider( "value" ) );

    // event listener for clicking on power button
    // triggers ui transitions 
    $(powerButton).click(function(event) {
        $(this).toggleClass('on');
        let myLEDs = $('.LED');
        $(myLEDs).toggleClass('on');
        $(powerSVG).toggleClass('on');
        $(blueButton).toggleClass('on');
        
        if(powerIsOn()){
            stopPlayback();
            loadTrack();
            myLEDs = $('.powerLED');
            let myOtherLEDs = myLEDs[1].children;            
            myLEDs = myLEDs[0].children;
            isLEDActive(myLEDs);
            isLEDActive(myOtherLEDs);
            console.log('mixer connected');
        } else if(!powerIsOn()){
            stopPlayback();
            myLEDs.removeClass('on');
            $(blueButton).removeClass('on');
            $(vaderSVG).removeClass('on');
        }
    });

    // Assign event handler for when the 'Play' button is clicked
    $(playButton).click(function(event) {
        event.stopPropagation();
        if(powerIsOn()){
            playTrack();
        } else {
            alert('turn the power on dumb dumb')
        }
    });

    //event handler for when the "stop button is pushed"
    $(stopButton).click(function(event) {
        stopPlayback();
        loadTrack();
    });
});
