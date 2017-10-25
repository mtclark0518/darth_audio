//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// GLOBAL VARIABLE DEFINITIONS-------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// CREATE DARTH AUDIO MIXER USER COMPONENTS-------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
const mixer = $('.mixer');
const mixerComp = $('<div>').addClass('mixerComp');

const topComp = $('<div>').addClass('topComp');
const btmComp = $('<div>').addClass('btmComp');

const slideCtr = $('<div>').addClass('slideCtr');
const btnCtr = $('<div>').addClass('btnCtr');

const slide1 = $('<div>').addClass('cnvCtn slide');
const slide2 = $('<div>').addClass('slide');
const slide3 = $('<div>').addClass('LPFCtn slide');

const btn1 = $('<div>').addClass('btn1 btn');
const btn2 = $('<div>').addClass('btn2 btn');

const switch1 = $('<div>').addClass('eqCtn switch')
const switch2 = $('<div>').addClass('mgainCtn switch');
const switch3 = $('<div>').addClass('pbrCtn switch');
const switch4 = $('<div>').addClass('pbCtn switch');

const eq1 = $('<div>').addClass('eq-knob');
const eq2 = $('<div>').addClass('eq-knob');
const eq3 = $('<div>').addClass('eq-knob');

const hInput = $('<input>').addClass('input-value').attr('id', 'high-input').attr('type', 'text')
const mInput = $('<input>').addClass('input-value').attr('id', 'mid-input').attr('type', 'text')
const lInput = $('<input>').addClass('input-value').attr('id', 'low-input').attr('type', 'text')
const masterInput = $('<input>').attr('id', 'master-input').attr('type', 'text');
const tempoInput = $('<input>').attr('id', 'tempo-input').attr('type', 'text');
const filterInput= $('<input>').attr('id', 'filter-input').attr('type', 'text');

const hSlider = $('<div>').attr('id', 'high-slider').attr('id', 'high-slider')
const mSlider = $('<div>').attr('id', 'mid-slider').attr('id', 'mid-slider')
const lSlider = $('<div>').attr('id', 'low-slider').attr('id', 'low-slider')
const masterSlider = $('<div>').attr('id', 'master-gain');
const tempoSlider = $('<div>').attr('id', 'tempo-slider');
const filterSlider = $('<div>').attr('id', 'filter-slider');

const powerbtn = $('<div>').addClass('powerbtn');
const vaderbtn = $('<div>').addClass('vaderbtn');
const playbtn = $('<div>').addClass('playbtnCtn control-button');
const stopbtn = $('<div>').addClass('stopbtnCtn control-button');

const powerSVG = $('.power');
const vaderSVG = $('.vader');
const playSVG = $('.play');
const stopSVG = $('.stop');

const pbControls = $('<div>').addClass('pbBtnCtn');
const btnHR = $('<hr>').addClass('pbHR');

// canvas element for visuals
const visualizer = $('<canvas>').addClass('visualizer');
// function that assmebles the dom elements
function djSith(){    
    $(mixer).append(mixerComp);
    $(mixerComp).append(topComp, btmComp);
    $(topComp).append(slideCtr, btnCtr);
    $(slideCtr).append(slide1, slide2, slide3);
    $(slide1).append(visualizer);
    $(slide3).append(filterInput, filterSlider);
    $('<div>').addClass('text').text('filter').appendTo(slide3);    
    $(btnCtr).append(btn2, btn1);
    $(btn1).append(powerbtn);
    $(powerbtn).append(powerSVG);
    $(btn2).append(vaderbtn);
    $(vaderbtn).append(vaderSVG);
    $(btmComp).append(switch1, switch2, switch3, switch4);
    $('<div>').addClass('text').text('eq').appendTo(switch1);
    $(switch1).append(eq1, eq2, eq3);
    $(eq1).append(hInput, hSlider);
    $(eq2).append(mInput, mSlider);
    $(eq3).append(lInput, lSlider);
    $('<div>').addClass('text').text('master').appendTo(switch2);
    $(switch2).append(masterInput, masterSlider);
    $('<div>').addClass('text').text('pbr').appendTo(switch3);
    $(switch3).append(tempoInput, tempoSlider);
    $(switch4).append(pbControls);
    $(pbControls).append(playbtn, btnHR, stopbtn);
    $(playbtn).append(playSVG);
    $(stopbtn).append(stopSVG);
    LEDContainer1();
    LEDContainer2();
}
// creates ui master volume 'lights'
const LEDContainer1 = function() { 
    let powerLED = $('<div>').addClass('powerLED').addClass('mixer-item').prependTo(mixer);
    for(let i = 0; i < 10; i++){
        let min = (i * 10) + 1;
        let led = $('<div>').addClass('LED').addClass('inactive').data("min", min);
        led = led[0];
        $(led).appendTo(powerLED);
        console.log('updated powerLED');
    }
}
const LEDContainer2 = function() { 
    powerLED = $('<div>').addClass('powerLED').addClass('mixer-item').appendTo(mixer);
    for(let i = 0; i < 10; i++){
        let min = (i * 10) + 1;
        let led = $('<div>').addClass('LED').addClass('inactive').data("min", min);
        led = led[0];
        $(led).appendTo(powerLED);
        console.log('updated powerLED');
    }
}
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// WEBAUDIO API COMPONENT SETUP---------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
// Web Audio Api Instance
const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Our audio context
//inital audio source is set to null, loads when user pressed power button
let source = null;
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
    $(vaderSVG).removeClass('loading');
}

//requests the audio track for the application
function loadTrack(){
    console.log('inside loadtrack');
    $(vaderSVG).addClass('loading');
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
// starts audio playback
function playTrack(){
    console.log('playing');
    source.start(0);        
    $(playSVG).toggleClass('on');
    $(vaderSVG).toggleClass('on');
    visualize(); 
}
// stops audio source and resets
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
function createRoundSlider(name, type, input){
    $(name).roundSlider({
        sliderType: 'min-range',
        radius: 22,
        width: 11,
        min: -12,
        max: 12,
        step: 1,        
        value: 0,
        handleSize: "14 , 7",
        startAngle: 315,
        endAngle: 225,
        mouseScrollAction: true,
        change: function(event){
            let eq = $(name).data('roundSlider');
            type.gain.value = eq.option('value');
        }
    });
}
// creates the filter knob - can be refactored into above function
function createFilterSweep(name, type, input){
    $(name).roundSlider({
        sliderType: 'min-range',
        radius: 22,
        width: 11,
        min:0,
        max: 20050.0,
        step: 1000,
        value: 20050.0,
        handleSize: "14 , 7",
        startAngle: 315,
        endAngle: 90,
        mouseScrollAction: true,
        change: function(event){
            let eq = $(name).data('roundSlider');
            type.frequency.value = eq.option('value');
        }
    });
}

// creates tempo and master volume sliders (different from above round sliders) 
function createEffectControl( elemID, controlName, inputValueID){
    $(elemID).slider({
        orientation : 'vertical',
        range : 'min',
        min : 0,
        max : 1,
        value : 1,
        step : 0.1,
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
function createTempoSlider(elemId, controlName, inputValueID ){
    $(elemId).slider({
        orientation: "vertical",
        range: "min",
        min: 0.50,
        max: 1.50,
        value: 1.00,
        step: 0.01,
        slide: function( event, ui ) {
            let input = $( inputValueID ).val(ui.value);
            let currentTempo = input[0].value
            source.playbackRate.value = currentTempo;
        }
    });
}
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//CANVAS VISUALIZATION FUNCTION----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
function visualize() {
    // canvas variable definitions
    const canvas = $(visualizer)[0];
    const canvasContext = canvas.getContext("2d");
    // visualize function adapted from web-audio-api voice-change-o-matic
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
// UTILITY FUNCTIONS----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//utility function to check 'power' state
function powerIsOn(){
    let pwr = $(btn1).hasClass('on') ? true : false;
    return pwr;
}
// utility function sets 'LED' state params and ties to power
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
// DOCUMENT READY--------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
$(document).ready(function(){
    
    djSith();
    createEffectControl('#master-gain', masterGain, '#master-input');
    createTempoSlider('#tempo-slider', source, '#tempo-input');    
    createRoundSlider('#low-slider', low, '#low-input');
    createRoundSlider('#mid-slider', mid, '#mid-input');
    createRoundSlider('#high-slider', high, '#high-input');
    createFilterSweep('#filter-slider', filter, '#filter-input');
    
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
            $('body').toggleClass('on');
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
            $('body').removeClass('on');
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
