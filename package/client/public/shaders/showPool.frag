#version 300 es
precision highp float;

uniform vec2 viewport;
uniform sampler2D textureBuffer;

in vec2 texcoords;

out vec4 fragColor;

void main() 
{
    vec3 color = texture(textureBuffer, texcoords).rgb;
    fragColor = vec4(color, 1.0);
}