import { world, system, DynamicPropertiesDefinition } from "@minecraft/server";
import { HandCrank } from "./HandCrank";
import { BlockEntityRegistry } from "./BlockEntityRegistry";
import { SmallCogWheel } from "./SmallCogWheel";
import { BlockEntityManager } from "./BlockEntityManager";
import { BlockEntityWatcher } from "./BlockEntityWatcher";
import { WorldInitializer } from "./WorldInitializer";

WorldInitializer.Initialize();

// Register BlockEntity
BlockEntityRegistry.Register(new HandCrank());
BlockEntityRegistry.Register(new SmallCogWheel());

function mainTick() {
  // Tick BlockEntity
  BlockEntityManager.TickAll();

  // Load and Unload BlockEntity
  BlockEntityWatcher.tick();

  // Repeat
  system.run(mainTick);
}

system.run(mainTick);
