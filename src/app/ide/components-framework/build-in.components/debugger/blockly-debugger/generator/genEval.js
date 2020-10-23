export function genEval (my_nest, block_id, editor_id) {
    if (block_id.indexOf('\$') == block_id.length - 1) {
      block_id = block_id.slice(0, -1);
      block_id += '__DOLLAR__';
    }
    return 'eval(update_values()), await wait(' + my_nest + ', \'' + block_id + '\', \''+ editor_id + '\') ';
  }
  