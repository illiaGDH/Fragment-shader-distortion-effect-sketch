uniform sampler2D grayImg;
uniform sampler2D colorImg;
uniform sampler2D depthMap;

uniform float dispProg;
uniform float rPr;
uniform float gPr;
uniform float bPr;
uniform float rDsp;
uniform float gDsp;
uniform float bDsp;

varying vec2 vUv;

void main(){
  vec4 displacement = texture2D(depthMap, vUv.xy);

  vec2 displacedUv = vec2(
    vUv.x,
    vUv.y
  );
  displacedUv.y = mix(vUv.y, displacement.r, dispProg);


  vec4 color = texture2D(colorImg, displacedUv);
  color.r = texture2D(colorImg, displacedUv + vec2(0.0, 2.0*rPr)*dispProg * rDsp).r;
  color.g = texture2D(colorImg, displacedUv + vec2(0.0, 2.0*gPr)*dispProg * gDsp).g;
  color.b = texture2D(colorImg, displacedUv + vec2(0.0, 2.0*bPr)*dispProg * bDsp).b;

  gl_FragColor = color;
}