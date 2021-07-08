import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';

import { GUI } from 'dat.gui';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

import { gsap } from 'gsap/all';

export class Distortion {

  constructor() {
    this.setupScene();
    this.initSettings();
    this.addObjects();
    this.render();

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('resize', this.onResize.bind(this)); 
  }

  setupScene() { 
    this.scene = new THREE.Scene();

    this.loader = new THREE.TextureLoader();

    let width = window.innerWidth;
    let height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xbbbbbb, 1);

    this.canvasContainer = document.getElementById('distortion');
    this.canvasContainer.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      width / height,
      1,
      1000
    );

    this.cameraDistance = 10;
    this.camera.position.set(0, 0, this.cameraDistance);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  initSettings() {
    this.gui = new GUI();

    this.settings = {
      displacementProgress: 0,
      colorPropoptions: {
        r_prop: 0.005,
        g_prop: 0.01,
        b_prop: 0.02
      },
      colorDisplacements: {
        r_disp: 1,
        g_disp: 0.3,
        b_disp: 1.6
      },
      animationDuration: .8
    }

    this.gui.add(this.settings, 'displacementProgress', 0, 1, 0.01);
    this.gui.add(this.settings.colorPropoptions, 'r_prop', 0, 1, 0.01);
    this.gui.add(this.settings.colorPropoptions, 'g_prop', 0, 1, 0.01);
    this.gui.add(this.settings.colorPropoptions, 'b_prop', 0, 1, 0.01);
    this.gui.add(this.settings.colorDisplacements, 'r_disp', 0, 10, 0.1);
    this.gui.add(this.settings.colorDisplacements, 'g_disp', 0, 10, 0.1);
    this.gui.add(this.settings.colorDisplacements, 'b_disp', 0, 10, 0.1);
    this.gui.add(this.settings, 'animationDuration', 0, 10, 0.1);
  }

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(15, 12, 80, 80);
    this.material = new THREE.ShaderMaterial(
      {
        extensions: {
          derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
        uniforms: {
          grayImg: { type: "t", value: this.loader.load('./img/PH_Side.jpg')},
          colorImg: { type: "t", value: this.loader.load('./img/PH_Side_color.jpg')},
          depthMap: { type: "t", value: this.loader.load('./img/displacementMap.jpg')},
          dispProg: { type: "f" , value: this.settings.displacementProgress },
          rPr: { type: "f", value: this.settings.colorPropoptions.r_prop },
          gPr: { type: "f", value: this.settings.colorPropoptions.g_prop },
          bPr: { type: "f", value: this.settings.colorPropoptions.b_prop },
          rDsp: { type: "f", value: this.settings.colorDisplacements.r_disp },
          gDsp: { type: "f", value: this.settings.colorDisplacements.g_disp },
          bDsp: { type: "f", value: this.settings.colorDisplacements.b_disp }
        },
        fragmentShader: fragment,
        vertexShader: vertex
      }
    );

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);

    this.hovered = {};
  }

  onMouseMove(event) {
    // normalizing mouse coords
    // max left to max right as -1 to 1
    // max top to max bottom as 1 to -1

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  }

  onResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.controls.update();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    let intersected = this.raycaster.intersectObjects(this.scene.children);

    if(intersected.length > 0) {
      this.applyDistortion(this.material.uniforms['dispProg'], this.settings.displacementProgress);
      this.applyDistortion(this.material.uniforms['rPr'], this.settings.colorPropoptions.r_prop);
      this.applyDistortion(this.material.uniforms['gPr'], this.settings.colorPropoptions.g_prop);
      this.applyDistortion(this.material.uniforms['bPr'], this.settings.colorPropoptions.b_prop);
      this.applyDistortion(this.material.uniforms['rDsp'], this.settings.colorDisplacements.r_disp);
      this.applyDistortion(this.material.uniforms['gDsp'], this.settings.colorDisplacements.g_disp);
      this.applyDistortion(this.material.uniforms['bDsp'], this.settings.colorDisplacements.b_disp);
    } else {
      this.clearDistortion(this.material.uniforms['dispProg']);
      this.clearDistortion(this.material.uniforms['rPr']);
      this.clearDistortion(this.material.uniforms['gPr']);
      this.clearDistortion(this.material.uniforms['bPr']);
      this.clearDistortion(this.material.uniforms['rDsp']);
      this.clearDistortion(this.material.uniforms['gDsp']);
      this.clearDistortion(this.material.uniforms['bDsp']);
    }

    this.renderer.render(this.scene, this.camera);
  }

  applyDistortion(prop, intensity) {
    gsap.to(
      prop, {
        value: intensity,
        ease: 'Power0.easeIn',
        duration: this.settings.animationDuration
      }
    )
  }

  clearDistortion(prop) {
    gsap.to(
      prop, {
        value: 0,
        ease: 'Power0.easeOut',
        duration: this.settings.animationDuration
      }
    )
  }
}