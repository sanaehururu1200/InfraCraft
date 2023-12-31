import { ItemUseAfterEvent, Entity, Block } from "@minecraft/server";
import { RotatableBlockEntity } from "../Core/RotatableBlockEntity";

export class HandCrank extends RotatableBlockEntity {
  Entity: Entity | null = null;
  Block: Block | null = null;
  Count: number = 0;
  static typeId: string = "infracraft:handcrank";

  constructor() {
    super("infracraft:handcrank");
  }

  OnUse(event: ItemUseAfterEvent): void {
    this.SetRPM(2);
    this.Count = 1;
  }

  FromEntity(entity: Entity): HandCrank {
    let blockEntity: HandCrank = new HandCrank();
    blockEntity.entity = entity;
    let block = entity.dimension.getBlock(entity.location);
    if (typeof block != "undefined") {
      blockEntity.block = block;
    } else {
      console.warn("HandCrank.FromEntity: block is undefined, restore from entity.location is failed.");
    }
    return blockEntity;
  }

  Tick(): void {
    super.Tick();
    if (this.Count > 2) {
      // 一定時間以上Useしてないので減衰させる
      if (this.GetRPM() != 0) {
        this.SetRPM(this.GetRPM() - 1);
      } else {
        this.Count = 0;
      }
    } else if (this.Count != 0) {
      // 回転中
      if (this.entity == null) return;
      this.SetRPM(2);
      this.Count++;
    } else {
      this.SetRPM(this.GetTopAndUnderMaxRPM());
    }
  }

  New(): HandCrank {
    return new HandCrank();
  }
}
