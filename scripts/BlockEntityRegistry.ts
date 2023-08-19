import { BlockEntity } from "./BlockEntity";
import { world, Vector } from "@minecraft/server";
import { BlockEntityManager } from "./BlockEntityManager";

export class BlockEntityRegistry {
  static instance = new BlockEntityRegistry();
  static RegistryField: BlockEntity[];

  constructor() {
    BlockEntityRegistry.RegistryField = [];
    world.afterEvents.blockPlace.subscribe((event) => {
      BlockEntityRegistry.RegistryField.forEach((RegisterdBlockEntity) => {
        if (event.block.typeId == RegisterdBlockEntity.typeId) {
          let blockEntity: BlockEntity = RegisterdBlockEntity.New();
          var temp = event.block.location;
          temp.x += 0.5;
          temp.z += 0.5;
          blockEntity.block = event.block;
          blockEntity.entity = event.block.dimension.spawnEntity(blockEntity.typeId, temp);
          BlockEntityManager.Register(blockEntity);
        }
      });
    });
  }

  static Register(blockEntity: BlockEntity): void {
    this.RegistryField.push(blockEntity);
  }

  static Unregister(blockEntity: BlockEntity): void {
    this.RegistryField.splice(this.RegistryField.indexOf(blockEntity), 1);
  }

  Get(typeId: string): any {
    return BlockEntityRegistry.RegistryField.find((blockEntity) => blockEntity.typeId == typeId);
  }
}
