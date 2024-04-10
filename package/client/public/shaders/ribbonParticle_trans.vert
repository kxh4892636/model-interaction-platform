#version 300 es
precision highp float;
layout(location = 0) in vec2 _uaPos;
uniform sampler2D _uparticlePool;
uniform int _ublockNum;
uniform int _ubeginBlock;
uniform int _ublockSize;
uniform float _ufllWidth;
uniform float _uaaWidth;
uniform vec2 _uviewport;
out float _uvEdgeParam;
out float _ualphaDegree;
ivec2 _uget_uv(in int _uvertexIndex){
  int _ublockIndex = (((_ubeginBlock - _uvertexIndex) + _ublockNum) % _ublockNum);
  int _utextureWidth = textureSize(_uparticlePool, 0).x;
  int _ucolumnNum = (_utextureWidth / _ublockSize);
  ivec2 _ublockUV = (ivec2((_ublockIndex % _ucolumnNum), (_ublockIndex / _ucolumnNum)) * _ublockSize);
  ivec2 _uvertexUV = (_ublockUV + ivec2((gl_InstanceID % _ublockSize), (gl_InstanceID / _ublockSize)));
  return _uvertexUV;
}
vec2 _utransfer_to_screen_space(in vec2 _upos){
  return _upos;
}
vec2 _uget_screen_position(in int _uvertexIndex){
  ivec2 _uuv = _uget_uv(_uvertexIndex);
  return _utransfer_to_screen_space(texelFetch(_uparticlePool, _uuv, 0).xy);
}
vec2 _uget_vector(in vec2 _ubeginVertex, in vec2 _uendVertex){
  return normalize((_uendVertex - _ubeginVertex));
}
void main(){
  (gl_Position = vec4(0.0, 0.0, 0.0, 0.0));
  (_ualphaDegree = 0.0);
  (_uvEdgeParam = 0.0);
  int _ucurrentVertex = (gl_VertexID / 2);
  int _unextVertex = (_ucurrentVertex + 1);
  vec2 _ucv_pos = _uget_screen_position(_ucurrentVertex);
  vec2 _unv_pos = _uget_screen_position(_unextVertex);
  float _ulineWidth = (_ufllWidth + (_uaaWidth * 2.0));
  vec2 _uv_cn = _uget_vector(_ucv_pos, _unv_pos);
  float _uscreenOffset = _ulineWidth;
  vec2 _uv_offset = normalize(vec2((-_uv_cn.y), _uv_cn.x));
  float _usideTest = sign(((_uv_offset.x * _uv_cn.y) - (_uv_cn.x * _uv_offset.y)));
  (_uv_offset = (mix(-1.0, 1.0, step(0.0, _usideTest)) * _uv_offset));
  vec2 _uvertexPos = (_ucv_pos + ((_uv_offset * _uscreenOffset) * mix(1.0, -1.0, float((gl_VertexID % 2)))));
  vec2 _uscreenPos = (((_uvertexPos / _uviewport) * 2.0) - 1.0);
  (gl_Position = vec4(_uscreenPos, 0.0, 1.0));
  float _uedgeDegree[2] = float[2](-1.0, 1.0);
  (_uvEdgeParam = _uedgeDegree[int(clamp(float((gl_VertexID % 2)), 0.0, 1.0))]);
  float _uprogress = (float(_ucurrentVertex) / float(_ublockNum));
  (_ualphaDegree = (1.0 - _uprogress));
}