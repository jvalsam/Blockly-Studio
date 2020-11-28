export const BlocklyCalendar = {
  name: "ec-blockly-calendar-event",
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
      name: "Calendar",
      type: "DomainStatic",
      colour: "75",
      elements: [
        "calendar_at",
        "calendar_at_top_bottom",
        "calendar_every",
        "calendar_every_top_bottom",
        "calendar_wait_then",
        "calendar_wait_then_top_bottom",
      ],
    },
    {
      name: "TimeAndDate",
      type: "DomainStatic",
      colour: "75",
      elements: [
        "specific_hour",
        "specific_day",
        "specific_month",
        "every_seconds",
        "every_hours",
        "every_minutes",
        "every_days",
        "every_months",
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
            }
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
