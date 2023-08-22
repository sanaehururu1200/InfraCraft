import { BlockEntity } from "./BlockEntity";
import { world, Vector, Block } from "@minecraft/server";

export class BlockEntityManager {
  static instance: BlockEntityManager = new BlockEntityManager();
  static BlockEntities: any[] = [];
  constructor() {
    world.afterEvents.itemUse.subscribe((event) => {
      BlockEntityManager.BlockEntities.forEach((blockEntity) => {
        if (typeof event.source.getBlockFromViewDirection() == "undefined" || typeof blockEntity == "undefined") return;
        if (
          Vector.distance(
            event.source.getBlockFromViewDirection()?.block.location || { x: 100000, y: 100000, z: 100000 },
            blockEntity.block?.location || { x: 100000, y: 100000, z: 100000 }
          ) <= 0.275
        ) {
          console.warn("1");
          blockEntity.OnUse(event);
        }
      });
    });

    world.afterEvents.blockBreak.subscribe((event) => {
      BlockEntityManager.BlockEntities.forEach((BlockEntity) => {
        if (typeof BlockEntity == "undefined") return;
        if (
          BlockEntity.block?.location.x == event.block.location.x &&
          BlockEntity.block?.location.z == event.block.location.z &&
          BlockEntity.block?.location.y == event.block.location.y &&
          BlockEntity.entity != null
        ) {
          BlockEntity.entity.teleport({ x: 100000, y: 100000, z: 100000 });
          BlockEntity.entity.remove();
          BlockEntityManager.Unregister(BlockEntity);
        }
      });
    });
  }

  static TickAll(): void {
    this.BlockEntities.forEach((blockEntity) => {
      if (typeof blockEntity == "undefined") {
        console.warn("TickAll: BlockEntity is undefined");
        return;
      }
      blockEntity.Tick();
    });
  }

  static Register(blockEntity: any): void {
    console.warn("BlockEntity Registered");
    this.BlockEntities.push(blockEntity);
  }

  static Unregister(blockEntity: any): void {
    console.warn("BlockEntity Unregistered");
    this.BlockEntities.splice(this.BlockEntities.indexOf(blockEntity), 1);
  }
}
