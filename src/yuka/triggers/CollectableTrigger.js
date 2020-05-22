import * as YUKA from 'yuka';
import { collectItem } from '@/services/player';

export class CollectableTrigger extends YUKA.Trigger {
  constructor(triggerRegion, mesh) {
    super(triggerRegion);
    this.mesh = mesh;
  }

  execute(entity) {
    super.execute();
    
    this.active = false;
    collectItem(this.mesh);
    this.mesh.parent.remove(this.mesh);
  }
}
