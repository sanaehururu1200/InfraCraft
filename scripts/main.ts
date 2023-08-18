import { world, system, DynamicPropertiesDefinition } from "@minecraft/server";
import { HandCrank } from "./HandCrank";
import { BlockEntityRegistry } from "./BlockEntityRegistry";
import { SmallCogWheel } from "./SmallCogWheel";

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

const registry: BlockEntityRegistry = new BlockEntityRegistry();
registry.BlockEntities.push(new HandCrank());
registry.BlockEntities.push(new SmallCogWheel());

function mainTick() {
  registry.GlobalTickAll();
  system.run(mainTick);
}

system.run(mainTick);
