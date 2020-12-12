import { RuntimeManager } from "../../../../../../run-time-system-manager/run-time-manager";
import * as Blockly from 'blockly';

Blockly.Block.prototype.toStringDEBUG = function (opt_maxLength, opt_emptyToken) {
    var text = [];
    var emptyFieldPlaceholder = opt_emptyToken || '?';

    // Temporarily set flag to navigate to all fields.
    var prevNavigateFields = Blockly.ASTNode.NAVIGATE_ALL_FIELDS;
    Blockly.ASTNode.NAVIGATE_ALL_FIELDS = true;

    var node = Blockly.ASTNode.createBlockNode(this);
    var rootNode = node;

    /**
     * Whether or not to add parentheses around an input.
     * @param {!Blockly.Connection} connection The connection.
     * @return {boolean} True if we should add parentheses around the input.
     */
    function shouldAddParentheses(connection) {
        var checks = connection.getCheck();
        if (!checks && connection.targetConnection) {
            checks = connection.targetConnection.getCheck();
        }
        return !!checks && (checks.indexOf('Boolean') != -1 ||
            checks.indexOf('Number') != -1);
    }

    /**
     * Check that we haven't circled back to the original root node.
     */
    function checkRoot() {
        if (node && node.getType() == rootNode.getType() &&
            node.getLocation() == rootNode.getLocation()) {
            node = null;
        }
    }

    // Traverse the AST building up our text string.
    while (node) {
        switch (node.getType()) {
            case Blockly.ASTNode.types.INPUT:
                var connection = /** @type {!Blockly.Connection} */ (node.getLocation());
                if (!node.in()) {
                    text.push(emptyFieldPlaceholder);
                } else if (shouldAddParentheses(connection)) {
                    text.push('(');
                }
                break;
            case Blockly.ASTNode.types.FIELD:
                var field = /** @type {Blockly.Field} */ (node.getLocation());
                if (field.name != Blockly.Block.COLLAPSED_FIELD_NAME) {
                    text.push(field.getText());
                }
                break;
        }

        var current = node;
        node = current.in() || current.next();
        if (!node) {
            // Can't go in or next, keep going out until we can go next.
            node = current.out();
            checkRoot();
            while (node && !node.next()) {
                node = node.out();
                checkRoot();
                // If we hit an input on the way up, possibly close out parentheses.
                if (node && node.getType() == Blockly.ASTNode.types.INPUT &&
                    shouldAddParentheses(
                /** @type {!Blockly.Connection} */(node.getLocation()))) {
                    text.push(')');
                }
            }
            if (node) {
                node = node.next();
            }
        }
    }

    // Restore state of NAVIGATE_ALL_FIELDS.
    Blockly.ASTNode.NAVIGATE_ALL_FIELDS = prevNavigateFields;

    // Run through our text array and simplify expression to remove parentheses
    // around single field blocks.
    for (var i = 2, l = text.length; i < l; i++) {
        if (text[i - 2] == '(' && text[i] == ')') {
            text[i - 2] = text[i - 1];
            text.splice(i - 1, 2);
            l -= 2;
        }
    }

    // Join the text array, removing spaces around added paranthesis.
    text = text.join(' ').replace(/(\() | (\))/gmi, '$1$2').trim() || '???';
    if (opt_maxLength) {
        // TODO: Improve truncation so that text from this block is given priority.
        // E.g. "1+2+3+4+5+6+7+8+9=0" should be "...6+7+8+9=0", not "1+2+3+4+5...".
        // E.g. "1+2+3+4+5=6+7+8+9+0" should be "...4+5=6+7...".
        if (text.length > opt_maxLength) {
            text = text.substring(0, opt_maxLength - 3) + '...';
        }
    }
    return text;
};
Blockly.Block.prototype.toStringRELEASE =
    Blockly.Block.prototype.toString;
Blockly.Block.prototype.toString = function (opt_maxLength, opt_emptyToken) {
    return Blockly.Block.prototype["toString" + RuntimeManager.getMode()]
        (opt_maxLength, opt_emptyToken);
};
