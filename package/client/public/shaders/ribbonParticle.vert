#version 300 es
precision highp float;

layout (location = 0) in float isAlive;

layout (std140) uniform FlowFieldUniforms
{
    float progress;
    float segmentNum;
    float fullLife;
    float dropRate;
    float dropRateBump;
    float speedFactor;
    vec4 flowBoundary;
};

uniform sampler2D particlePool;
uniform int blockNum;
uniform int beginBlock;
uniform int blockSize;
uniform float fillWidth;
uniform float aaWidth;
uniform vec2 viewport;
uniform vec4 bbox;
uniform mat4 u_matrix;
// uniform float progress;
// uniform float segmentNum;
// uniform vec4 flowBoundary;

out struct Stream_line_setting 
{
    float edgeParam;
    float alphaDegree;
    float isDiscarded;
    float velocity; // a percentage
} sls;


vec2 ReCoordinate(vec2 pos) {
    vec2 res_xy;
    res_xy.x = bbox.x + (bbox.z - bbox.x) * pos.x;
    res_xy.y = bbox.y + (bbox.w - bbox.y) * (1.0 - pos.y);
    vec4 res = u_matrix * vec4(res_xy, 0.0, 1.0);
    res = res / res.w;
    
    return res.xy;
}

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
    // return vec2(float(beginBlock + gl_VertexID) * 0.1, 0.5 * viewport.y);
    return ReCoordinate(pos);
    return pos;
}

vec2 get_screen_position(ivec2 uv)
{
    return transfer_to_screen_space(texelFetch(particlePool, uv, 0).rg);
}

vec2 get_vector(vec2 beginVertex, vec2 endVertex)
{
    return normalize(endVertex - beginVertex);
}

void main()
{
    // get screen positions from particle pool
    int currentVertex = gl_VertexID / 2;
    int nextVertex = currentVertex + 1;
    ivec2 c_uv = get_uv(currentVertex);
    ivec2 n_uv = get_uv(nextVertex);
    vec2 cv_pos = get_screen_position(c_uv);
    vec2 nv_pos = get_screen_position(n_uv);

    // calculate the screen offset
    float lineWidth = (fillWidth + aaWidth * 2.0);
    vec2 v_cn = get_vector(cv_pos, nv_pos);
    float screenOffset = lineWidth / 2.0;

    // translate current vertex position
    vec3 view = vec3(0.0, 0.0, 1.0);
    vec2 v_offset = normalize(cross(view, vec3(v_cn, 0.0))).xy * mix(1.0, -1.0, float(gl_VertexID % 2));
    vec2 vertexPos = cv_pos + v_offset * screenOffset / viewport;

    //////////////
    // calculate vertex position in screen coordinates
    // vec2 screenPos = vertexPos * 2.0 - 1.0;
    vec2 screenPos = vertexPos;
    gl_Position = vec4(screenPos, 0.0, 1.0);

    // vec2 t = vec2(-1.0, 1.0);
    // gl_Position = vec4(t[gl_VertexID % 2], t[gl_VertexID % 2], 0.0, 1.0);

    // prepare for anti-aliasing
    float edgeDegree[2] = float[](
        -1.0, 1.0
    );
    sls.edgeParam = edgeDegree[gl_VertexID % 2];

    float segmentRate = float(currentVertex) / segmentNum;
    sls.alphaDegree = 1.0 - sin(segmentRate);

    sls.velocity = texelFetch(particlePool, c_uv, 0).b;
    sls.isDiscarded = isAlive;
}