import { world, system, DynamicPropertiesDefinition } from "@minecraft/server";
import { HandCrank } from "./HandCrank";
import { BlockEntityRegistry } from "./BlockEntityRegistry";
import { SmallCogWheel } from "./SmallCogWheel";
import { BlockEntityManager } from "./BlockEntityManager";

const modid: string = "infracraft";
const InfraCraftIds = (id: string): string => {
  return modid + ":" + id;
};

world.afterEvents.worldInitialize.subscribe((event) => {
  const propertiesDefinition = new DynamicPropertiesDefinition();
  propertiesDefinition.defineNumber("rpm");

  event.propertyRegistry.registerEntityTypeDynamicProperties(propertiesDefinition, InfraCraftIds("handcrank"));
  event.propertyRegistry.registerEntityTypeDynamicProperties(propertiesDefinition, InfraCraftIds("small_cog_wheel"));
});

// Register BlockEntity(Registry)
BlockEntityRegistry.instance.Register(new HandCrank());
BlockEntityRegistry.instance.Register(new SmallCogWheel());

function mainTick() {
  BlockEntityManager.TickAll();
  system.run(mainTick);
}

system.run(mainTick);
