export const BlocklyConditional = {
  name: "ec-blockly-conditional-event",
  items: [
    {
      type: "Predefined",
      elements: "ALL", // select: [{category:'catName',elems:[...]}, ...]
      category: {
        name: "Built-in",
        expanded: true,
      },
    },
    {
      type: "Separator",
      gap: "200",
    },
    {
      name: "Conditional",
      type: "DomainStatic",
      colour: "75",
      elements: [
        "conditional_when",
        "conditional_when_top_bottom",
        "logical_operators",
        "relational_operators",
        "changes",
      ],
    },
    {
      name: "Smart Objects",
      type: "Category",
      colour: "210",
      elements: [
        {
          name: "Get Values",
          type: "Category",
          colour: "60",
          elements: [
            {
              name: {
                domainElem: "SmartObject",
                item: "getter",
              },
              type: "Element",
            },
          ],
        },
      ],
    },
  ],
  editors: [
    {
      name: "BlocklyVPL",
      src: ``,
      style: [],
    },
  ],
};
