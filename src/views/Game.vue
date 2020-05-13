<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted } from '@vue/composition-api';

export default {
  name: 'Game',
  setup() {
    let camera, scene, renderer, controls, helper;

    const init = () => {
      const container = document.getElementById('container');

      camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10);
      camera.position.set(0, 2, 0);

      scene = new THREE.Scene();

      const loader = new GLTFLoader();
      loader.load('/models/room.glb', function(gltf) {
        console.log(gltf.scene.children);
        scene.add(gltf.scene);
      });

      const color = 0xffffff;
      const intensity = .8;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 2, 0);
      scene.add(light);

      helper = new THREE.PointLightHelper(light, 0.1);
      scene.add(helper);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.update();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      helper.update();

      renderer.render(scene, camera);
    };

    onMounted(() => {
      init();
      animate();
    });
  },
};
</script>
<style lang="scss" scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>
