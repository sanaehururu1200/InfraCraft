import {
  world,
  system,
  Vector,
  Block,
  BlockPermutation,
  Player,
  Entity,
  DynamicPropertiesDefinition,
  Dimension,
} from "@minecraft/server";

import { Rotatable } from "./Rotatable";
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
        event.block.dimension.spawnEntity(typeId, event.block.location);
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
          entity.kill();
        }
      });
    });
  }

  GlobalTick(): void {}
}
