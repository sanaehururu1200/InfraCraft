import { world, } from "@minecraft/server";
export class BlockEntity {
    constructor(typeId) {
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
            let entities = event.block.dimension.getEntitiesAtBlockLocation(event.block.location);
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
    GlobalTick() { }
}

//# sourceMappingURL=../../_custom_block_behavior_packDebug/BlockEntity.js.map
