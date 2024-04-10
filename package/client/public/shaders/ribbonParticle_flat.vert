#version 300 es
precision highp float;

layout (location=0) in vec2 aPos;

uniform sampler2D particlePool;
uniform int blockNum;
uniform int beginBlock;
uniform int blockSize;
uniform float fllWidth;
uniform float aaWidth;
uniform vec2 viewport;

out float vEdgeParam;

ivec2 get_uv(int vertexIndex)
{
    // calculate the blockIndex of the current vertx
    int blockIndex = (beginBlock - vertexIndex + blockNum) % blockNum;

    // calculate original uv of the block
    int textureWidth = textureSize(particlePool, 0).x;
    int columnNum = textureWidth / blockSize;
    ivec2 blockUV = ivec2(blockIndex % columnNum, blockIndex / columnNum) * blockSize;

    // calculate uv of the current vertex
    ivec2 vertexUV = blockUV + ivec2(gl_InstanceID % blockSize, gl_InstanceID / blockSize);

    return vertexUV;
}

vec2 transfer_to_screen_space(vec2 pos)
{
    // can do more
    return pos;
}

vec2 get_screen_position(int vertexIndex)
{
    ivec2 uv = get_uv(vertexIndex);
    return transfer_to_screen_space(texelFetch(particlePool, uv, 0).rg);
}

vec2 get_vector(vec2 beginVertex, vec2 endVertex)
{
    return normalize(endVertex - beginVertex);
}

void main()
{
    // get screen positions from particle pool
    int currentVertex = gl_VertexID / 2 + 1;
    int lastVertex = currentVertex - 1;
    int nextVertex = currentVertex + 1;
    vec2 lv_pos = get_screen_position(lastVertex);
    vec2 cv_pos = get_screen_position(currentVertex);
    vec2 nv_pos = get_screen_position(nextVertex);

    // calculate the screen offset
    float lineWidth = fllWidth + aaWidth * 2.0;
    vec2 v_cl = get_vector(cv_pos, lv_pos);
    vec2 v_cn = get_vector(cv_pos, nv_pos);
    float screenOffset = lineWidth / sqrt(2.0 * (1.0 - dot(v_cl, v_cn) / (length(v_cl) * length(v_cn))));

    // translate current vertex position
    vec2 v_ln_bisector = normalize(v_cl + v_cn);
    if (v_cl.x * v_cn.y == v_cl.y * v_cn.x)
    {
        v_ln_bisector = normalize(vec2(-v_cn.y, v_cn.x));
    }
    if (currentVertex == 1) v_ln_bisector = normalize(vec2(-v_cn.y, v_cn.x));
    else if (currentVertex == blockNum - 3) v_ln_bisector = normalize(vec2(-v_cl.y, v_cl.x));

    float sideTest = sign(v_ln_bisector.x * v_cn.y - v_cn.x * v_ln_bisector.y);
    v_ln_bisector = mix(-1.0, 1.0, step(0.0, sideTest)) * v_ln_bisector; // default: at the right side of v_cn

    vec2 vertexPos = cv_pos + v_ln_bisector * screenOffset * mix(1.0, -1.0, float(gl_VertexID % 2));

    //////////////
    // calculate vertex position in screen coordinates
    float borderWidth = lineWidth / 2.0;
    // vertexPos = clamp(vertexPos, vertexPos, viewport);
    // vertexPos = clamp(vertexPos, vertexPos, viewport);
    vec2 screenPos = (vertexPos / viewport) * 2.0 - 1.0;
    gl_Position = vec4(screenPos, 0.0, 1.0);

    // prepare for anti-aliasing
    float edgeDegree[2] = float[](
        -1.0, 1.0
    );
    vEdgeParam = edgeDegree[gl_VertexID % 2];
}