import { BlockEntity } from "./BlockEntity";
import { world, Vector } from "@minecraft/server";

export class BlockEntityManager {
  static instance: BlockEntityManager = new BlockEntityManager();
  static BlockEntities: BlockEntity[] = [];
  constructor() {
    world.afterEvents.itemUse.subscribe((event) => {
      BlockEntityManager.BlockEntities.forEach((blockEntity) => {
        if (
          Vector.distance(
            event.source.getBlockFromViewDirection()?.block.location || { x: 100000, y: 100000, z: 100000 },
            blockEntity.block?.location || { x: 100000, y: 100000, z: 100000 }
          ) <= 0.275
        ) {
          blockEntity.OnUse(event);
        }
      });
    });

    world.afterEvents.blockBreak.subscribe((event) => {
      console.warn(BlockEntityManager.BlockEntities.length);
      BlockEntityManager.BlockEntities.forEach((BlockEntity) => {
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
      blockEntity.Tick();
    });
  }

  static Register(blockEntity: BlockEntity): void {
    console.warn("BlockEntity Registered");
    this.BlockEntities.push(blockEntity);
  }

  static Unregister(blockEntity: BlockEntity): void {
    console.warn("BlockEntity Unregistered");
    this.BlockEntities.splice(this.BlockEntities.indexOf(blockEntity), 1);
  }
}
