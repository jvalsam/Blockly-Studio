
Blockly.Block.prototype.toString = function(opt_maxLength, opt_emptyToken) {
    var text = [];
    var emptyFieldPlaceholder = opt_emptyToken || '?';
    if (this.collapsed_) {
      text.push(this.getInput('_TEMP_COLLAPSED_INPUT').fieldRow[0].text_);
    } else {
      for (var i = 0, input; input = this.inputList[i]; i++) {
        for (var j = 0, field; field = input.fieldRow[j]; j++) {
          if (field instanceof Blockly.FieldDropdown && !field.getValue()) {
            text.push(emptyFieldPlaceholder);
          } else {
            text.push(field.getText());
          }
        }
        if (input.connection) {
          var child = input.connection.targetBlock();
          if (child) {
              var child_text = child.toString(undefined, opt_emptyToken);
              child_text = "(" + child_text + ")";                    // add ()
            text.push(child_text);
          } else {
            text.push(emptyFieldPlaceholder);
          }
        }
      }
    }
    text = goog.string.trim(text.join(' ')) || '???';
    if (opt_maxLength) {
      // TODO: Improve truncation so that text from this block is given priority.
      // E.g. "1+2+3+4+5+6+7+8+9=0" should be "...6+7+8+9=0", not "1+2+3+4+5...".
      // E.g. "1+2+3+4+5=6+7+8+9+0" should be "...4+5=6+7...".
      text = goog.string.truncate(text, opt_maxLength);
    }
    return text;
  };