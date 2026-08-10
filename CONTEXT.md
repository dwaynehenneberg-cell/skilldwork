# Skilldwork Service Workflow

Skilldwork turns a service provider's expertise into a digital workflow that serves the provider's clients.

## Language

**Service Provider**:
The Skilldwork customer whose service is transformed into a digital workflow. The Service Provider remains responsible for marketing and designated human-in-the-loop decisions.
_Avoid_: Customer, seller, expert

**Client**:
The Service Provider's end customer who moves through the landing page, purchase, onboarding, service delivery, and revision flow.
_Avoid_: Customer, user, buyer

**Human-in-the-loop (HITL)**:
An optional intervention point where the Service Provider handles a question, exception, or revision before returning the work to the digital workflow. Whether HITL is used depends on the service and the Service Provider's chosen workflow design.
_Avoid_: Required approval, mandatory review

**Result**:
The concrete outcome promised to and received by the Client. Skilldwork services and their presentation are result-based.
_Avoid_: Package, generic deliverable

**Offer**:
A purchasable, result-based scope or variant presented to the Client on the landing page. Example diagrams label variants as Offer 1, Offer 2, and Offer 3.
_Avoid_: Package, tier

**Workflow Build**:
The initial step in which Skilldwork and the Service Provider create an automatable digital workflow and its result-based Sales Page. A booked call starts this step; the website presents its result, not whether the build process is currently manual or later self-serve.
_Avoid_: Bounty Agent, service execution

**Digital Service Execution**:
The repeatable Client flow from landing page and purchase through onboarding, workflow processing, optional HITL, revisions, and result delivery.
_Avoid_: Workflow Build, manual fulfillment

**Service Loop**:
The recurring cycle in which Service Provider marketing brings a Client into Digital Service Execution, the Result is delivered, and the released capacity returns to marketing for the next Client.
_Avoid_: Single order flow, funnel, Growth Loop

**Improvement Loop**:
The feedback cycle in which revisions from a Service Run produce a suggested workflow version, the Service Provider approves it, and the approved version returns to Digital Service Execution.
_Avoid_: Automatic live modification, Service Loop

**Sales Page**:
The result-based landing page where a Client understands the service, chooses an Offer, and starts the purchase flow. It is created as part of the Workflow Build.
_Avoid_: Shopify store, generic website

**Client Portal**:
The Client-facing web app for onboarding, status, result review, and revision requests during a Service Run.
_Avoid_: Landing page, CRM, Provider Workspace

**Provider Workspace**:
The Service Provider-facing web app for CRM, service operations, Client work, configurable workflow adjustments, and approval of suggested workflow versions.
_Avoid_: Client Portal, admin page

**Service Run**:
One Client's execution of the digital service from purchase and onboarding through processing, revisions, and completion.
_Avoid_: Workflow Build, client session

**Self-Improvement Agent**:
The workflow component that uses revision feedback from completed Service Runs to suggest a new workflow version that can reduce future revisions. A suggestion does not change the active workflow until the Service Provider approves it.
_Avoid_: Revision Agent, HITL
