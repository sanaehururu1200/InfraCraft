import { world, Vector, Entity, Vector3 } from "@minecraft/server";
import { RotatableBlockEntity } from "../Core/RotatableBlockEntity";

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
    super.Tick();
    let maxTopRPM: number = this.GetTopAndUnderMaxRPM();
    if (maxTopRPM == 0) {
      let maxSideRPM: number = this.GetSideRPMMax();
      this.SetRPM(-maxSideRPM);
    } else {
      this.SetRPM(maxTopRPM);
    }
  }

  New(): SmallCogWheel {
    return new SmallCogWheel();
  }
}
