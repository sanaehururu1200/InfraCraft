import { world, Vector, Block, Entity, ItemUseAfterEvent } from "@minecraft/server";

import { Tickable } from "./Tickable";

export abstract class BlockEntity implements Tickable {
  entity: Entity | null;
  block: Block | null;
  typeId: string;
  constructor(typeId: string) {
    this.entity = null;
    this.block = null;
    this.typeId = typeId;
  }

  FromEntity(entity: Entity): any {
    console.warn("BlockEntity.FromEntity: This method is not implemented.");
  }

  OnUse(event: ItemUseAfterEvent): void {}

  Tick(): void {}

  New(): any {}
}
