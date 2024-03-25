#version 300 es
precision highp float;
in float _uvEdgeParam;
in float _ualphaDegree;
uniform float _ulineWidth;
uniform float _uaaWidth;
out vec4 _ufragColor;
float _ugetAlpha(in float _uparam){
  float _ufillBorder = (_ulineWidth / (_ulineWidth + (2.0 * _uaaWidth)));
  float _ualpha = (1.0 - ((_uparam - _ufillBorder) / (1.0 - _ufillBorder)));
  return mix(1.0, _ualpha, step(_ufillBorder, _uparam));
}
void main(){
  (_ufragColor = vec4(0.0, 0.0, 0.0, 0.0));
  float _ualpha = (_ugetAlpha(abs(_uvEdgeParam)) * _ualphaDegree);
  (_ufragColor = vec4(1.0, 1.0, 1.0, _ualpha));
  (_ufragColor = vec4(1.0, 1.0, 1.0, 1.0));
}
