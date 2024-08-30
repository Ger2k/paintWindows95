// CONSTANTS
const MODES = {
    DRAW: 'draw',
    ERASE: 'erase',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    PICKER: 'picker'
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

// STATE
let isDrawing = false;
let startX, startY;
let lastX = 0;
let lastY = 0;
let mode = MODES.DRAW;

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
}

function draw(e) {
    e.preventDefault();  // Prevenir comportamiento predeterminado (como desplazamiento en móvil)
    if (!isDrawing) return;

    const { offsetX, offsetY } = getEventCoords(e);

    // Comenzar el trazo
    ctx.beginPath();

    // Mover el trazo a las coordenadas actuales
    ctx.moveTo(lastX, lastY);

    // Dibujar una línea hasta las coordenadas actuales
    ctx.lineTo(offsetX, offsetY);

    ctx.stroke();

    // Actualizar las coordenadas finales
    [lastX, lastY] = [offsetX, offsetY];
}

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
        return;
    }
    if (mode === MODES.RECTANGLE) {
        $rectangleBtn.classList.add('active');
        return;
    }
    if (mode === MODES.ELLIPSE) {
        $ellipseBtn.classList.add('active');
        return;
    }
    if (mode === MODES.PICKER) {
        $pickerBtn.classList.add('active');
        return;
    }
    if (mode === MODES.ERASE) {
        $eraseBtn.classList.add('active');
        return;
    }
}
