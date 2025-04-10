import { Position2D, Position3D } from "./render.js";
import { keysDown, Mouse } from "./controller.js";

class Camera {

    constructor(position, yRotation, xRotation, flyspeed, maxClippingDistance){
        this.pos = position;
        this.ry = yRotation;
        this.rx = xRotation;
        this.flySpeed = flyspeed;
        this.maxClippingDistance = maxClippingDistance;
    }

    update(){

        //this.ry += Mouse.DX/100; //keysDown.arrowleft? 0.025 : keysDown.arrowright? -0.025 : 0;
        //this.rx -= Mouse.DY/100; //keysDown.arrowup? 0.025 : keysDown.arrowdown? -0.025 : 0;

        this.xCos = Math.cos(this.rx);
        this.xSin = Math.sin(this.rx);
        this.yCos = Math.cos(this.ry);
        this.ySin = Math.sin(this.ry);

        this.pos.z += keysDown.w? this.yCos*this.flySpeed: keysDown.s? -this.yCos*this.flySpeed : keysDown.a? -this.ySin*this.flySpeed: keysDown.d? this.ySin*this.flySpeed: 0;
        this.pos.x += keysDown.w? this.ySin*this.flySpeed: keysDown.s? -this.ySin*this.flySpeed : keysDown.a? this.yCos*this.flySpeed: keysDown.d? -this.yCos*this.flySpeed: 0;
        this.pos.y += keysDown.e? 10: keysDown.q? -10 : 0;//keysDown.w? this.xCos*this.flySpeed : keysDown.s? -this.xCos*this.flySpeed : 0;
    }
}

export { Camera };