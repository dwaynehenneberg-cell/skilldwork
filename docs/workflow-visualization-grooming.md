# Workflow Visualization Grooming

## Confirmed decisions

- The visualization optimizes for fast understanding and progression to “Book a call”; technical completeness is secondary.
- Mobile uses one vertically connected story. Normal page scrolling highlights the current step; there are no previous/next controls or competing navigation modes.
- Mobile explanations appear below their related step and never cover the visualization.
- “Learn more” buttons and click-to-open detail states are removed.
- Desktop hover keeps a compact, non-blocking explanation beside the focused step. Copy is reduced to the minimum needed to understand that step.
- Each step has one shared explanation sentence of about 18 words or fewer. Desktop shows it on hover; mobile shows it below the active step. There are no explanatory bullet lists.
- The four top-level steps remain Build, Market, Fulfill, and Improve. The Sales Page is the bridge from Marketing into Fulfillment: `Marketing → Sales Page → Client Portal → Execution Workflow`.
- Every client-facing interface card uses the same shared visual component and exactly the same width and height. This includes the Sales Page, Client Portal/Onboarding, and Result view.
- Exactly three client-facing interfaces are shown: Sales Page, Client Portal, and Result. A separate confirmation or work-in-progress page is omitted because the Execution Workflow already communicates processing.
- The Client Portal collects the required inputs and contains a clear “Start service” action.
- Fulfillment follows `Client Portal → Execution Workflow → Result`. “Accept” completes the current Service Run. “Revise” follows one curved return path through the embedded Revision Agent and back into the Execution Workflow before producing a new Result.
- The Revision Agent is a small overlapping circle attached to the Execution Workflow, not a top-level step or part of the Improvement Loop.
- The public Improvement Loop shows the durable target state: `Completed Run → Improvement Agent → improved Execution Workflow`. It omits the temporary Service Provider approval gate to keep the explanation simple.
- Every completed Service Run feeds the Improvement Agent. Revision signals are especially useful, but they are not required, and a run does not have to produce an actual workflow change.
- Marketing repetition is represented by a compact “↻ Next client” marker rather than a third large return connector.
- Animation changes connector emphasis only. Nodes, interface cards, text, and layout never move or resize as part of the automated sequence.
- The initial sequence includes Build once. Subsequent cycles repeat the path from Marketing and Sales Page through Fulfillment and Improvement for the next Client.
- Animation starts only when the section enters the viewport. The recurring cycle begins specifically with the `Marketing → Sales Page` connector, lasts roughly 12–15 seconds, and pauses while the section or browser tab is not visible.
- The revision connector appears as an occasional example within the recurring sequence rather than implying that every Result needs revision.
- Mobile never auto-scrolls. Users retain normal scroll control, and `prefers-reduced-motion` disables automated connector animation.
- Visual grammar is fixed: black circles mark the Build/start action; yellow marks only Service Provider work; blue circles mark automated workflows or agents; neutral rectangles mark client-facing interfaces.
- Sales Page, Client Portal, and Result use the same interface component with exactly matching dimensions. Connector lines are neutral by default and turn blue only while active.
- Optional human-in-the-loop support appears as a small yellow badge beside the Execution Workflow with a short dashed connector. It is not a top-level step and does not activate during the standard animation.
- The public badge label is “Your input if needed”. It may wrap to two lines, but it is not abbreviated differently on mobile.
- Existing calls to action remain unchanged: “Book a call” in the hero, “Book a call” at Build, and “Build my workflow” below the visualization.
- Desktop uses one connected four-column canvas without horizontal scrolling. Fulfill receives the most width; Build, Market, and Improve are narrower. Step labels share one left-aligned top line.
- Revision and Improvement return connectors use dedicated lanes below the main chain and never cross interface cards or explanatory copy. The canvas becomes a vertical story below the tablet breakpoint.
- Shared step explanations are:
  - Build: “We turn your service into a Sales Page and automated delivery workflow.”
  - Market: “You focus on marketing while one link brings clients into the system.”
  - Fulfill: “Onboarding, delivery, results, and revisions run through one connected workflow.”
  - Improve: “Every completed client order helps the system deliver the next one better.”
- Desktop retains a restrained visual focus treatment: subtle lift, outline/ring, and shadow without resizing or layout reflow. Hover and keyboard focus show one non-interactive tooltip; there is no click, close, or pinned state.
- Touch devices do not use the tooltip. Normal scrolling controls the active highlight and reveals the shared sentence inline below the related step.
- The legend contains only three items: blue circle “Automated”, yellow circle “Handled by you”, and white rectangle “Client page”. It may wrap on mobile; there is no separate Build or loop legend.
- Automated connector animation pauses while a desktop step is hovered or keyboard-focused. When interaction ends, the recurring cycle restarts at `Marketing → Sales Page`.
- Mobile Fulfillment stacks Client Portal, Execution Workflow, and Result vertically. The Revision Agent overlaps the Workflow, the optional human-input badge attaches beside it, and a side return connector carries Revise back upward.
- Mobile uses no inner horizontal scrolling or scaled-down desktop canvas. Accept continues downward into Completed Run and Improve.
- Improve contains only a blue Improvement Agent with an incoming completed-run connector and one curved return connector to the Execution Workflow. Platform container, “Built in”, approval control, and workflow-version card are omitted.
- “Completed run” is a label on the Accept connector from Result to Improvement Agent, not a separate node.
- Client-interface micro-UI is fixed: Sales Page shows Offer 1–3 and “Choose offer”; Client Portal shows minimal inputs and “Start service”; Result shows a preview with outlined “Revise” and black “Accept”. Client actions are never yellow.
- Domain terms and agent responsibilities follow [`CONTEXT.md`](../CONTEXT.md).

## Implementation and acceptance

- Build and verify the static responsive structure before evaluating connector animation.
- Verify desktop and mobile layouts for overflow, overlapping content, equal interface dimensions, legible connector direction, and keyboard focus.
- Add connector-only animation without changing the verified layout.
- Run lint, type checking, production build, and visual browser checks before publishing to `main`.
