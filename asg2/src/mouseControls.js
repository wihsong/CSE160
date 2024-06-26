function addMouseControl(canvas, renderCallback) {
    let lastX = -1;
    let lastY = -1;
    let isDragging = false;
    let dragSpeed = 0.5;

    canvas.onmousedown = function(ev) {
        const {x, y} = getMousePos(canvas, ev);
        isDragging = true;
        lastX = x;
        lastY = y;
    };

    canvas.onmousemove = function(ev) {
        if (isDragging) {
            const {x, y} = getMousePos(canvas, ev);
            let deltaX = x - lastX;
            let deltaY = y - lastY;
            g_globalAngleY -= deltaX * dragSpeed;
            g_globalAngleX -= deltaY * dragSpeed;

            renderCallback();
            lastX = x;
            lastY = y;
        }
    };

    canvas.onmouseup = function() {
        isDragging = false;
    };

    canvas.onmouseleave = function() {
        isDragging = false;
    };
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
