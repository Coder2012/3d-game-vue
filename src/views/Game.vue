<template>
  <div id="container">
    <Inventory/>
  </div>

</template>
<script>
import * as THREE from 'three';
import * as YUKA from 'yuka';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { onMounted } from '@vue/composition-api';

import { Player } from '@/yuka/Player';
import { createConvexRegionHelper } from '@/yuka/NavMeshHelper';
import { FirstPersonControls } from '@/yuka/FirstPersonControls';
import { createTeleport, createCollectable } from '@/yuka/triggers';

import Inventory from '@/views/components/Inventory';

export default {
  name: 'Game',
  components: { Inventory },
  setup() {
    let camera, scene, renderer, helper;

    // yuka
    let controls, entityManager, time;

    const init = () => {
      const container = document.getElementById('container');

      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, 200);
      camera.matrixAutoUpdate = false;
      // camera.position.set(0, 0, 0);

      scene = new THREE.Scene();

      const color = 0xffffff;
      const intensity = 0.8;
      const light = new THREE.SpotLight(color, intensity);
      light.power = 40;
      light.decay = 2;
      light.distance = Infinity;
      light.position.set(0, 30, 0);
      scene.add(light);

      helper = new THREE.SpotLightHelper(light, 0.1);
      scene.add(helper);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.gammaOutput = true;
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      entityManager = new YUKA.EntityManager();
      time = new YUKA.Time();

      const player = new Player();
      player.head.setRenderComponent(camera, sync);
      player.position.set(0, 0.75, 0);

      controls = new FirstPersonControls(player);
      controls.lookSpeed = 2;
      controls.setRotation(-2.2, 0.2);

      entityManager.add(player);

      const loadingManager = new THREE.LoadingManager(() => {
        const navMeshLoader = new YUKA.NavMeshLoader();
        navMeshLoader.load('/models/navmesh.glb', { epsilonCoplanarTest: 0.25 }).then(navMesh => {
          player.navMesh = navMesh;

          const navMeshGroup = createConvexRegionHelper(navMesh);
          // navMeshGroup.rotation.x = THREE.Math.degToRad(-90);
          navMeshGroup.position.y = -0.01;
          scene.add(navMeshGroup);

          animate();
        });
      });

      const modelLoader = new GLTFLoader(loadingManager);
      modelLoader.load('/models/room.glb', function(gltf) {
        scene.add(gltf.scene);
        // console.log(gltf.scene);
        // const teleportIn = gltf.scene.children.find(
        //   ({ userData }) => userData.type === 'teleport' && userData.direction === 'in'
        // );

        // const teleportOut = gltf.scene.children.find(
        //   ({ userData }) => userData.type === 'teleport' && userData.direction === 'out'
        // );

        // gltf.scene.traverse(object => {
        //   if (object.userData.type === 'collectable') {
        //     console.log(object);
        //     entityManager.add(createCollectable(object));
        //   }
        // });

        // teleportOut.position.y = 0.1;
        // entityManager.add(createTeleport(teleportIn, teleportOut));
      });

      document.querySelector('#container').addEventListener('click', () => {
        controls.connect();
      });
    };

    const animate = () => {
      try {
        const delta = time.update().getDelta();
        controls.update(delta);
        entityManager.update(delta);
        helper.update();
        requestAnimationFrame(animate);
      } catch (err) {
        console.log('error: ', err);
      }

      renderer.render(scene, camera);
    };

    const sync = (entity, renderComponent) => {
      renderComponent.matrixWorld.copy(entity.worldMatrix);
    };
    const sync2 = (entity, renderComponent) => {
      renderComponent.matrix.copy(entity.worldMatrix);
    };

    onMounted(() => {
      init();
    });
  },
};
</script>
<style lang="scss" scoped>
html,
body {
  margin: 0;
  padding: 0;
}
#container {
  width: 100vw;
  height: 100vh;
}
</style>
