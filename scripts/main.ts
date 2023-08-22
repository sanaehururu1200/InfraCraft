import { world, system, DynamicPropertiesDefinition } from "@minecraft/server";
import { HandCrank } from "./BlockEntity/HandCrank";
import { BlockEntityRegistry } from "./Core/BlockEntityRegistry";
import { SmallCogWheel } from "./BlockEntity/SmallCogWheel";
import { BlockEntityManager } from "./Core/BlockEntityManager";
import { BlockEntityWatcher } from "./Core/BlockEntityWatcher";
import { WorldInitializer } from "./Core/WorldInitializer";

WorldInitializer.Initialize();

// Register BlockEntity
BlockEntityRegistry.Register(new HandCrank());
BlockEntityRegistry.Register(new SmallCogWheel());

function mainTick() {
  // Tick BlockEntity
  BlockEntityManager.TickAll();

  // Load and Unload BlockEntity
  BlockEntityWatcher.Tick();

  // Repeat
  system.run(mainTick);
}
console.warn("mainTick start.");
system.run(mainTick);
