export const AutomationTask = {
  name: "ec-blockly-automation-task",
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
      name: "Smart Objects",
      type: "Category",
      colour: "210",
      elements: [
        {
          name: {
            domainElem: "SmartObject",
          },
          type: "Category",
          colour: "60",
          elements: "ALL",
        },
      ],
    },
    {
      name: "Smart Groups",
      type: "Category",
      colour: "210",
      elements: [
        {
          name: {
            domainElem: "SmartGroup",
          },
          type: "Category",
          colour: "60",
          elements: "ALL",
        },
      ],
    },
  ],
  // at least one editor handles the mission
  // in case of more the end-user choose which
  // this action does not include undo (converter is required)
  editors: [
    {
      name: "BlocklyVPL",
      src: ``,
    },
  ],
};
