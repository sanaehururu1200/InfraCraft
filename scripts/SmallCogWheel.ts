import { world, Vector, Entity, Vector3 } from "@minecraft/server";
import { RotatableBlockEntity } from "./RotatableBlockEntity";

export class SmallCogWheel extends RotatableBlockEntity {
  RPM: number;
  Stress: number;
  static typeId: string = "infracraft:small_cog_wheel";
  constructor() {
    super("infracraft:small_cog_wheel");
    this.RPM = 0;
    this.Stress = 0;
  }

  static FromEntity(entity: Entity): SmallCogWheel {
    let blockEntity: SmallCogWheel = new SmallCogWheel();
    blockEntity.entity = entity;
    let block = entity.dimension.getBlock(entity.location);
    if (typeof block != "undefined") {
      blockEntity.block = block;
    } else {
      console.warn("SmallCogWheel.FromEntity: block is undefined, restore from entity.location is failed.");
    }
    return blockEntity;
  }

  Tick(): void {
    let maxTopRPM: number = this.GetMaxTopRPM();
    if (maxTopRPM == 0) {
      let maxSideRPM: number = this.GetMaxSideRPM();
      this.SetRPM(-maxSideRPM);
    } else {
      this.SetRPM(maxTopRPM);
    }

    // 初期化中?
    if (this.entity == null) return;

    this.entity.teleport(
      { x: this.entity.location.x, y: this.entity.location.y, z: this.entity.location.z },
      {
        rotation: { x: 0, y: this.entity.getRotation().y + this.RPM * 18 },
      }
    );
    if (this.GetRPM() != 0) {
      world.playSound("block.scaffolding.climb", this.entity.location || { x: 100000, y: 100000, z: 100000 });
    }
  }

  New(): SmallCogWheel {
    return new SmallCogWheel();
  }
}
