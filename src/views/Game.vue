<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from 'three';
import * as YUKA from 'yuka';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { onMounted } from '@vue/composition-api';

import { Player } from '@/yuka/Player.js';
import { createConvexRegionHelper } from '@/yuka/NavMeshHelper.js';
import { FirstPersonControls } from '@/yuka/FirstPersonControls.js';

export default {
  name: 'Game',
  setup() {
    let camera, scene, renderer, helper;

    // yuka
    let controls, entityManager, time;

    const init = () => {
      const container = document.getElementById('container');

      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, 10);
      camera.matrixAutoUpdate = false;
      camera.position.set(0, 2, 0);

      scene = new THREE.Scene();

      const color = 0xffffff;
      const intensity = 0.8;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 2, 0);
      scene.add(light);

      helper = new THREE.PointLightHelper(light, 0.1);
      scene.add(helper);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.gammaOutput = true;
      container.appendChild(renderer.domElement);

      entityManager = new YUKA.EntityManager();
      time = new YUKA.Time();

      const player = new Player();
      player.head.setRenderComponent(camera, sync);
      player.position.set(0, 1.4, 0);

      controls = new FirstPersonControls(player);
      controls.lookSpeed = 4;
      controls.setRotation(-2.2, 0.2);

      entityManager.add(player);

      const loadingManager = new THREE.LoadingManager(() => {
        const navMeshLoader = new YUKA.NavMeshLoader();
        navMeshLoader.load('./models/navmesh.glb', { epsilonCoplanarTest: 0.25 }).then(navMesh => {
          player.navMesh = navMesh;

          const navMeshGroup = createConvexRegionHelper(navMesh);
          navMeshGroup.rotation.x = THREE.MathUtils.degToRad(90);
          navMeshGroup.position.y = 0;
          scene.add(navMeshGroup);

          controls.connect();
          animate();
        });
      });
      
      const modelLoader = new GLTFLoader(loadingManager);
      modelLoader.load('/models/room.glb', function(gltf) {
        scene.add(gltf.scene);
        // gltf.scene.traverse(object => {
        //   object.matrixAutoUpdate = false;
        //   object.updateMatrix();

        //   if (object.isMesh) object.material.alphaTest = 0.5;
        // });
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = time.update().getDelta();
      // controls.update(time);
      entityManager.update(delta);
      helper.update();

      renderer.render(scene, camera);
    };

    const sync = (entity, renderComponent) => {
      renderComponent.matrixWorld.copy(entity.worldMatrix);
    };

    onMounted(() => {
      init();
    });
  },
};
</script>
<style lang="scss" scoped>
html, body {
  margin: 0;
  padding: 0;
}
#container {
  width: 100vw;
  height: 100vh;
}
</style>
