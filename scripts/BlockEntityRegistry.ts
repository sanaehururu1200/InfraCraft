import { BlockEntity } from "./BlockEntity";
import { world, Vector } from "@minecraft/server";
import { BlockEntityManager } from "./BlockEntityManager";

export class BlockEntityRegistry {
  static instance = new BlockEntityRegistry();
  RegistryField: BlockEntity[];

  constructor() {
    this.RegistryField = [];
    world.afterEvents.blockPlace.subscribe((event) => {
      this.RegistryField.forEach((RegisterdBlockEntity) => {
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

  Register(blockEntity: BlockEntity): void {
    this.RegistryField.push(blockEntity);
  }

  Unregister(blockEntity: BlockEntity): void {
    this.RegistryField.splice(this.RegistryField.indexOf(blockEntity), 1);
  }

  Get(typeId: string): any {
    return this.RegistryField.find((blockEntity) => blockEntity.typeId == typeId);
  }
}
