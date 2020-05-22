import * as YUKA from 'yuka';

export class TeleportTrigger extends YUKA.Trigger {
  constructor(triggerRegion, outMesh) {
    super(triggerRegion);
    this.outMesh = outMesh;
  }

  execute(entity) {
    super.execute();
    entity.position.copy(this.outMesh.position);
  }
}
