import { renderTools, Color, Position2D, Position3D, Triangle, canvas } from "./render.js";
import { Camera } from "./camera.js";

const keysDown = {};
let currentCamera = new Camera(new Position3D(0, 0, 0), 0, 0, 0.01, 1000);
const Mouse = {x:0, y:0, down:false, DX:0, DY:0};

window.addEventListener("keydown", (event) => {
    keysDown[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keysDown[event.key.toLowerCase()] = false;
});

renderTools.initialize();
new Triangle(new Position3D(0, 0, 0), new Position3D(100, 0, 0), new Position3D(100, 100, 0), new Color(255, 0, 0)).render();

function step(){
    currentCamera.update();
    renderTools.renderEnvironment();
    requestAnimationFrame(step);
}

window.addEventListener("mousedown", (event) => {
    Mouse.down = true;
    Mouse.x = event.clientX-window.innerWidth/2;
    Mouse.y = event.clientY-window.innerHeight/2;
    canvas.requestPointerLock().then(() => {
        requestAnimationFrame(step);
    });
});

window.addEventListener("mouseup", (event) => {
    Mouse.x = event.clientX-window.innerWidth/2;
    Mouse.y = event.clientY-window.innerHeight/2;
    Mouse.down = false;
});

window.addEventListener("mousemove", (event) => {
    Mouse.DX = event.movementX;
    Mouse.DY = event.movementY;
    currentCamera.rx -= event.movementY/100;
    currentCamera.ry -= event.movementX/100;
});

console.log(new Position3D(0, 10, 0).minus(new Position3D(100, 180, 20)));

export { keysDown, currentCamera, Mouse };
