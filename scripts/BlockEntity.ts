import { world, Vector, Block, Entity } from "@minecraft/server";

import { Tickable } from "./Tickable";

export class BlockEntity implements Tickable {
  entity: Entity | null;
  block: Block | null;
  typeId: string;
  constructor(typeId: string) {
    this.entity = null;
    this.block = null;
    this.typeId = typeId;

    world.afterEvents.blockPlace.subscribe((event) => {
      if (event.block.typeId.toString() == this.typeId) {
        event.player.sendMessage("BlockEntity Placed!");
        var temp = event.block.location;
        temp.x += 0.5;
        temp.z += 0.5;
        event.block.dimension.spawnEntity(typeId, temp);
      }
    });

    world.afterEvents.blockBreak.subscribe((event) => {
      let entities: Entity[] = event.block.dimension.getEntitiesAtBlockLocation(event.block.location);
      if (entities == null) {
        console.warn("No entities found at " + event.block.location + ", bug...?");
        return;
      }
      entities.forEach((entity) => {
        if (entity.typeId.toString() == this.typeId) {
          var temp = event.block.location;
          temp.x += 0.5;
          temp.z += 0.5;
          let distance: number = Vector.distance(entity.location, temp);
          if (distance < 0.2) {
            entity.teleport({ x: 0, y: 100000, z: 0 });
            entity.remove();
          }
        }
      });
    });
  }

  GlobalTick(): void {}
}
