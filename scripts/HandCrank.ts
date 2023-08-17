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
import { BlockEntity } from "./BlockEntity";
import { Tickable } from "./Tickable";

export class HandCrank extends BlockEntity implements Rotatable, Tickable {
  RPM: number;
  Stress: number;
  constructor() {
    super("infracraft:handcrank");
    this.RPM = 0;
    this.Stress = 0;

    world.afterEvents.itemUse.subscribe((event) => {
      let block = event.source.getBlockFromViewDirection()?.block;
      if (block == null) {
        return;
      }

      let entities: Entity[] = world.getDimension("overworld").getEntitiesAtBlockLocation(block?.location);
      if (entities == null) {
        return;
      }

      entities.forEach((entity) => {
        if (entity.typeId.toString() == this.typeId) {
          if (entity.getDynamicProperty("rpm") != undefined) {
            entity.setDynamicProperty("rpm", 6);
            event.source.sendMessage("entity:" + entity.id + " : " + entity.getDynamicProperty("rpm"));
          } else {
            event.source.sendMessage("entity is not rotatable!");
          }
        }
      });
    });
  }

  SpawnEntity(location: Vector, dimension: Dimension): void {
    this.entity = dimension.spawnEntity(this.typeId, location);
    this.entity.setDynamicProperty("rpm", 0);
  }

  GlobalTick(): void {
    let entities: Entity[] = world.getDimension("overworld").getEntities();
    entities.forEach((entity) => {
      if (entity != null) {
        if (entity.typeId.toString() == "infracraft:handcrank") {
          let nowRPM: any = entity.getDynamicProperty("rpm");
          if (typeof nowRPM === "string") {
            nowRPM = parseInt(nowRPM);
          }
          if (typeof nowRPM === "number") {
            if (nowRPM > 0) {
              entity.setDynamicProperty("rpm", nowRPM - 1);
            }
          } else {
            entity.setDynamicProperty("rpm", 0);
          }
        }
      }
    });
    system.run(this.GlobalTick);
  }
}
