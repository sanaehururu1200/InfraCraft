import { world, system, DynamicPropertiesDefinition } from "@minecraft/server";
import { HandCrank } from "./HandCrank";
import { BlockEntityRegistry } from "./BlockEntityRegistry";
const modid = "infracraft";
const InfraCraftIds = (id) => {
    return modid + ":" + id;
};
world.afterEvents.worldInitialize.subscribe((event) => {
    const propertiesDefinition = new DynamicPropertiesDefinition();
    propertiesDefinition.defineNumber("rpm");
    event.propertyRegistry.registerEntityTypeDynamicProperties(propertiesDefinition, InfraCraftIds("handcrank"));
});
const registry = new BlockEntityRegistry();
registry.BlockEntities.push(new HandCrank());
function mainTick() {
    registry.GlobalTickAll();
    system.run(mainTick);
}
system.run(mainTick);

//# sourceMappingURL=../../_custom_block_behavior_packDebug/main.js.map
