import { Rotatable } from "./Rotatable";
import { BlockEntity } from "./BlockEntity";
import { Tickable } from "./Tickable";
import { Vector } from "@minecraft/server";
import { BlockEntityRegistry } from "./BlockEntityRegistry";
import { BlockEntityManager } from "./BlockEntityManager";

export abstract class RotatableBlockEntity extends BlockEntity implements Rotatable {
  RPM: number;
  Stress: number;
  constructor(typeId: string) {
    super(typeId);
    this.RPM = 0;
    this.Stress = 0;
    super.entity?.setDynamicProperty("rpm", this.RPM);
  }

  SetRPM(rpm: number): void {
    this.RPM = rpm;
    super.entity?.setDynamicProperty("rpm", this.RPM);
  }

  GetRPM(): number {
    return this.RPM;
  }

  // 横方向の一番大きいRPMを返す
  GetMaxSideRPM(): number {
    let block = this.block;
    if (block == null) {
      console.warn("block is null");
      return 0;
    }
    let sides: Vector[] = [
      new Vector(block.location.x, block.location.y, block.location.z + 1),
      new Vector(block.location.x, block.location.y, block.location.z - 1),
      new Vector(block.location.x + 1, block.location.y, block.location.z),
      new Vector(block.location.x - 1, block.location.y, block.location.z),
    ];
    let SideRPMs: number[] = [];
    BlockEntityManager.BlockEntities.forEach((blockEntity) => {
      if (
        (blockEntity.block?.location.x == sides[0].x &&
          blockEntity.block?.location.y == sides[0].y &&
          blockEntity.block?.location.z == sides[0].z) ||
        (blockEntity.block?.location.x == sides[1].x &&
          blockEntity.block?.location.y == sides[1].y &&
          blockEntity.block?.location.z == sides[1].z) ||
        (blockEntity.block?.location.x == sides[2].x &&
          blockEntity.block?.location.y == sides[2].y &&
          blockEntity.block?.location.z == sides[2].z) ||
        (blockEntity.block?.location.x == sides[3].x &&
          blockEntity.block?.location.y == sides[3].y &&
          blockEntity.block?.location.z == sides[3].z)
      ) {
        if (blockEntity instanceof RotatableBlockEntity) {
          SideRPMs.push(blockEntity.GetRPM());
        }
      }
    });
    // absしたほうが良いかも？
    let max = Math.max(...SideRPMs);
    return max;
  }

  // 上方向のRPMを返す
  GetMaxTopRPM(): number {
    let block = this.block;
    if (block == null) {
      return 0;
    }
    let top: Vector = new Vector(block.location.x, block.location.y + 1, block.location.z);
    let topRPM: number = 0;
    BlockEntityManager.BlockEntities.forEach((blockEntity) => {
      if (
        blockEntity.block?.location.x == top.x &&
        blockEntity.block?.location.y == top.y &&
        blockEntity.block?.location.z == top.z
      ) {
        if (blockEntity instanceof RotatableBlockEntity) {
          topRPM = blockEntity.GetRPM();
        }
      }
    });
    return topRPM;
  }
}
