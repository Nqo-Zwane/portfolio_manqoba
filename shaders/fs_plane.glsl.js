const fs_plane = `
#ifdef GL_ES
precision mediump float;
#endif

// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

// our texture sampler (this is the lib default name, but it could be changed)
uniform sampler2D uSampler01;

void main() {
    // get our texture coords
    vec2 textureCoords = vTextureCoord;

    // apply our texture
    vec4 finalColor = texture2D(uSampler01, textureCoords);

// uncomment this line to get a b&w version of what's happening
    // finalColor = vec4(0.3, 0.3, 0.3, 1.0);

    // fake shadows based on vertex position along Z axis
    finalColor.rgb -= clamp(-vVertexPosition.z / 5.0, 0.0, 1.0);
    // fake lights based on vertex position along Z axis
    finalColor.rgb += clamp(vVertexPosition.z / 5.0, 0.0, 1.0);

    // handling premultiplied alpha (useful if we were using a png with transparency)
    finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);

    gl_FragColor = finalColor;
}
`
export default fs_plane