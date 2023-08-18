import { world, } from "@minecraft/server";
import { BlockEntity } from "./BlockEntity";
export class HandCrank extends BlockEntity {
    constructor() {
        super("infracraft:handcrank");
        this.Count = 0;
        this.RPM = 0;
        this.Stress = 0;
        world.afterEvents.itemUse.subscribe((event) => {
            let block = event.source.getBlockFromViewDirection()?.block;
            if (block == null) {
                return;
            }
            let entities = event.source.dimension.getEntitiesAtBlockLocation(block?.location);
            if (entities == null) {
                return;
            }
            entities.forEach((entity) => {
                if (entity.typeId.toString() == this.typeId) {
                    this.RPM = 2;
                    this.Count = 1;
                    world.getAllPlayers().forEach((player) => player.sendMessage("Clicked!"));
                    entity.setDynamicProperty("rpm", this.RPM);
                }
            });
        });
    }
    GlobalTick() {
        let entities = world.getDimension("overworld").getEntities();
        entities.forEach((entity) => {
            if (entity != null) {
                if (entity.typeId.toString() == "infracraft:handcrank") {
                    if (this.Count > 2) {
                        let nowRPM = entity.getDynamicProperty("rpm");
                        if (typeof nowRPM === "string") {
                            nowRPM = parseInt(nowRPM);
                        }
                        if (typeof nowRPM === "number") {
                            this.RPM = nowRPM;
                            if (this.RPM > 0) {
                                entity.setDynamicProperty("rpm", this.RPM - 1);
                            }
                            else {
                                this.Count = 0;
                            }
                        }
                        else {
                            entity.setDynamicProperty("rpm", 0);
                        }
                    }
                    else if (this.Count >= 1) {
                        this.Count++;
                        entity.setDynamicProperty("rpm", this.RPM);
                        entity.teleport({ x: entity.location.x, y: entity.location.y, z: entity.location.z }, {
                            rotation: { x: 0, y: entity.getRotation().y + this.RPM * 18 },
                        });
                        world.playSound("block.scaffolding.climb", entity.location);
                    }
                }
            }
        });
    }
}

//# sourceMappingURL=../../_custom_block_behavior_packDebug/HandCrank.js.map
