export const AutomationTask = {
  name: "ec-blockly-automation-task",
  items: [
    {
      type: "Predefined",
      elements: "ALL", // select: [{category:'catName',elems:[...]}, ...]
      colour: "65",
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
      name: "Automations",
      type: "Category",
      colour: "300",
      elements: [
        {
          name: "Basic Tasks",
          type: "Category",
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
          name: "Conditional Tasks",
          type: "Category",
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
          name: "Scheduled Tasks",
          type: "Category",
          elements: [
            {
              name: {
                domainElem: "ec-blockly-calendar-event",
                item: "invoke_calendar_task",
              },
              type: "Element",
            },
          ],
        }
      ]
    },
    {
      type: "Separator",
      gap: "200",
    },
    {
      name: "Smart Devices",
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
      name: "Smart Device Groups",
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
