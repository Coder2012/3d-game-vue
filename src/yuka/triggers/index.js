import * as YUKA from 'yuka';
import { TeleportTrigger } from './TeleportTrigger';
import { CollectableTrigger } from './CollectableTrigger';

export const createTeleport = (inTeleport, outTeleport) => {
  const triggerRegion = new YUKA.RectangularTriggerRegion(inTeleport.scale);
  const trigger = new TeleportTrigger(triggerRegion, outTeleport);

  trigger.position.copy(inTeleport.position);
  inTeleport.visible = false;
  return trigger;
};

export const createCollectable = mesh => {
  const triggerRegion = new YUKA.RectangularTriggerRegion(mesh.scale);
  const trigger = new CollectableTrigger(triggerRegion, mesh);
  trigger.position.set(mesh.position.x, 0.1, mesh.position.z);

  return trigger;
};
