import { BlockEntity } from "./BlockEntity";

export class BlockEntityRegistry {
  BlockEntities: BlockEntity[];
  constructor() {
    this.BlockEntities = [];
  }

  GlobalTickAll(): void {
    this.BlockEntities.forEach((blockEntity) => {
      blockEntity.GlobalTick();
    });
  }
}
