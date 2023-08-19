import { world, Vector, ItemUseAfterEvent, Entity, Block } from "@minecraft/server";

import { Rotatable } from "./Rotatable";
import { BlockEntity } from "./BlockEntity";
import { Tickable } from "./Tickable";
import { RotatableBlockEntity } from "./RotatableBlockEntity";

export class HandCrank extends RotatableBlockEntity {
  Entity: Entity | null = null;
  Block: Block | null = null;
  Count: number = 0;
  static typeId: string = "infracraft:handcrank";

  constructor() {
    super("infracraft:handcrank");
  }

  OnUse(event: ItemUseAfterEvent): void {
    if (
      Vector.distance(
        event.source.getBlockFromViewDirection()?.block.location || { x: -100000, y: -100000, z: -100000 },
        this.entity?.location || { x: 100000, y: 100000, z: 100000 }
      ) < 1.5
    ) {
      if (this.entity?.typeId.toString() == this.typeId) {
        this.UpdateRPM(2);
        event.source.sendMessage("RPM: " + this.GetRPM());
        this.Count = 1;
      }
    }
  }

  Tick(): void {
    // if (this.Entity == null) {
    //   console.warn("this.Entity is null or undefined");
    //   return;
    // }
    if (this.Count > 2) {
      // 一定時間以上Useしてないので減衰させる
      if (this.GetRPM() != 0) {
        this.entity?.setDynamicProperty("rpm", this.GetRPM() - 1);
      } else {
        this.Count = 0;
      }
    } else if (this.Count != 0) {
      // 回転中
      this.entity?.teleport(
        { x: this.entity?.location.x, y: this.entity?.location.y, z: this.entity?.location.z },
        {
          rotation: { x: 0, y: this.entity?.getRotation().y + this.RPM * 18 },
        }
      );
      world.playSound("block.scaffolding.climb", this.entity?.location || { x: 100000, y: 100000, z: 100000 });
    }
  }

  New(): HandCrank {
    return new HandCrank();
  }
}
