#version 300 es

layout (location=0) in vec2 aPos;

uniform vec2 viewport;

void main()
{
    vec2 pos = fract(aPos / viewport) * 2.0 - 1.0;
    gl_Position = vec4(pos, 0.0, 1.0);
}