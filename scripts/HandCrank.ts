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
          entity.setDynamicProperty("rpm", 6);
          this.Count = 1;
          event.source.sendMessage("entity is rotatable!");
        }
      });
    });
  }

  GlobalTick(): void {
    world.getAllPlayers().map((player) => player.sendMessage("tick"));
    let entities: Entity[] = world.getDimension("overworld").getEntities();
    entities.forEach((entity) => {
      if (entity != null) {
        if (entity.typeId.toString() == "infracraft:handcrank") {
          world.getAllPlayers().map((player) => player.sendMessage("rpm: " + entity.getDynamicProperty("rpm")));
          if (this.Count > 10) {
            let nowRPM: any = entity.getDynamicProperty("rpm");
            if (typeof nowRPM === "string") {
              nowRPM = parseInt(nowRPM);
            }
            if (typeof nowRPM === "number") {
              if (nowRPM > 0) {
                entity.setDynamicProperty("rpm", nowRPM - 1);
              } else {
                this.Count = 0;
              }
            } else {
              entity.setDynamicProperty("rpm", 0);
            }
          } else if (this.Count >= 1) {
            this.Count++;
          }
        }
      }
    });
  }
}
