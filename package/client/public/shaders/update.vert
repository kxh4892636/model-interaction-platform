#version 300 es
precision highp float;

layout (location=0) in vec3 particleInfo;
layout (location=1) in float survivalCount;

layout (std140) uniform FlowFieldUniforms
{
    float progress;
    float segmentNum;
    float fullLife;
    float dropRate;
    float dropRateBump;
    float speedFactor;
    vec4 flowBoundary; // vec4(uMin, vMin, uMax, vMax)
};

uniform sampler2D flowField1;
uniform sampler2D mask1;
uniform sampler2D flowField2;
uniform sampler2D mask2;
uniform sampler2D validAddress;
uniform vec2 boundary;
uniform float randomSeed;

out vec3 newPosition;
out float aliveTime;

// pseudo-random generator
float rand(const vec2 co) {
    const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
    float t = dot(rand_constants.xy, co);
    return abs(fract(sin(t) * (rand_constants.z + t)));
}

float drop(float velocity, vec2 uv)
{
    vec2 seed = (particleInfo.xy + uv) * randomSeed;
    // vec2 seed = particleInfo.xy * 2.0 * randomSeed;
    float drop_rate = dropRate - velocity * dropRateBump;
    return step(drop_rate, rand(seed));
}

vec2 decode_speed_from_(vec4 color)
{
    return vec2(color.r + color.g / 255.0, color.b + color.a / 255.0);
}

vec2 get_last_speed(vec2 uv)
{
    vec2 resolution = vec2(textureSize(flowField1, 0));
    ivec2 texcoords = ivec2(uv * resolution);
    vec2 f = fract(uv * resolution);

    vec4 color_tl = texelFetch(flowField1, texcoords, 0);
    vec4 color_tr = texelFetch(flowField1, texcoords + ivec2(1, 0), 0);
    vec4 color_bl = texelFetch(flowField1, texcoords + ivec2(0, 1), 0);
    vec4 color_br = texelFetch(flowField1, texcoords + ivec2(1, 1), 0);

    vec2 speed_tl = decode_speed_from_(color_tl);
    vec2 speed_tr = decode_speed_from_(color_tr);
    vec2 speed_bl = decode_speed_from_(color_bl);
    vec2 speed_br = decode_speed_from_(color_br);

    return mix(mix(speed_tl, speed_tr, f.x), mix(speed_bl, speed_br, f.x), f.y);
}

vec2 get_next_speed(vec2 uv)
{
    vec2 resolution = vec2(textureSize(flowField2, 0));
    ivec2 texcoords = ivec2(uv * resolution);
    vec2 f = fract(uv * resolution);

    vec4 color_tl = texelFetch(flowField2, texcoords, 0);
    vec4 color_tr = texelFetch(flowField2, texcoords + ivec2(1, 0), 0);
    vec4 color_bl = texelFetch(flowField2, texcoords + ivec2(0, 1), 0);
    vec4 color_br = texelFetch(flowField2, texcoords + ivec2(1, 1), 0);

    vec2 speed_tl = decode_speed_from_(color_tl);
    vec2 speed_tr = decode_speed_from_(color_tr);
    vec2 speed_bl = decode_speed_from_(color_bl);
    vec2 speed_br = decode_speed_from_(color_br);

    return mix(mix(speed_tl, speed_tr, f.x), mix(speed_bl, speed_br, f.x), f.y);
}

vec2 lookup_speed(vec2 uv)
{
    vec2 lSpeed = get_last_speed(uv);
    vec2 nSpeed = get_next_speed(uv);
    vec2 speed = mix(lSpeed, nSpeed, progress);
    return mix(flowBoundary.xy, flowBoundary.zw, speed);
}

float is_in_flow(vec2 uv)
{
    return step(0.0, 2.0 * mix(texture(mask1, uv).r, texture(mask2, uv).r, progress) - 1.0);
}

float speed_rate(vec2 speed)
{
    return length(speed) / length(flowBoundary.zw);
}

void simulation()
{
    float needFreeze = step(segmentNum + 1.0, survivalCount);

    vec2 uv = particleInfo.xy;
    vec2 speed = lookup_speed(uv);
    float speedRate = speed_rate(speed);

    vec2 nPos = vec2(particleInfo.xy + speed * speedFactor / boundary);
    nPos = clamp(nPos, vec2(0.0), vec2(1.0));
    float dropped = drop(speedRate, uv) * is_in_flow(nPos);

    newPosition = mix(particleInfo, vec3(nPos, speedRate), dropped * needFreeze);
    aliveTime = mix(survivalCount - 1.0, mix(segmentNum, survivalCount - 1.0, dropped), needFreeze);
}

void die()
{
    vec2 seed = randomSeed + particleInfo.xy;

    vec2 uv = vec2(rand(seed + 1.3), rand(seed + 2.1));
    vec2 size = vec2(textureSize(flowField1, 0));
    vec4 rebirthColor = texture(validAddress, uv);
    float rebirth_x = float((int(rebirthColor.r * 255.0) << 8) + int(rebirthColor.g * 255.0));
    float rebirth_y = float((int(rebirthColor.b * 255.0) << 8) + int(rebirthColor.a * 255.0));
    float rand_x = rand(seed + rebirth_x / size.x);
    float rand_y = rand(seed + rebirth_y / size.y);

    vec2 rebirthPos = vec2(rebirth_x + rand_x, rebirth_y + rand_y) / size;


    newPosition = vec3(rebirthPos, speed_rate(lookup_speed(rebirthPos)));
    aliveTime = survivalCount - 1.0;
}

void rebirth()
{
    float needFreeze = step(-segmentNum + 1.0, survivalCount);

    newPosition = particleInfo;
    aliveTime = mix(fullLife, survivalCount - 1.0, needFreeze);
}

void main()
{
    if (survivalCount > 0.0)
    {
        simulation();
    }
    else if (survivalCount == 0.0)
    {
        die();
    }
    else
    {
        rebirth();
    }
}