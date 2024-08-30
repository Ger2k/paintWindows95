//CONSTANTS
const MODES = {
    DRAW: 'draw',
    ERASE: 'erase',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    PICKER: 'picker'
};


//UTILITIES
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

//ELEMENTS
const $canvas = $('#canvas');
const $colorPicker = $('#color-picker');
const ctx = $canvas.getContext('2d');
const $clearBtn = $('#clear-btn');




//STATE

let isDrawing = false;
let startX, startY
let lastX = 0;
let lastY = 0;
let mode = MODES.DRAW;



//EVENTS

$canvas.addEventListener('mousedown', startDrawing);
$canvas.addEventListener('mousemove', draw);
$canvas.addEventListener('mouseup', stopDrawing);
$canvas.addEventListener('mouseleave', stopDrawing);


$colorPicker.addEventListener('change', handleChangeColor);
$clearBtn.addEventListener('click', clearCanvas);
    
//METHODS

function startDrawing(e) {
    isDrawing = true;
    const { offsetX, offsetY } = e;


    //guardar las coords iniciales
    [startX, startY] = [offsetX, offsetY];
    [lastX, lastY] = [offsetX, offsetY];

}

function draw(e) {
    if(!isDrawing) return        
        const { offsetX, offsetY } = e;

        // comenzar el trazo
        ctx.beginPath();

        // mover el trazo a las coordenadas actuales
        ctx.moveTo(lastX, lastY);

        //dibujar una linea hasta las coordenadas actuales
        ctx.lineTo(offsetX, offsetY);

        ctx.stroke()


        //actualizar las coordenadas finales
        ;[lastX, lastY] = [offsetX, offsetY];
    
}


function stopDrawing(e) {
    isDrawing = false;
}

function handleChangeColor(e) {
    const {value} = $colorPicker;
    ctx.strokeStyle = value;
}

function clearCanvas() {
    ctx.clearRect(0 ,0 , $canvas.width, $canvas.height);
}