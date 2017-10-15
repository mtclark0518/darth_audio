//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// GLOBAL VARIABLE DEFINITIONS-------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// CREATE DARTH AUDIO MIXER UI-------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
const mixer = $('.mixer');
const mixerControls = $('<div>').addClass('mixer-controls').attr('id', 'mixer-group');
const topControls = $('<div>').addClass('controls').attr('id', 'top-controls');
const bottomControls = $('<div>').addClass('controls').attr('id', 'bottom-controls');
const slideContainer = $('<div>').addClass('top').attr('id', 'slide-container');
const buttonContainer = $('<div>').addClass('top').attr('id', 'button-container');
const slide1 = $('<div>').addClass('slide').attr('id', 'visualizer-container');
const slide2 = $('<div>').addClass('slide').attr('id', 'effect1-container');
const slide3 = $('<div>').addClass('slide').attr('id', 'effect2-container');
const btn1 = $('<div>').addClass('btn').attr('id', 'btn1-container');
const btn2 = $('<div>').addClass('btn').attr('id', 'btn2-container');
const switch1 = $('<div>').addClass('switch').attr('id', 'eq-container');
const switch2 = $('<div>').addClass('switch').attr('id', 'master-gain-container');
const switch3 = $('<div>').addClass('switch').attr('id', 'tempo-slider-container');
const switch4 = $('<div>').addClass('switch').attr('id', 'play-stop-pause-container');
const eq1 = $('<div>').addClass('eq-knob');
const eq2 = $('<div>').addClass('eq-knob');
const eq3 = $('<div>').addClass('eq-knob');
const visualizer = $('<canvas>').addClass('visualizer');
const filterInput= $('<input>').attr('id', 'filter-input').attr('type', 'text');
const filterSlider = $('<div>').attr('id', 'filter-slider');
const hInput = $('<input>').addClass('input-value').attr('id', 'high-input').attr('type', 'text').appendTo(eq1);
const hSlider = $('<div>').attr('id', 'high-slider').appendTo(eq1);
const mInput = $('<input>').addClass('input-value').attr('id', 'mid-input').attr('type', 'text').appendTo(eq2);
const mSlider = $('<div>').attr('id', 'mid-slider').appendTo(eq2);
const lInput = $('<input>').addClass('input-value').attr('id', 'low-input').attr('type', 'text').appendTo(eq3);
const lSlider = $('<div>').attr('id', 'low-slider').appendTo(eq3);
const masterInput = $('<input>').attr('id', 'amount').attr('type', 'text');
const masterSlider = $('<div>').attr('id', 'master-gain');
const tempoInput = $('<input>').attr('id', 'tempo-input').attr('type', 'text');
const tempoSlider = $('<div>').attr('id', 'tempo-slider');
const uiButtons = $('<div>').addClass('buttons');

const playbtn = $('<div>').addClass('control-button').attr('id', 'playbtn');
const playSVG = $('.play');
const stopbtn = $('<div>').addClass('control-button').attr('id', 'stopbtn');
const stopSVG = $('.stop');
const btnHR = $('<hr>').attr('id', 'play-stop-button-divider');

const vaderbtn = $('<div>').attr('id', 'vaderbtn').appendTo(btn2);
const vaderSVG = $('<svg>').addClass('vader').attr('xmlns', 'http://www.w3.org/2000/svg').attr('viewBox', "'0 0 1475 1362'").appendTo(vaderbtn);
const vaderPath = $('<path>').attr('d', 'M1189 183c35 80 61 215 59 307-2 91-8 117 2 135 9 19 90 205 138 322 48 118 127 347 62 241-66-106-196-355-254-464-59-110-86-137-153-145-68-7-104-23-48-24 55-1 132-1 92-15-40-15-57-75-5-61 52 15 136 60 110 34-26-26-35-53-15-68 21-14 27-23 19-57-9-35-20-99-22-125-1-26-17-23-19 49-2 73-5 188-18 105-13-82-33-139-56-192-23-53-27-88-6-106 22-18 27-50-21-79-48-29-77-49-30-36 83 24 133 106 165 179zm-452 627c48 0 92 29 106 91 14 62 8 67 26 97 17 30 129 235 148 266 4 7 10 15 15 23 20 2 35 18 35 37 0 21-17 38-38 38-16 0-29-10-35-23l-257 0-257 0c-5 13-19 23-34 23-21 0-38-17-38-38 0-19 15-35 34-37 6-8 12-16 16-23 18-31 130-236 148-266 18-30 12-35 26-97 13-62 58-91 105-91zm0 505l25 0 0-138 0 0c0 0 14 2 40 17l0 121 30 0 0-101c9 6 19 14 29 23l12 9 0 69 30 0 0-43c21 17 34 28 40 33l0 10 34 0c6 0 11 0 16-1 2-9 9-18 18-22-3-8-8-18-16-30-25-38-139-218-154-237-14-19-19-33-21-61-3-27-20-84-81-84l-2 0-1 0c-61 0-79 57-81 84-3 28-7 42-22 61-14 19-129 199-154 237-7 12-13 22-15 30 9 4 15 13 18 22 4 1 10 1 16 1l33 0 0-10c7-5 20-16 40-33l0 43 31 0 0-69 11-9c11-9 20-17 29-23l0 101 31 0 0-121c25-15 39-17 40-17l0 0 0 138 24 0zm-451-1132c-35 80-61 215-59 307 2 91 8 117-2 135-10 19-90 205-139 322-48 118-127 347-61 241 65-106 195-355 254-464 59-110 86-137 153-145 67-7 104-23 48-24-56-1-133-1-92-15 40-15 56-75 4-61-52 15-135 60-109 34 26-26 34-53 14-68-20-14-27-23-18-57 9-35 19-99 21-125 2-26 17-23 19 49 2 73 5 188 19 105 13-82 32-139 55-192 23-53 27-88 6-106-21-18-27-50 21-79 48-29 77-49 30-36-83 24-132 106-164 179z')


const powerbtn = $('<div>').attr('id', 'powerbtn').appendTo(btn1);
const powerSVG = $('<svg>').addClass('power').attr('xmlns', '"http://www.w3.org/2000/svg"').attr("viewBox", "'0 0 512 512'")
    .html("<path d='M388.5 46.3C457.9 90.3 504 167.8 504 256c0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 168 54 90.3 123.5 46.3c5.8-3.7 13.5-1.8 16.9 4.2l11.8 20.9c3.1 5.5 1.4 12.5-3.9 15.9C92.8 122.9 56 185.1 56 256c0 110.5 89.5 200 200 200s200-89.5 200-200c0-70.9-36.8-133.1-92.3-168.6-5.3-3.4-7-10.4-3.9-15.9l11.8-20.9c3.3-6.1 11.1-7.9 16.9-4.3zM280 276V12c0-6.6-5.4-12-12-12h-24c-6.6 0-12 5.4-12 12v264c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12z'/>")
    .appendTo(powerbtn);


let source = null;

const LEDContainer1 = function() { 
    const powerLED1 = $('<div>').addClass('powerLED').addClass('mixer-item').prependTo(mixer);
    for(let i = 0; i < 10; i++){
        let min = (i * 10) + 1;
        let led = $('<div>').addClass('LED').addClass('inactive').data("min", min);
        led = led[0];
        $(led).appendTo(powerLED1);
        console.log('updated powerLED');
    }
}
const LEDContainer2 = function() { 
    const powerLED2 = $('<div>').addClass('powerLED').addClass('mixer-item').appendTo(mixer);
    for(let i = 0; i < 10; i++){
        let min = (i * 10) + 1;
        let led = $('<div>').addClass('LED').addClass('inactive').data("min", min);
        led = led[0];
        $(led).appendTo(powerLED2);
        console.log('updated powerLED2');
    }
}

function djSith(){    
    $(mixer).append(mixerControls);
    $(mixerControls).append(topControls, bottomControls);

    $(topControls).append(slideContainer, buttonContainer);
    $(slideContainer).append(slide1, slide2, slide3);
    $(slide1).append(visualizer);
    $(slide3).append(filterInput, filterSlider);
    $(buttonContainer).append(btn2, btn1);
    $(vaderSVG).append(vaderPath);
    $(bottomControls).append(switch1, switch2, switch3, switch4);
    $(switch1).append(eq1, eq2, eq3);
    $(switch2).append(masterInput, masterSlider);
    $(switch3).append(tempoInput, tempoSlider);
    $(switch4).append(uiButtons);
    $(uiButtons).append(playbtn, btnHR, stopbtn);

    LEDContainer1();
    LEDContainer2();
}
// creates ui master volume 'lights'
function LEDContainer(){
    const powerLED = $('<div>').addClass('powerLED mixer-item');

}
function isLEDActive(LEDs) {
    if ( powerIsOn() ) {
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
// WEB AUDIO COMPONENT SETUP---------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

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
// PLAYBACK FUNCTIONS----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

//utility function to check state
function powerIsOn(){
    console.log('fugittaboutit')
    var pwr = $(btn1).hasClass('on') ? true : false;
    return pwr;
}
//requests the audio track for the application
function loadTrack(){
    console.log('inside loadtrack');
    request = new XMLHttpRequest();
    request.open('GET', './assets/audio/gta.mp3', true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        let mp3ArrayBuffer = request.response;
        decodeArrayBuffer(mp3ArrayBuffer); 
    };
    request.send();
}
//process the buffer and prep for playback
function decodeArrayBuffer(mp3ArrayBuffer) {
    audioContext.decodeAudioData(mp3ArrayBuffer, function (decodedAudioData) {
        // Clear any existing audio source that we might be using        
        clearSource();
        // create our audio source 
        source = audioContext.createBufferSource();
        source.buffer = decodedAudioData;
        console.log(source);
        connectMixer();
    }); 
}
// creates audio grid
function connectMixer() {
    source.connect(sourceGain);
    sourceGain.connect(filter);
    filter.connect(low);
    low.connect(mid);
    mid.connect(high);
    high.connect(mainGain);
    mainGain.connect(compressorNode);
    compressorNode.connect(masterGain);
    masterGain.connect(analyserNode);
    analyserNode.connect(audioContext.destination);    
    console.log('mixer connected')
}
// starts audio source
function playTrack(){
    console.log(source);
    console.log('playing');
    source.start(0);        
    $(playSVG).toggleClass('on');
    $(vaderSVG).toggleClass('on');
    visualize(); 
}
// stops audio source
function stopPlayback(){
  if (source !== null) {
    source.stop(0);
    $(playSVG).removeClass('on');
    $(vaderSVG).removeClass('on');
    }
}
// empties audio source and disconnects from mixer
function clearSource(){
    if (source !== null) {
        source.disconnect(sourceGain);
        console.log('disconnected');
        source = null;
        $(playSVG).removeClass('on');
        $(vaderSVG).removeClass('on');
    }
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
        handleSize: "14 , 7",
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
        handleSize: "14 , 7",
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



//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//CANVAS VISUALIZERS-----------------------------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// DOCUMENT READY--------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

$(document).ready(function(){
    djSith();
    //createEffectControl(controlName, elemID, inputValueID, orientation, range, min, max, initValue, step )
    createEffectControl(masterGain, '#master-gain', '#amount', 'vertical', 'min', 0, 1, 1, 0.1);
    //createRoundSlider(name, type, property, input, sliderType, radius, width, min, max, initValue, step, stAngle, endAngle)
    createRoundSlider('#low-slider', low, '#low-input', 'min-range', 22, 11, -6, 6, 0, 0.4, 315, 225);
    createRoundSlider('#mid-slider', mid, '#mid-input', 'min-range', 22, 11, -6, 6, 0, 0.4, 315, 225);
    createRoundSlider('#high-slider', high, '#high-input', 'min-range', 22, 11, -6, 6, 0, 0.4, 315, 225);
    //createRoundSlider(name, type, property, input, sliderType, radius, width, min, max, initValue, step, stAngle, endAngle, step)
    createFilterSweep('#filter-slider', filter, '#filter-input', 'min-range', 22, 11, 0.01, 20050, 315, 90, 750);
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
    $(btn1).click(function(event) {
        console.log('clickity')
        $(this).toggleClass('on');
        let myLEDs = $('.LED');
        $(myLEDs).toggleClass('on');
        $(powerSVG).toggleClass('on');
        $(btn2).toggleClass('on');
        
        if(powerIsOn()){
            loadTrack();
            myLEDCase = $('.powerLED');
            let myOtherLEDs = myLEDCase[1].children;            
            myLEDCase = myLEDCase[0].children;
            isLEDActive(myLEDCase);
            isLEDActive(myOtherLEDs);
        } else if(!powerIsOn()){
            clearSource();
            myLEDs.removeClass('on');
            $(btn2).removeClass('on');
            $(vaderSVG).removeClass('on');
        }
    });
    // Assign event handler for when the 'Play' button is clicked
    $(playbtn).click(function(event) {
        if ( powerIsOn() ) {
            playTrack();
        } else { alert ('turn the power on dumb dumb'); }
    });
    //event handler for when the "stop button is pushed"
    $(stopbtn).click(function(event) {
        clearSource();
        loadTrack();
    });
});
