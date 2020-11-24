import { assert } from './assert';

const categLogic = {
    name: 'Logic',
    colour: '%{BKY_LOGIC_HUE}',
    elems: [
        {
            name: 'controls_if',
            block: '<block type="controls_if"></block>'
        },
        {
            name: 'logic_compare',
            block: '<block type="logic_compare"></block>'
        },
        {
            name: 'logic_operation',
            block: '<block type="logic_operation"></block>'
        },
        {
            name: 'logic_negate',
            block: '<block type="logic_negate"></block>'
        },
        {
            name: 'logic_boolean',
            block: '<block type="logic_boolean"></block>'
        },
        {
            name: 'logic_null',
            block: '<block type="logic_null"></block>'
        },
        {
            name: 'logic_ternary',
            block: '<block type="logic_ternary"></block>'
        }
    ]
};

const categLoops = {
    name: 'Loops',
    colour: '%{BKY_LOOPS_HUE}',
    elems: [
        {
            name: 'controls_repeat_ext',
            block: `<block type="controls_repeat_ext">
                        <value name="TIMES">
                        <shadow type="math_number">
                            <field name="NUM">10</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'controls_whileUntil',
            block: '<block type="controls_whileUntil"></block>'
        },
        {
            name: 'controls_for',
            block: `<block type="controls_for">
                        <value name="FROM">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                        <value name="TO">
                        <shadow type="math_number">
                            <field name="NUM">10</field>
                        </shadow>
                        </value>
                        <value name="BY">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'controls_forEach',
            block: '<block type="controls_forEach"></block>'
        },
        {
            name: 'controls_flow_statements',
            block: '<block type="controls_flow_statements"></block>'
        }
    ]
};

const categMath = {
    name: 'Math',
    colour: '%{BKY_MATH_HUE}',
    elems: [
        {
            name: 'math_number',
            block: `<block type="math_number">
                        <field name="NUM">123</field>
                    </block>`
        },
        {
            name: 'math_arithmetic',
            block: `<block type="math_arithmetic">
                        <value name="A">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                        <value name="B">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_single',
            block: `<block type="math_single">
                        <value name="NUM">
                        <shadow type="math_number">
                            <field name="NUM">9</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_trig',
            block: `<block type="math_trig">
                        <value name="NUM">
                        <shadow type="math_number">
                            <field name="NUM">45</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_constant',
            block: `<block type="math_constant"></block>`
        },
        {
            name: 'math_number_property',
            block: `<block type="math_number_property">
                        <value name="NUMBER_TO_CHECK">
                        <shadow type="math_number">
                            <field name="NUM">0</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_round',
            block: `<block type="math_round">
                        <value name="NUM">
                        <shadow type="math_number">
                            <field name="NUM">3.1</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_on_list',
            block: `<block type="math_on_list"></block>`
        },
        {
            name: 'math_modulo',
            block: `<block type="math_modulo">
                        <value name="DIVIDEND">
                        <shadow type="math_number">
                            <field name="NUM">64</field>
                        </shadow>
                        </value>
                        <value name="DIVISOR">
                        <shadow type="math_number">
                            <field name="NUM">10</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_constrain',
            block: `<block type="math_constrain">
                        <value name="VALUE">
                        <shadow type="math_number">
                            <field name="NUM">50</field>
                        </shadow>
                        </value>
                        <value name="LOW">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                        <value name="HIGH">
                        <shadow type="math_number">
                            <field name="NUM">100</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_random_int',
            block: `<block type="math_random_int">
                        <value name="FROM">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                        <value name="TO">
                        <shadow type="math_number">
                            <field name="NUM">100</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'math_random_float',
            block: `<block type="math_random_float"></block>`
        },
        {
            name: 'math_atan2',
            block: `<block type="math_atan2">
                        <value name="X">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                        <value name="Y">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                        </value>
                    </block>`
        }
    ]
};

const categText = {
    name: 'Text',
    colour: '%{BKY_TEXTS_HUE}',
    elems: [
        {
            name: 'text',
            block: `<block type="text"></block>`
        },
        {
            name: 'text_join',
            block: `<block type="text_join"></block>`
        },
        {
            name: 'text_append',
            block: `<block type="text_append">
                        <value name="TEXT">
                        <shadow type="text"></shadow>
                        </value>
                    </block>`
        },
        {
            name: 'text_length',
            block: `<block type="text_length">
                        <value name="VALUE">
                        <shadow type="text">
                            <field name="TEXT">abc</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'text_isEmpty',
            block: `<block type="text_isEmpty">
                        <value name="VALUE">
                        <shadow type="text">
                            <field name="TEXT"></field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'text_indexOf',
            block: `<block type="text_indexOf">
                        <value name="VALUE">
                        <block type="variables_get">
                            <field name="VAR">{textVariable}</field>
                        </block>
                        </value>
                        <value name="FIND">
                        <shadow type="text">
                            <field name="TEXT">abc</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'text_charAt',
            block: `<block type="text_charAt">
                        <value name="VALUE">
                        <block type="variables_get">
                            <field name="VAR">{textVariable}</field>
                        </block>
                        </value>
                    </block>`
        },
        {
            name: 'text_getSubstring',
            block: `<block type="text_getSubstring">
                        <value name="STRING">
                        <block type="variables_get">
                            <field name="VAR">{textVariable}</field>
                        </block>
                        </value>
                    </block>`
        },
        {
            name: 'text_changeCase',
            block: `<block type="text_changeCase">
                        <value name="TEXT">
                        <shadow type="text">
                            <field name="TEXT">abc</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'text_trim',
            block: `<block type="text_trim">
                        <value name="TEXT">
                        <shadow type="text">
                            <field name="TEXT">abc</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'text_print',
            block: `<block type="text_print">
                        <value name="TEXT">
                        <shadow type="text">
                            <field name="TEXT">abc</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'text_prompt_ext',
            block: `<block type="text_prompt_ext">
                        <value name="TEXT">
                        <shadow type="text">
                            <field name="TEXT">abc</field>
                        </shadow>
                        </value>
                    </block>`
        }
    ]
};

const categLists = {
    name: 'Lists',
    colour: '%{BKY_LISTS_HUE}',
    elems: [
        {
            name: 'lists_create_with',
            block: `<block type="lists_create_with">
                        <mutation items="0"></mutation>
                    </block>`
        },
        {
            name: 'lists_create_with',
            block: `<block type="lists_create_with"></block>`
        },
        {
            name: 'lists_repeat',
            block: `<block type="lists_repeat">
                        <value name="NUM">
                        <shadow type="math_number">
                            <field name="NUM">5</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'lists_length',
            block: `<block type="lists_length"></block>`
        },
        {
            name: 'lists_isEmpty',
            block: `<block type="lists_isEmpty"></block>`
        },
        {
            name: 'lists_indexOf',
            block: `<block type="lists_indexOf">
                        <value name="VALUE">
                        <block type="variables_get">
                            <field name="VAR">{listVariable}</field>
                        </block>
                        </value>
                    </block>`
        },
        {
            name: 'lists_getIndex',
            block: `<block type="lists_getIndex">
                        <value name="VALUE">
                        <block type="variables_get">
                            <field name="VAR">{listVariable}</field>
                        </block>
                        </value>
                    </block>`
        },
        {
            name: 'lists_setIndex',
            block: `<block type="lists_setIndex">
                        <value name="LIST">
                        <block type="variables_get">
                            <field name="VAR">{listVariable}</field>
                        </block>
                        </value>
                    </block>`
        },
        {
            name: 'lists_getSublist',
            block: `<block type="lists_getSublist">
                        <value name="LIST">
                        <block type="variables_get">
                            <field name="VAR">{listVariable}</field>
                        </block>
                        </value>
                    </block>`
        },
        {
            name: 'lists_split',
            block: `<block type="lists_split">
                        <value name="DELIM">
                        <shadow type="text">
                            <field name="TEXT">,</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'lists_sort',
            block: `<block type="lists_sort"></block>`
        }
    ]
};

const categColour = {
    name: 'Colour',
    colour: '%{BKY_COLOUR_HUE}',
    elems: [
        {
            name: 'colour_picker',
            block: `<block type="colour_picker"></block>`
        },
        {
            name: 'colour_random',
            block: `<block type="colour_random"></block>`
        },
        {
            name: 'colour_rgb',
            block: `<block type="colour_rgb">
                        <value name="RED">
                        <shadow type="math_number">
                            <field name="NUM">100</field>
                        </shadow>
                        </value>
                        <value name="GREEN">
                        <shadow type="math_number">
                            <field name="NUM">50</field>
                        </shadow>
                        </value>
                        <value name="BLUE">
                        <shadow type="math_number">
                            <field name="NUM">0</field>
                        </shadow>
                        </value>
                    </block>`
        },
        {
            name: 'colour_blend',
            block: `<block type="colour_blend">
                        <value name="COLOUR1">
                        <shadow type="colour_picker">
                            <field name="COLOUR">#ff0000</field>
                        </shadow>
                        </value>
                        <value name="COLOUR2">
                        <shadow type="colour_picker">
                            <field name="COLOUR">#3333ff</field>
                        </shadow>
                        </value>
                        <value name="RATIO">
                        <shadow type="math_number">
                            <field name="NUM">0.5</field>
                        </shadow>
                        </value>
                    </block>`
        }
    ]
};

const categVariables = {
    name: 'Variables',
    colour: '%{BKY_VARIABLES_DYNAMIC_HUE}',
    custom: 'VARIABLE'
};

const categFunctions = {
    name: 'Functions',
    colour: '%{BKY_PROCEDURES_HUE}',
    custom: 'PROCEDURE'
};

export var categories = [
    {
        name: 'Logic',
        data: categLogic
    },
    {
        name: 'Loops',
        data: categLoops
    },
    {
        name: 'Math',
        data: categMath
    },
    {
        name: 'Text',
        data: categText
    },
    {
        name: 'Lists',
        data: categLists
    },
    {
        name: 'Colour',
        data: categColour,
    },
    {
        name: 'Variables',
        data: categVariables
    },
    {
        name: 'Functions',
        data: categFunctions
    }
];

export function getPredefinedCategories() {
    return [...categories];
}

var currentCategories = [];

export function defineGeneralCategories(categories) {
    currentCategories = categories;
}

function _genToolboxElems(elems, choices) {
    let toolbox = {
        gen: '',
        extra: []
    };
    
    if (!choices) {
        elems.forEach(elem => toolbox.gen += elem.block);
    }
    else {
        elems.forEach(elem => {
            if (choices.findIndex(choice === elem.name)>-1) {
                toolbox.gen += elem.block;
            }
        });
    }

    return toolbox;
}

function _genToolboxCategory(category, choices) {
    let toolbox = {
        gen: '',
        extra: []
    };

    toolbox.gen = '<category name="' + category.data.name + '" ' +
        'colour="' + category.data.colour + '"';

    if ('custom' in category.data) {
        toolbox.gen += ' custom="' + category.data.custom + '">';
    }
    else {
        toolbox.gen += '>';
        let elem = _genToolboxElems(category.data.elems, choices);
        toolbox.gen += elem.gen;
        toolbox.extra = [...elem.extra];
    }

    toolbox.gen += '</category>';

    return toolbox;
}

/**
 * 
 * @param {* { category: String, elems: [String] }
 *  } choices
 */
export function genPredefinedCategoriesToolbox(general) {
    let toolbox = {
        gen: '',
        extra: []
    };

    if (general.choices === 'ALL') {
        currentCategories.forEach(category => {
            let categ = _genToolboxCategory(category);
            toolbox.gen += categ.gen;
            toolbox.extra = [...categ.extra];
        });
    }
    else {
        general.choices.forEach(choice => {
            let result = currentCategories.filter(category =>
                category.name === choice.category
            );
            assert(result.length === 1, result.length + ' found categories.');

            let categ = _genToolboxCategory(result[0], choice.elems);
            toolbox.gen += categ.gen;
            toolbox.extra = [...categ.extra];
        });
    }

    if (general.category) {
        let categ = general.category;
        
        let gen = '<category name="' + categ.name + '"';
        if ('colour' in categ) gen += ' colour="' + categ.colour + '"';
        if ('expanded' in categ) gen += ' expanded="' + categ.expanded + '"';

        toolbox.gen = gen + '>' + toolbox.gen + '</category>';
    }

    return toolbox;
}
