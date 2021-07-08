import { Scene as e, OrthographicCamera as t, WebGLRenderer as n, TextureLoader as i, LinearFilter as o, VideoTexture as a, ShaderMaterial as r, Vector4 as s, PlaneBufferGeometry as f, Mesh as l } from "three";
import d from "gsap/TweenMax";
export default function (v) {
    function u() {
        for (var e = arguments, t = 0; t < arguments.length; t++) if (void 0 !== e[t]) return e[t];
    }
    console.log("%c Hover effect by Robin Delaporte: https://github.com/robin-dela/hover-effect ", "color: #bada55; font-size: 0.8rem");
    var m = v.parent,
        p = v.displacementImage,
        c = v.image1,
        g = v.image2,
        h = u(v.imagesRatio, 1),
        y = u(v.intensity1, v.intensity, 1),
        x = u(v.intensity2, v.intensity, 1),
        F = u(v.angle, Math.PI / 4),
        w = u(v.angle1, F),
        H = u(v.angle2, 3 * -F),
        W = u(v.speedIn, v.speed, 1.6),
        E = u(v.speedOut, v.speed, 1.2),
        P = u(v.hover, !0),
        U = u(v.easing, Expo.easeOut),
        C = u(v.video, !1);
    if (m)
        if (c && g && p) {
            var D = new e(),
                L = new t(m.offsetWidth / -2, m.offsetWidth / 2, m.offsetHeight / 2, m.offsetHeight / -2, 1, 1e3);
            L.position.z = 1;
            var M = new n({ antialias: !1, alpha: !0 });
            M.setPixelRatio(2), M.setClearColor(16777215, 0), M.setSize(m.offsetWidth, m.offsetHeight), m.appendChild(M.domElement);
            var R = function () {
                    M.render(D, L);
                },
                V = new i();
            V.crossOrigin = "";
            var _,
                z,
                b = V.load(p, R);
            if (((b.magFilter = b.minFilter = o), C)) {
                var O = function () {
                    requestAnimationFrame(O), M.render(D, L);
                };
                O(), ((C = document.createElement("video")).autoplay = !0), (C.loop = !0), (C.src = c), C.load();
                var S = document.createElement("video");
                (S.autoplay = !0), (S.loop = !0), (S.src = g), S.load();
                var I = new a(C),
                    j = new a(S);
                (I.magFilter = j.magFilter = o),
                    (I.minFilter = j.minFilter = o),
                    S.addEventListener(
                        "loadeddata",
                        function () {
                            S.play(), ((j = new a(S)).magFilter = o), (j.minFilter = o), (A.uniforms.texture2.value = j);
                        },
                        !1
                    ),
                    C.addEventListener(
                        "loadeddata",
                        function () {
                            C.play(), ((I = new a(C)).magFilter = o), (I.minFilter = o), (A.uniforms.texture1.value = I);
                        },
                        !1
                    );
            } else (I = V.load(c, R)), (j = V.load(g, R)), (I.magFilter = j.magFilter = o), (I.minFilter = j.minFilter = o);
            var q = h;
            m.offsetHeight / m.offsetWidth < q ? ((_ = 1), (z = m.offsetHeight / m.offsetWidth / q)) : ((_ = (m.offsetWidth / m.offsetHeight) * q), (z = 1));
            var A = new r({
                    uniforms: {
                        intensity1: { type: "f", value: y },
                        intensity2: { type: "f", value: x },
                        dispFactor: { type: "f", value: 0 },
                        angle1: { type: "f", value: w },
                        angle2: { type: "f", value: H },
                        texture1: { type: "t", value: I },
                        texture2: { type: "t", value: j },
                        disp: { type: "t", value: b },
                        res: { type: "vec4", value: new s(m.offsetWidth, m.offsetHeight, _, z) },
                        dpr: { type: "f", value: window.devicePixelRatio },
                    },
                    vertexShader: "\nvarying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n",
                    fragmentShader:
                        "\nvarying vec2 vUv;\n\nuniform float dispFactor;\nuniform float dpr;\nuniform sampler2D disp;\n\nuniform sampler2D texture1;\nuniform sampler2D texture2;\nuniform float angle1;\nuniform float angle2;\nuniform float intensity1;\nuniform float intensity2;\nuniform vec4 res;\nuniform vec2 parent;\n\nmat2 getRotM(float angle) {\n  float s = sin(angle);\n  float c = cos(angle);\n  return mat2(c, -s, s, c);\n}\n\nvoid main() {\n  vec4 disp = texture2D(disp, vUv);\n  vec2 dispVec = vec2(disp.r, disp.g);\n\n  vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy) ;\n  vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);\n\n\n  vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;\n  vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);\n  vec4 _texture1 = texture2D(texture1, distortedPosition1);\n  vec4 _texture2 = texture2D(texture2, distortedPosition2);\n  gl_FragColor = mix(_texture1, _texture2, dispFactor);\n}\n",
                    transparent: !0,
                    opacity: 1,
                }),
                T = new f(m.offsetWidth, m.offsetHeight, 1),
                k = new l(T, A);
            D.add(k),
                P && (m.addEventListener("mouseenter", B), m.addEventListener("touchstart", B), m.addEventListener("mouseleave", G), m.addEventListener("touchend", G)),
                window.addEventListener("resize", function (e) {
                    m.offsetHeight / m.offsetWidth < q ? ((_ = 1), (z = m.offsetHeight / m.offsetWidth / q)) : ((_ = (m.offsetWidth / m.offsetHeight) * q), (z = 1)),
                        (k.material.uniforms.res.value = new s(m.offsetWidth, m.offsetHeight, _, z)),
                        M.setSize(m.offsetWidth, m.offsetHeight),
                        R();
                }),
                (this.next = B),
                (this.previous = G);
        } else console.warn("One or more images are missing");
    else console.warn("Parent missing");
    function B() {
        d.to(A.uniforms.dispFactor, W, { value: 1, ease: U, onUpdate: R, onComplete: R });
    }
    function G() {
        d.to(A.uniforms.dispFactor, E, { value: 0, ease: U, onUpdate: R, onComplete: R });
    }
}
