import { MovingEntity, GameEntity, Vector3 } from 'yuka';

const startPosition = new Vector3();
const endPosition = new Vector3();

class Player extends MovingEntity {
  constructor() {
    super();

    this.boundingRadius = 0.2;
    this.maxSpeed = 4;
    this.height = 1;

    this.head = new GameEntity();
    this.add(this.head);

    this.updateOrientation = false;
    this.navMesh = null;
    this.currentRegion = null;
  }

  update(delta) {
    startPosition.copy(this.position);

    super.update(delta);

    endPosition.copy(this.position);

    // ensure the entity stays inside its navmesh
    // if (this.navMesh) {
      this.currentRegion = this.navMesh.clampMovement(this.currentRegion, startPosition, endPosition, this.position);
    // }

    // adjust height of player according to the ground

    const distance = this.currentRegion.distanceToPoint(this.position);

    this.position.y -= distance * 0.2; // smooth transition
  }
}

export { Player };
