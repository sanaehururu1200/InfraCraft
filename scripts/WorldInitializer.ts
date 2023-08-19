import { world, DynamicPropertiesDefinition } from "@minecraft/server";
export class WorldInitializer {
  static Initialize() {
    world.afterEvents.worldInitialize.subscribe((event) => {
      const propertiesDefinition = new DynamicPropertiesDefinition();
      propertiesDefinition.defineNumber("rpm");

      event.propertyRegistry.registerEntityTypeDynamicProperties(propertiesDefinition, "infracraft:handcrank");
      event.propertyRegistry.registerEntityTypeDynamicProperties(propertiesDefinition, "infracraft:small_cog_wheel");
    });
  }
}
