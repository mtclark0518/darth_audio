var playButton = $('#playbtn');

var powerButton = $('#cnv1-container');
var powerSVG = $('.power');
var input = $('#audioFile');
var muteButton = $('#mutebtn');
var stopButton = $('#stopbtn');
var audioContext = new (window.AudioContext || window.webKitAudioContext)(); // Our audio context
var source = null; // This is the BufferSource containing the buffered audio
var powerLED;




// the 'outgoing' signal
var masterGain = audioContext.createGain();
//compressing sound for quality
var compressorNode = audioContext.createDynamicsCompressor();
//analyzes audio context
var analyserNode = audioContext.createAnalyser();
var sourceGain = audioContext.createGain();
var mainGain = audioContext.createGain();


// creating the equalizer filters
var low = audioContext.createBiquadFilter();
low.type = "lowshelf";
low.frequency.value = 500.0;
low.gain.value = 0.0;

var mid = audioContext.createBiquadFilter();
mid.type = "peaking";
mid.frequency.value = 1000.0;
mid.Q.value = 0.61;
mid.gain.value = 0.0;

var high = audioContext.createBiquadFilter();
high.type = "highshelf";
high.frequency.value = 2000.0;
high.gain.value = 0.0;

var filter = audioContext.createBiquadFilter();
filter.type = "lowpass";
filter.Q.value = 0.71;    


function powerIsOn(){
    console.log('fugittaboutit')
    var pwr = $(powerButton).hasClass('on') ? true : false;
    console.log(pwr)
    return pwr;
}

function initPlayEvent(){
    var fileInput = input[0];
        console.log(fileInput[0]); 
        if (fileInput.files.length > 0 && ["audio/mpeg", "audio/mp3"].includes(fileInput.files[0].type)) {
            // object that has downloaded an MP3 file from the internet, or any other ArrayBuffer containing MP3 data. 
            createArrayBuffer(fileInput.files[0], function (mp3ArrayBuffer) {
                // Pass the ArrayBuffer to the decode method
                decodeArrayBuffer(mp3ArrayBuffer);              
            });  
        } else {
            alert("Error! No attached file or attached file was of the wrong type!");
        }
}

// Used the File API in order to asynchronously obtain the bytes of the file that the user selected in the 
// file input box. The bytes are returned using a callback method that passes the resulting ArrayBuffer. 
function createArrayBuffer(selectedFile, callback) {
    var reader = new FileReader(); 
    reader.onload = function (event) {
        // The FileReader returns us the bytes from the computer's file system as an ArrayBuffer  
        var mp3ArrayBuffer = reader.result; 
        callback(mp3ArrayBuffer); 
    };
    reader.readAsArrayBuffer(selectedFile);
}

function decodeArrayBuffer(mp3ArrayBuffer) {
    audioContext.decodeAudioData(mp3ArrayBuffer, function (decodedAudioData) {
              
        // Clear any existing audio source that we might be using
        if (source !== null) {
            source.disconnect(sourceGain);
            source = null; 
        } 
        source = audioContext.createBufferSource();
        source.buffer = decodedAudioData;
        
        connectMixer();
    }); 
}

// web audio component connections to make an audio grid
function connectMixer(){
    triggerVisuals();
    source.connect(sourceGain).connect(filter).connect(low).connect(mid).connect(high).connect(mainGain).connect(compressorNode).connect(masterGain).connect(analyserNode).connect(audioContext.destination);
    // tell the audio buffer to play from the beginning
    source.start(0);
    
}

function stopPlayback(){
  if (source !== null) {
    source.disconnect(sourceGain);
    console.log('disconnected');
    source = null;
  }
}

function toggleMute(){

  // masterGain.gain.value = 0;
  console.log('toggleMute bitch');
}
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
function createFilterSweep(name, type, input, sliderType, radius, width, min, max, initValue, stAngle, endAngle, step){
    $(name).roundSlider({
        sliderType: sliderType,
        radius: radius,
        width: width,
        min: min,
        max: max,
        step: step,
        value: initValue,
        startAngle: stAngle,
        endAngle: endAngle,
        mouseScrollAction: true,
        change: function(event){
            let eq = $(name).data('roundSlider');
            type.frequency.value = eq.option('value');
        }
    });
}
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


//-------------------------------------------
//-------------------------------------------
//CANVAS VISUALIZERS
//-------------------------------------------
//-------------------------------------------
var canvas = $('#visualizer')[0];
console.log(canvas);
var canvasContext = canvas.getContext("2d");

//create our mixer
function visualize() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    console.log('height = ' +  HEIGHT);
    console.log('width = ' +  WIDTH);
    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    analyserNode.fftSize =128;
    var bufferLength = analyserNode.frequencyBinCount;
    console.log(analyserNode.fftSize);
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    console.log(dataArray);
    

    function draw() {
        drawVisual = requestAnimationFrame(draw);
        analyserNode.getByteTimeDomainData(dataArray);
        // analyserNode.getByteFrequencyData(dataArray);
        // console.log(analyserNode.getByteFrequencyData(dataArray));
        canvasContext.fillStyle = 'rgb(0, 0, 0)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = 'rgb(255,0,0)';
        canvasContext.beginPath();
        const sliceWidth = WIDTH * 1.0 / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] /128.0;
            let y = v * HEIGHT / 2;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }
            x += sliceWidth;
        }

        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();
    }
    draw();
}

function triggerVisuals(){
    visualize();
}

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
    createFilterSweep('#filter-slider', filter, '#filter-input', 'min-range', 24, 12, 10, 20050, 20050, 315, 90, 500);

    // create tempo slide from the source playbackRate

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

    $(powerButton).click(function(event) {
        $(this).toggleClass('on');
        $(powerSVG).toggleClass('on');
        if(powerIsOn()){
            let myLEDs = $('.powerLED');
            let myOtherLEDs = myLEDs[1].children;            
            myLEDs = myLEDs[0].children;
            isLEDActive(myLEDs);
            isLEDActive(myOtherLEDs);

        } else if(!powerIsOn()){
            let myLEDs = $('.powerLED');
            myLEDs.removeClass('active');
        }
    })


    // Assign event handler for when the 'Play' button is clicked
    $(playButton).click(function(event) {
        event.stopPropagation();
        if(powerIsOn()){
            initPlayEvent();
        } else {
            alert('turn the power on dumb dumb')
        }
    });

    // mute function to store value and set new value;
    $(muteButton).click(function(event) {
        // event.preventDefault();
        // toggleMute();
     });

    //event handler for when the "stop button is pushed"
    $(stopButton).click(function(event) {
        stopPlayback();
    });

});
