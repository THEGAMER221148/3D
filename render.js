import { Camera } from "./camera.js";
import { currentCamera } from "./controller.js";

const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

class Color {

    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha == undefined? 0 : alpha;
    }

    toStyleString(){
        return this.originalStyleString == undefined? this.alpha == 0? `rgb(${this.red}, ${this.green}, ${this.blue})` : `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})` : this.originalStyleString;
    }

    fromStyleString(styleString){
        let split = styleString.split(",");
        return new Color(Number(split[0].split("(")[1]), Number(split[1]), isNaN(Number(split[2]))? Number(split[2].split(")")[0]) : Number(split[2]), isNaN(Number(split[3].split(")")[0]))? 0 : Number(split[3].split(")")[0]));
    }
}

class Position2D {

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

}

class Position3D {

    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    castTo2D(){
        let xDiff = this.x-currentCamera.pos.x;
        let yDiff = this.y-currentCamera.pos.y;
        let zDiff = this.z-currentCamera.pos.z;
        let focalLength = window.innerWidth/2;
        let focalHeight = window.innerHeight/2;
        return new Position2D(focalLength + (xDiff*currentCamera.yCos - zDiff*currentCamera.ySin) / (yDiff*currentCamera.xSin + (xDiff*currentCamera.ySin + zDiff*currentCamera.yCos)*currentCamera.xCos) * focalLength, focalHeight - ((yDiff*currentCamera.xCos) - (xDiff*currentCamera.ySin + zDiff*currentCamera.yCos)*currentCamera.xSin) / (yDiff*currentCamera.xSin + (xDiff*currentCamera.ySin + zDiff*currentCamera.yCos)*currentCamera.xCos) * focalLength);
    }

    distanceFrom(position){
        return Math.sqrt(Math.pow(position.x-this.x, 2) + Math.pow(position.y-this.y, 2) + Math.pow(position.z-this.z, 2));
    }

    plus(position){
        return new Position3D(this.x+position.x, this.y+position.y, this.z+position.z);
    }

    minus(position){
        return new Position3D(this.x-position.x, this.y-position.y, this.z-position.z);
    }

    multiply(position){
        return typeof position == Number? new Position3D(this.x*position, this.y*position, this.z*position) : new Position3D(this.x*position.x, this.y*position.y, this.z*position.z);
    }

    divide(position){
        return typeof position == Number? new Position3D(this.x/position, this.y/position, this.z/position) : new Position3D(this.x/position.x, this.y/position.y, this.z/position.z);
    }

}

class Triangle {

    constructor(pos1, pos2, pos3, color) {
        this.v1 = pos1;
        this.v2 = pos2;
        this.v3 = pos3;
        this.col = color;
        this.center = new Position3D((pos1.x + pos2.x + pos3.x) / 3, (pos1.y + pos2.y + pos3.y) / 3, (pos1.z + pos2.z + pos3.z) / 3);
    }

    render(){
        ctx.beginPath();
        ctx.moveTo(this.v1.castTo2D().x, this.v1.castTo2D().y);
        ctx.lineTo(this.v2.castTo2D().x, this.v2.castTo2D().y);
        ctx.lineTo(this.v3.castTo2D().x, this.v3.castTo2D().y);
        ctx.closePath();
        ctx.fillStyle = this.col.toStyleString();
        ctx.fill();
        //ctx.fillStyle = 'white';
        //ctx.fillRect(this.center.castTo2D().x, this.center.castTo2D().y, 10, 10);
    }

    findClosestVertexTo(position){
        let dist = renderTools.sortArray([this.v1.distanceFrom(position), this.v2.distanceFrom(position), this.v3.distanceFrom(position)])[0];
        return dist == this.v1.distanceFrom(position)? this.v1 : dist == this.v2.distanceFrom(position)? this.v2 : this.v3;
    }

}

let screenCenter;

let triangles = [
    new Triangle(new Position3D(0, 0, 0), new Position3D(100, 0, 0), new Position3D(100, 100, 0), new Color(0, 0, 255)),
    new Triangle(new Position3D(0, 0, 0), new Position3D(0, 100, 0), new Position3D(100, 100, 0), new Color(0, 0, 128)),
    new Triangle(new Position3D(0, 100, 0), new Position3D(100, 100, 0), new Position3D(100, 100, 100), new Color(0, 255, 0)),
    new Triangle(new Position3D(0, 100, 0), new Position3D(0, 100, 100), new Position3D(100, 100, 100), new Color(0, 128, 0)),
    new Triangle(new Position3D(0, 0, 0), new Position3D(0, 0, 100), new Position3D(0, 100, 100), new Color(255, 0, 0)),
    new Triangle(new Position3D(0, 0, 0), new Position3D(0, 100, 0), new Position3D(0, 100, 100), new Color(128, 0, 0)),

    new Triangle(new Position3D(0, 0, 100), new Position3D(100, 0, 100), new Position3D(100, 100, 100), new Color(255, 255, 0)),
    new Triangle(new Position3D(0, 0, 100), new Position3D(0, 100, 100), new Position3D(100, 100, 100), new Color(128, 128, 0)),
    new Triangle(new Position3D(0, 0, 0), new Position3D(100, 0, 0), new Position3D(100, 0, 100), new Color(255, 0, 255)),
    new Triangle(new Position3D(0, 0, 0), new Position3D(0, 0, 100), new Position3D(100, 0, 100), new Color(128, 0, 128)),
    new Triangle(new Position3D(100, 0, 0), new Position3D(100, 0, 100), new Position3D(100, 100, 100), new Color(0, 255, 255)),
    new Triangle(new Position3D(100, 0, 0), new Position3D(100, 100, 0), new Position3D(100, 100, 100), new Color(0, 128, 128)),
];

const renderTools = {
    cnvs: canvas,
    context: ctx,

    initialize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        screenCenter = new Position2D(window.innerWidth/2, window.innerHeight/2);
    },

    drawPoint(pos){
        ctx.fillStyle = new Color(0, 0, 255).toStyleString();
        ctx.fillRect(pos.x - currentCamera.pos.x - 10, pos.y - currentCamera.pos.y - 10, pos.x - currentCamera.pos.x + 10, pos.y - currentCamera.pos.y + 10);
    },

    sortArray(array){
        for(let i = 0; i < array.length; i++){
            let item = array[i];
            let j = i-1;
            while(j >= 0 && array[j] > array[i]){
                array[j+1] = array[j];
                j--;
            }
            array[j+1] = array[i];
        }
        return array;
    },

    sortTriangles(){
        for(let i = 0; i < triangles.length; i++){
            let j = i-1;
            let item = triangles[i]
            while(j >= 0 && triangles[j].center.distanceFrom(currentCamera.pos) > item.center.distanceFrom(currentCamera.pos) && triangles[j].center.distanceFrom(currentCamera.pos) < currentCamera.maxClippingDistance){
                triangles[j+1] = triangles[j];
                j--;
            }
            triangles[j+1] = item;
        }
    },

    renderEnvironment(){
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.sortTriangles();
        for(let i = triangles.length-1; i >= 0; i--){
            if(triangles[i].center.distanceFrom(currentCamera.pos) < currentCamera.maxClippingDistance){
                triangles[i].render();
            }
        };
    }

};

export {renderTools, canvas, Color, Position2D, Position3D, Triangle};