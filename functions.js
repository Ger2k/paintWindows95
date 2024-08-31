// CONSTANTS
const MODES = {
    DRAW: 'draw',
    ERASE: 'erase',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    PICKER: 'picker',
    TUNNEL: 'tunnel'
};

// UTILITIES
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// ELEMENTS
const $canvas = $('#canvas');
const $colorPicker = $('#color-picker');
const ctx = $canvas.getContext('2d');
const $clearBtn = $('#clear-btn');
const $drawBtn = $('#draw-btn');
const $rectangleBtn = $('#rectangle-btn');
const $ellipseBtn = $('#ellipse-btn');
const $pickerBtn = $('#picker-btn');
const $eraseBtn = $('#erase-btn');
const $lineWidth = $('#line-width');
const $tunnelBtn = $('#tunnel-btn');
const $downloadBtn = $('#download-btn');

// STATE
let isDrawing = false;
let startX, startY;
let lastX = 0;
let lastY = 0;
let mode = MODES.DRAW;
let imageData

// EVENTS

// Mouse events
$canvas.addEventListener('mousedown', startDrawing);
$canvas.addEventListener('mousemove', draw);
$canvas.addEventListener('mouseup', stopDrawing);
$canvas.addEventListener('mouseleave', stopDrawing);

// Touch events
$canvas.addEventListener('touchstart', startDrawing);
$canvas.addEventListener('touchmove', draw);
$canvas.addEventListener('touchend', stopDrawing);

$colorPicker.addEventListener('change', handleChangeColor);
$clearBtn.addEventListener('click', clearCanvas);
$rectangleBtn.addEventListener('click', () => {
    setMode(MODES.RECTANGLE);
});
$drawBtn.addEventListener('click', () => {
    setMode(MODES.DRAW);
});
$ellipseBtn.addEventListener('click', () => {
    setMode(MODES.ELLIPSE);
});
$pickerBtn.addEventListener('click', () => {
    setMode(MODES.PICKER);
});
$eraseBtn.addEventListener('click', () => {
    setMode(MODES.ERASE);
});
$lineWidth.addEventListener('change', () => {
    ctx.lineWidth = $lineWidth.value;
});
$tunnelBtn.addEventListener('click', (e) => {
    console.log(e)
    if(e.target.value = "on"){
        setMode(MODES.TUNNEL);
    }else{
        setMode(MODES.DRAW);
    }
});
$downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'mi-dibujo.jpg';
    link.href = $canvas.toDataURL('image/jpeg', 0.92);
    link.click();
});



// METHODS

function getEventCoords(e) {
    if (e.touches) {
        // Si es un evento táctil, tomar la primera posición de toque
        const touch = e.touches[0];
        return { offsetX: touch.clientX - $canvas.offsetLeft, offsetY: touch.clientY - $canvas.offsetTop };
    } else {
        // Si es un evento de mouse
        return { offsetX: e.offsetX, offsetY: e.offsetY };
    }
}

function startDrawing(e) {
    e.preventDefault();  // Prevenir comportamiento predeterminado (como desplazamiento en móvil)
    isDrawing = true;
    const { offsetX, offsetY } = getEventCoords(e);

    // Guardar las coords iniciales
    [startX, startY] = [offsetX, offsetY];
    [lastX, lastY] = [offsetX, offsetY];

    imageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);
}

function draw(e) {
    e.preventDefault();  // Prevenir comportamiento predeterminado (como desplazamiento en móvil)
    if (!isDrawing) return;

    const { offsetX, offsetY } = getEventCoords(e);

    if(mode === MODES.DRAW || mode === MODES.ERASE) {

        // Comenzar el trazo
        ctx.beginPath();
    
        // Mover el trazo a las coordenadas actuales
        ctx.moveTo(lastX, lastY);
    
        // Dibujar una línea hasta las coordenadas actuales
        ctx.lineTo(offsetX, offsetY);
    
        ctx.stroke();
    
        // Actualizar las coordenadas finales
        [lastX, lastY] = [offsetX, offsetY];
        return;
    }


    if(mode === MODES.TUNNEL) {
        const width = offsetX - startX;
        const height = offsetY - startY;
        ctx.lineWidth = 1;
        $lineWidth.value = 1;

        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.stroke();
        return;
    }

    if(mode === MODES.RECTANGLE) {
        ctx.putImageData(imageData, 0, 0);

        const width = offsetX - startX;
        const height = offsetY - startY;

        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.stroke();
        return;
    }

    if (mode === MODES.ELLIPSE) {
        ctx.putImageData(imageData, 0, 0);
    
        const width = offsetX - startX;
        const height = offsetY - startY;
    
        ctx.beginPath();
        ctx.ellipse(startX + width / 2, startY + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, Math.PI * 2);
        ctx.stroke();
        return;
    }
    
    
}

//INIT 
setMode(MODES.DRAW);

function stopDrawing(e) {
    isDrawing = false;
}

function handleChangeColor(e) {
    const { value } = $colorPicker;
    ctx.strokeStyle = value;
}

function clearCanvas() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function setMode(newMode) {
    mode = newMode;
    $('button.active')?.classList.remove('active');

    if (mode === MODES.DRAW) {
        $drawBtn.classList.add('active');
        $canvas.style.cursor = 'crosshair';
        console.log("Modo: " + mode);
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 2;
        $lineWidth.value = 2;
        return;
    }
    if (mode === MODES.RECTANGLE) {
        $rectangleBtn.classList.add('active');
        console.log("Modo: " + mode);
        canvas.style.cursor = 'nw-resize';
        ctx.lineWidth = 2;
        $lineWidth.value = 2;
        ctx.globalCompositeOperation = 'source-over';
        return;
    }
    if (mode === MODES.ELLIPSE) {
        $ellipseBtn.classList.add('active');
        console.log("Modo: " + mode);
        ctx.globalCompositeOperation = 'source-over';
        return;
    }
    if (mode === MODES.PICKER) {
        $pickerBtn.classList.add('active');
        console.log("Modo: " + mode);
        ctx.globalCompositeOperation = 'source-over';
        return;
    }
    if (mode === MODES.ERASE) {
        $eraseBtn.classList.add('active');
        console.log("Modo: " + mode);
        canvas.style.cursor = 'url("./09-paint-win-95/cursors/erase.png") 0 24, auto';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 10;
        $lineWidth.value = 10;
        return;
    }
    if(mode === MODES.TUNNEL){
        $tunnelBtn.classList.add('active');
        console.log("Modo: " + mode);
        ctx.globalCompositeOperation = 'source-over';
        return;
    }
}


