import { Rotatable } from "./Rotatable";
import { BlockEntity } from "./BlockEntity";
import { Vector, world } from "@minecraft/server";
import { BlockEntityManager } from "./BlockEntityManager";

export abstract class RotatableBlockEntity extends BlockEntity implements Rotatable {
  RPM: number;
  Stress: number;
  PowerFrom: RotatableBlockEntity | null;
  constructor(typeId: string) {
    super(typeId);
    this.RPM = 0;
    this.Stress = 0;
    this.PowerFrom = null;
    super.entity?.setDynamicProperty("rpm", this.RPM);
  }

  Tick(): void {
    if (this.GetRPM() != 0) {
      world.playSound("block.scaffolding.climb", this.entity?.location || { x: 100000, y: 100000, z: 100000 });
      this.entity?.teleport(
        { x: this.entity?.location.x, y: this.entity?.location.y, z: this.entity?.location.z },
        {
          rotation: { x: 0, y: this.entity?.getRotation().y + this.RPM * 18 },
        }
      );
    }
  }

  SetRPM(rpm: number): void {
    this.RPM = rpm;
    super.entity?.setDynamicProperty("rpm", this.RPM);
  }

  GetRPM(): number {
    return this.RPM;
  }

  // 横方向の一番大きいRPMを返す
  GetSideRPMMax(): number {
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
    var max = 0;
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
          if (blockEntity.PowerFrom != this) {
            if (Math.abs(blockEntity.GetRPM()) > Math.abs(max)) {
              max = blockEntity.GetRPM();
              this.PowerFrom = blockEntity;
            }
          }
        }
      }
    });
    // もしかしたらabsを使うべきかもしれない

    // 0だったらPowerFromをnullにする
    if (max == 0) this.PowerFrom = null;
    return max;
  }

  // 上下方向の一番大きいRPMを返す
  GetTopAndUnderMaxRPM(): number {
    let block = this.block;
    if (block == null) {
      return 0;
    }
    let array: Vector[] = [
      new Vector(block.location.x, block.location.y + 1, block.location.z),
      new Vector(block.location.x, block.location.y - 1, block.location.z),
    ];
    var max = 0;
    BlockEntityManager.BlockEntities.forEach((blockEntity) => {
      if (
        (blockEntity.block?.location.x == array[0].x &&
          blockEntity.block?.location.y == array[0].y &&
          blockEntity.block?.location.z == array[0].z) ||
        (blockEntity.block?.location.x == array[1].x &&
          blockEntity.block?.location.y == array[1].y &&
          blockEntity.block?.location.z == array[1].z)
      ) {
        if (blockEntity instanceof RotatableBlockEntity) {
          if (blockEntity.PowerFrom != this) {
            if (Math.abs(blockEntity.GetRPM()) > Math.abs(max)) {
              max = blockEntity.GetRPM();
              this.PowerFrom = blockEntity;
            }
          }
        }
      }
    });

    if (max == 0) this.PowerFrom = null;
    return max;
  }
}
