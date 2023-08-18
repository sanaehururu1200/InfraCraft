export class BlockEntityRegistry {
    constructor() {
        this.BlockEntities = [];
    }
    GlobalTickAll() {
        this.BlockEntities.forEach((blockEntity) => {
            blockEntity.GlobalTick();
        });
    }
}

//# sourceMappingURL=../../_custom_block_behavior_packDebug/BlockEntityRegistry.js.map
