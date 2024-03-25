#version 300 es
precision highp float;

in struct Stream_line_setting 
{
    float edgeParam;
    float alphaDegree;
    float isDiscarded;
    float velocity; // a percentage
} sls;

uniform float fillWidth;
uniform float aaWidth;

out vec4 fragColor;

int rampColors[6] = int[](
    0xa6d96a,
    0xfc4e2a,
    0xffffbf,
    0xe31a1c,
    0xbd0026,
    0xa3001f
);

vec3 colorFromInt(int color)
{
    float b = float(color & 0xFF) / 255.0;
    float g = float((color >> 8) & 0xFF) / 255.0;
    float r = float((color >> 16) & 0xFF) / 255.0;

    return vec3(r, g, b);
}

vec3 velocityColor(float speed)
{
    float bottomIndex = floor(speed * 10.0);
    float topIndex = mix(bottomIndex + 1.0, 7.0, step(6.0, bottomIndex));
    float interval = mix(1.0, 4.0, step(6.0, bottomIndex));

    vec3 slowColor = colorFromInt(rampColors[int(bottomIndex)]);
    vec3 fastColor = colorFromInt(rampColors[int(topIndex)]);

    return mix(slowColor, fastColor, (speed * 10.0 - float(bottomIndex)) / interval);
}

float getAlpha(float param)
{
    float fillBorder = fillWidth / (fillWidth + 2.0 * aaWidth);
    float alpha = 1.0 - (param - fillBorder) / (1.0 - fillBorder);
    return mix(1.0, alpha, step(fillBorder, param));
}

void main() 
{
    if (sls.isDiscarded <= 0.0) discard;
    float alpha = getAlpha(abs(sls.edgeParam)) * sls.alphaDegree;

    // vec3 color = colorFromInt(rampColors[int(velocity * 8.0)]);
    vec3 color = velocityColor(sls.velocity);
    fragColor = vec4(color, 1.0) * alpha;
}