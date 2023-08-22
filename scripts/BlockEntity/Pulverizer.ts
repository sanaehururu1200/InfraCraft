import { ItemUseAfterEvent, Entity, Block, EntityInventoryComponent, ItemStack } from "@minecraft/server";
import { RotatableBlockEntity } from "../Core/RotatableBlockEntity";

export class Pulverizer extends RotatableBlockEntity {
  entity: Entity | null = null;
  block: Block | null = null;
  Count: number = 0;
  static typeId: string = "infracraft:pulverizer";

  constructor() {
    super(Pulverizer.typeId);
  }

  OnUse(event: ItemUseAfterEvent): void {
    let inv: EntityInventoryComponent = this.entity?.getComponent("inventory") as EntityInventoryComponent;
    if (typeof inv.container.getItem(0) == "undefined") {
      event.itemStack.amount = 0;
      inv.container.addItem(event.itemStack);
      console.warn("Pulverizer.OnUse: addItem");
    } else {
      event.source.dimension.spawnItem(
        inv.container.getItem(0) ?? new ItemStack("", 0),
        this.entity?.location || { x: 0, y: 0, z: 0 }
      );
      console.warn("Pulverizer.OnUse: item is already exist.");
    }
  }

  static FromEntity(entity: Entity): Pulverizer {
    let blockEntity: Pulverizer = new Pulverizer();
    blockEntity.entity = entity;
    let block = entity.dimension.getBlock(entity.location);
    if (typeof block != "undefined") {
      blockEntity.block = block;
    } else {
      console.warn("Pulverizer.FromEntity: block is undefined, restore from entity.location is failed.");
    }
    return blockEntity;
  }

  Tick(): void {
    super.Tick();
    this.SetRPM(this.GetSideRPMMax());
  }

  New(): Pulverizer {
    return new Pulverizer();
  }
}
