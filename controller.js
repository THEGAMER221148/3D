import { renderTools, Color, Position2D, Position3D, Triangle } from "./render.js";
import { Camera } from "./camera.js";

const keysDown = {};
let currentCamera = new Camera(new Position3D(0, 0, 0), 0, 1);

window.addEventListener("keydown", (event) => {
    keysDown[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keysDown[event.key.toLowerCase()] = false;
});

renderTools.initialize();
new Triangle(new Position3D(0, 0, 0), new Position3D(100, 0, 0), new Position3D(100, 100, 0), new Color(255, 0, 0)).render();

function step(){
    renderTools.renderEnvironment();
    currentCamera.basicMove();
    requestAnimationFrame(step);
}
step();

export { keysDown, currentCamera };
