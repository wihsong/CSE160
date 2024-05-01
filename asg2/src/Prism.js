// Credit to https://people.ucsc.edu/~adion/Andre_Dion_Assignment_2/asg2.html
class Prism {
    constructor() {
        this.type = 'prism';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }
    
    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        drawTriangle3D( [0.0,0.0,0.0,   1.0,0.0,0.0,   0.5,0.5,0.0]);
        drawTriangle3D( [0.0,0.0,0.0,   0.5,0.0,0.5,   0.5,0.5,0.0]);
        drawTriangle3D( [0.5,0.0,0.5,   1.0,0.0,0.0,   0.5,0.5,0.0]);
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        drawTriangle3D( [0.0,0.0,0.0,   0.5,0.0,0.5,   1.0,0.0,0.0]);
    }
}