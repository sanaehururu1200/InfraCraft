import { world, DynamicPropertiesDefinition } from "@minecraft/server";
import { HandCrank } from "../BlockEntity/HandCrank";
import { SmallCogWheel } from "../BlockEntity/SmallCogWheel";

export class WorldInitializer {
  static Initialize() {
    world.afterEvents.worldInitialize.subscribe((event) => {
      const propertiesDefinition_RPM = new DynamicPropertiesDefinition();
      propertiesDefinition_RPM.defineNumber("rpm");
      event.propertyRegistry.registerEntityTypeDynamicProperties(propertiesDefinition_RPM, HandCrank.typeId);
      event.propertyRegistry.registerEntityTypeDynamicProperties(propertiesDefinition_RPM, SmallCogWheel.typeId);
    });
  }
}
