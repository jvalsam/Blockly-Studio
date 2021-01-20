export const ActionImplementationDebug = {
  name: "ec-checks-expected-values",
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
        "when_times",
        "when_times_top_bottom",
        "when_after",
        "when_after_top_bottom",
        "break_continue_when",
        "logical_operators",
        "relational_operators",
        "changes",
      ],
    },
    {
      name: "Scheduler",
      type: "DomainStatic",
      colour: "75",
      elements: [
        "calendar_at",
        "calendar_at_top_bottom",
        "calendar_every",
        "calendar_every_top_bottom",
        "break_continue_every",
        "calendar_wait_then",
        "calendar_wait_then_top_bottom",
      ],
    },
    {
      name: "Time/Date",
      type: "DomainStatic",
      colour: "75",
      elements: [
        "specific_hour",
        "specific_day",
        "specific_month",
        "every_seconds",
        "every_minutes",
        "every_hours",
        "every_days",
        "every_months",
      ],
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
  ],
  editors: [
    {
      name: "BlocklyVPL",
      src: ``,
      style: [],
    },
  ],
};
