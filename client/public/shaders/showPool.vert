#version 300 es

layout (location=0) in vec2 aPos;

out vec2 texcoords;

vec2[4] rectangle = vec2[] (
    vec2(1.0, -1.0), vec2(-1.0, -1.0), vec2(1.0, 1.0), vec2(-1.0, 1.0)
);
vec2[4] uv = vec2[] (
    vec2(1.0, 0.0), vec2(0.0, 0.0), vec2(1.0, 1.0), vec2(0.0, 1.0)
);

uniform vec2 viewport;

void main()
{
    gl_Position = vec4(rectangle[gl_VertexID % 4], 0.0, 1.0);
    texcoords = uv[gl_VertexID % 4];
}