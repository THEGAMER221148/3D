import { Position2D, Position3D } from "./render.js";
import { keysDown } from "./controller.js";

class Camera {

    constructor(position, yRotation, verticalDistortion){
        this.pos = position;
        this.ry = yRotation;
        this.vd = verticalDistortion;
    }

    basicMove(){
        this.pos.z += keysDown.w? 10: keysDown.s? -10 : 0;
        this.pos.x += keysDown.d? 10: keysDown.a? -10 : 0;
        this.pos.y += keysDown.e? 10: keysDown.q? -10 : 0;
        this.ry += keysDown.arrowleft? 0.025 : keysDown.arrowright? -0.025 : 0;
        this.vd += keysDown.arrowup? Math.PI/60 : keysDown.arrowdown? -Math.PI/60 : 0;
    }
}

export { Camera };