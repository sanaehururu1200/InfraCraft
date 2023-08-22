import { world } from "@minecraft/server";
import { BlockEntityRegistry } from "./BlockEntityRegistry";
import { BlockEntityManager } from "./BlockEntityManager";
import { SmallCogWheel } from "../BlockEntity/SmallCogWheel";
export class BlockEntityWatcher {
  static Tick() {
    // ロード時の追加用処理
    // イベントがなさそうなので、諦めて毎チック呼ぶ。
    const Entities = world.getDimension("overworld").getEntities();
    if (typeof Entities == "undefined") {
      return;
    }
    Entities.forEach((entity) => {
      BlockEntityRegistry.RegistryField.forEach((RegisterdBlockEntity) => {
        if (entity.typeId == RegisterdBlockEntity.typeId) {
          if (typeof entity == "undefined") {
            // console.warn("BlockEntityWatcher.Load: entity is undefined.");
            return;
          } else {
            // console.warn("BlockEntityWatcher.Load: entity is defined." + entity.id);
          }
          if (
            BlockEntityManager.BlockEntities.find((blockEntity) => {
              if (typeof blockEntity == "undefined") {
                // console.warn("BlockEntityWatcher.Load: blockEntity is undefined.");
                return false;
              }
              return blockEntity.entity?.id == entity.id;
            }) == undefined
          ) {
            // BlockEntityをEntityから生成
            //
            // そのままではチャンクロードで生成されたEntityはBlockEntityにならない
            // そのため、getEntities()で取得したEntityをBlockEntityに変換する
            BlockEntityManager.Register(RegisterdBlockEntity.FromEntity(entity));
          }
        }
      });
    });

    // アンロード時の破棄用処理
    BlockEntityManager.BlockEntities.forEach((blockEntity) => {
      if (typeof blockEntity == "undefined") {
        console.warn("BlockEntityWatcher.Unload: blockEntity is undefined.");
        return;
      }
      //console.warn("location:" + blockEntity.block?.location.x);
      if (Entities.find((entity) => entity.id == blockEntity.entity?.id) == undefined) {
        BlockEntityManager.Unregister(blockEntity);
      }
    });
  }
}
