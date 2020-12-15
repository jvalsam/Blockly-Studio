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
      name: "Automation Tasks",
      type: "Category",
      colour: "300",
      elements: [
        {
          name: {
            domainElem: "ec-automation-task",
            item: "invoke_task",
          },
          type: "Element",
        },
      ],
    },
    {
      name: "Calendar Automation Tasks",
      type: "Category",
      colour: "300",
      elements: [
        {
          name: {
            domainElem: "ec-blockly-calendar-event",
            item: "invoke_calendar_task",
          },
          type: "Element",
        },
      ],
    },
    {
      name: "Conditional Automation Tasks",
      type: "Category",
      colour: "300",
      elements: [
        {
          name: {
            domainElem: "ec-blockly-conditional-event",
            item: "invoke_conditional_task",
          },
          type: "Element",
        },
      ],
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
