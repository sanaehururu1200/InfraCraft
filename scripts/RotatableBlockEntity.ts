import { Rotatable } from "./Rotatable";
import { BlockEntity } from "./BlockEntity";
import { Tickable } from "./Tickable";

export abstract class RotatableBlockEntity extends BlockEntity implements Rotatable {
  RPM: number;
  Stress: number;
  constructor(typeId: string) {
    super(typeId);
    this.RPM = 0;
    this.Stress = 0;
    super.entity?.setDynamicProperty("rpm", this.RPM);
  }

  UpdateRPM(rpm: number): void {
    this.RPM = rpm;
    super.entity?.setDynamicProperty("rpm", this.RPM);
  }

  GetRPM(): number {
    return this.RPM;
  }
}
