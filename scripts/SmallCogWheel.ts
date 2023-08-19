import { world, Vector, Entity, Vector3 } from "@minecraft/server";
import { RotatableBlockEntity } from "./RotatableBlockEntity";

export class SmallCogWheel extends RotatableBlockEntity {
  RPM: number;
  Stress: number;
  static typeId: string = "infracraft:small_cog_wheel";
  constructor() {
    super("infracraft:small_cog_wheel");
    this.RPM = 0;
    this.Stress = 0;
  }

  Tick(): void {
    let entities: Entity[] = world.getDimension("overworld").getEntities();
    entities.forEach((entity) => {
      if (entity != null) {
        if (entity.typeId.toString() == "infracraft:small_cog_wheel") {
          let sides: Vector[] = [
            new Vector(entity.location.x, entity.location.y, entity.location.z + 1),
            new Vector(entity.location.x, entity.location.y, entity.location.z - 1),
            new Vector(entity.location.x + 1, entity.location.y, entity.location.z),
            new Vector(entity.location.x - 1, entity.location.y, entity.location.z),
          ];
          var sideRPMArray: number[] = [];
          sides.forEach((side) => {
            var max = 0;
            var count: number = 0;
            world
              .getDimension("overworld")
              .getEntitiesAtBlockLocation(side)
              .forEach((sideEntity) => {
                try {
                  world.getAllPlayers().forEach((player) => player.sendMessage("count:" + count.toString()));
                  count++;
                  var sideRPM: string | number | boolean | Vector3 = sideEntity.getDynamicProperty("rpm") ?? 0;
                  if (typeof sideRPM === "string") {
                    sideRPM = parseInt(sideRPM);
                  }
                  if (typeof sideRPM === "number") {
                    sideRPMArray.push(sideRPM);
                    world.getAllPlayers().forEach((player) => player.sendMessage("side:" + sideRPM.toString()));
                  } else {
                    sideRPMArray.push(0);
                    sideRPM = 0;
                    world.getAllPlayers().forEach((player) => player.sendMessage("zero"));
                  }
                  if (max < sideRPM) {
                    max = sideRPM;
                    world.getAllPlayers().forEach((player) => player.sendMessage("max set to " + max.toString()));
                  }
                } catch (e: any) {
                  world.getAllPlayers().forEach((player) => player.sendMessage(e.toString()));
                }
              });
            this.RPM = -max;
            //if (this.RPM >= 1)
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

          world
            .getDimension("overworld")
            .getEntitiesAtBlockLocation(new Vector(entity.location.x, entity.location.y + 1, entity.location.z))
            .forEach((topEntity) => {
              try {
                var topRPM: string | number | boolean | Vector3 = topEntity.getDynamicProperty("rpm") ?? 0;
                if (typeof topRPM === "string") {
                  topRPM = parseInt(topRPM);
                }
                if (typeof topRPM === "number") {
                  if (topRPM != 0) {
                    this.RPM = topRPM;
                    if (this.RPM != 0) {
                      entity.setDynamicProperty("rpm", this.RPM);
                      entity.teleport(
                        { x: entity.location.x, y: entity.location.y, z: entity.location.z },
                        {
                          rotation: { x: 0, y: entity.getRotation().y + this.RPM * 18 },
                        }
                      );
                      world.getAllPlayers().forEach((player) => player.sendMessage("top:" + topRPM.toString()));
                    }
                  }
                } else {
                  world.getAllPlayers().forEach((player) => player.sendMessage("top:zero"));
                }
              } catch (e: any) {
                world.getAllPlayers().forEach((player) => player.sendMessage(e.toString()));
              }
            });
        }
      }
    });
  }

  New(): SmallCogWheel {
    return new SmallCogWheel();
  }
}
