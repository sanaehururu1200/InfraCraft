import { world } from "@minecraft/server";
import { BlockEntityRegistry } from "./BlockEntityRegistry";
import { BlockEntityManager } from "./BlockEntityManager";

export class BlockEntityWatcher {
  static tick() {
    // ロード時の追加用処理
    const Entities = world.getDimension("overworld").getEntities();
    Entities.forEach((entity) => {
      BlockEntityRegistry.RegistryField.forEach((RegisterdBlockEntity) => {
        if (entity.typeId == RegisterdBlockEntity.entity?.typeId) {
          if (
            BlockEntityManager.BlockEntities.find((blockEntity) => blockEntity.entity?.id == entity.id) == undefined
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
      if (Entities.find((entity) => entity.id == blockEntity.entity?.id) == undefined) {
        BlockEntityManager.Unregister(blockEntity);
      }
    });
  }
}
