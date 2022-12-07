const vs_plane = `
precision mediump float;

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform float uTime;

void main() {

    vec3 vertexPosition = aVertexPosition;

    // get the distance between our vertex and the mouse position
    float distanceFromCenter = distance(vec2(0.0, 0.0), vec2(vertexPosition.x, vertexPosition.y));

    // calculate our wave effect
    float waveSinusoid = cos(2.0 * (distanceFromCenter - (uTime / 90.0)));

    // attenuate the effect based on mouse distance
    float distanceStrength = (0.2 / (distanceFromCenter + 0.9));

    // calculate our distortion effect
    float distortionEffect = distanceStrength * waveSinusoid * 2.0;

    // apply it to our vertex position
    vertexPosition.z +=  distortionEffect / 14.0;
    vertexPosition.x +=  (distortionEffect / 14.0 * (0.0 - vertexPosition.x)) * 1.2;
    vertexPosition.y +=  distortionEffect / 14.0 * (0.0 - vertexPosition.y);

    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    // varyings
    vTextureCoord = aTextureCoord;
    vVertexPosition = vertexPosition;
}
`
export default vs_plane