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
  Vector2,
  Vector3,
} from "@minecraft/server";

import { Rotatable } from "./Rotatable";
import { BlockEntity } from "./BlockEntity";
import { Tickable } from "./Tickable";

export class SmallCogWheel extends BlockEntity implements Rotatable, Tickable {
  RPM: number;
  Stress: number;
  constructor() {
    super("infracraft:small_cog_wheel");
    this.RPM = 0;
    this.Stress = 0;
  }

  GlobalTick(): void {
    let entities: Entity[] = world.getDimension("overworld").getEntities();
    entities.forEach((entity) => {
      if (entity != null) {
        if (entity.typeId.toString() == "infracraft:small_cog_wheel") {
          let sides: Vector[] = [
            new Vector(entity.location.x - 1, entity.location.y, entity.location.z + 1),
            new Vector(entity.location.x + 1, entity.location.y, entity.location.z - 1),
            new Vector(entity.location.x - 1, entity.location.y, entity.location.z - 1),
            new Vector(entity.location.x + 1, entity.location.y, entity.location.z + 1),
          ];
          var sideRPMArray: number[] = [];
          sides.forEach((side) => {
            var max = 0;
            world
              .getDimension("overworld")
              .getEntitiesAtBlockLocation(side)
              .forEach((sideEntity) => {
                try {
                  var sideRPM: string | number | boolean | Vector3 = sideEntity.getDynamicProperty("rpm") ?? 0;
                  if (typeof sideRPM === "string") {
                    sideRPM = parseInt(sideRPM);
                  }
                  if (typeof sideRPM === "number") {
                    sideRPMArray.push(sideRPM);
                    world.getAllPlayers().forEach((player) => player.sendMessage(sideRPM.toString()));
                  } else {
                    sideRPMArray.push(0);
                    sideRPM = 0;
                    world.getAllPlayers().forEach((player) => player.sendMessage("zero"));
                  }
                  if (max < sideRPM) max = sideRPM;
                } catch (e: any) {
                  world.getAllPlayers().forEach((player) => player.sendMessage(e.toString()));
                }
              });
            this.RPM = -max;
            entity.setDynamicProperty("rpm", this.RPM);
            entity.teleport(
              { x: entity.location.x, y: entity.location.y, z: entity.location.z },
              {
                rotation: { x: 0, y: entity.getRotation().y + this.RPM * 18 },
              }
            );
            if (this.RPM >= 1) {
              world.playSound("block.scaffolding.climb", entity.location);
            }
          });
        }
      }
    });
  }
}
