export const HandleWorkspaceEvents = function (event, wsp) {
  let block = wsp.getBlockById(event.blockId);

  if (block) {
    let blockType = wsp.getBlockById(event.blockId).type;

    if (blockType === "break_continue_when") {
      if (!block.isSurroundWhen()) {
        //   Create new warning
        block.setWarningText(
          "Warning: The block has to be a child of when block"
        );
        if (block.warning) block.warning.setVisible(true);
        block.setDisabled(true);
      } else {
        block.setDisabled(false);
        block.setWarningText(null);
      }
    } else if (blockType === "break_continue_every") {
      if (!block.isSurroundEvery()) {
        //   Create new warning
        block.setWarningText(
          "Warning: The block has to be a child of every block"
        );
        if (block.warning) block.warning.setVisible(true);
        block.setDisabled(true);
      } else {
        block.setDisabled(false);
        block.setWarningText(null);
      }
    } else if (blockType === "calendar_every_top_bottom") {
      if (block.isSurroundLoop()) {
        //   Create new warning
        block.setWarningText(
          "Warning: The Every block cannot be in When / Every block"
        );
        if (block.warning) block.warning.setVisible(true);
        block.setDisabled(true);
      } else {
        block.setDisabled(false);
        block.setWarningText(null);
      }
    }
  }
};
