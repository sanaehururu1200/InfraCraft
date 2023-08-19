import { world, Entity } from "@minecraft/server";

import { Rotatable } from "./Rotatable";
import { BlockEntity } from "./BlockEntity";
import { Tickable } from "./Tickable";

export class HandCrank extends BlockEntity implements Rotatable, Tickable {
  RPM: number;
  Stress: number;
  Count: number = 0;
  constructor() {
    super("infracraft:handcrank");
    this.RPM = 0;
    this.Stress = 0;

    world.afterEvents.itemUse.subscribe((event) => {
      let block = event.source.getBlockFromViewDirection()?.block;
      if (block == null) {
        return;
      }

      let entities: Entity[] = event.source.dimension.getEntitiesAtBlockLocation(block?.location);
      if (entities == null) {
        return;
      }

      entities.forEach((entity) => {
        if (entity.typeId.toString() == this.typeId) {
          this.RPM = 2;
          this.Count = 1;
          entity.setDynamicProperty("rpm", this.RPM);
        }
      });
    });
  }

  GlobalTick(): void {
    let entities: Entity[] = world.getDimension("overworld").getEntities();
    entities.forEach((entity) => {
      if (entity != null) {
        if (entity.typeId.toString() == "infracraft:handcrank") {
          if (this.Count > 2) {
            let nowRPM: any = entity.getDynamicProperty("rpm");

            if (typeof nowRPM === "string") {
              nowRPM = parseInt(nowRPM);
            }
            if (typeof nowRPM === "number") {
              this.RPM = nowRPM;
              if (this.RPM > 0) {
                entity.setDynamicProperty("rpm", this.RPM - 1);
              } else {
                this.Count = 0;
              }
            } else {
              entity.setDynamicProperty("rpm", 0);
            }
          } else if (this.Count >= 1) {
            this.Count++;
            entity.setDynamicProperty("rpm", this.RPM);
            entity.teleport(
              { x: entity.location.x, y: entity.location.y, z: entity.location.z },
              {
                rotation: { x: 0, y: entity.getRotation().y + this.RPM * 18 },
              }
            );
            world.playSound("block.scaffolding.climb", entity.location);
          }
        }
      }
    });
  }
}
