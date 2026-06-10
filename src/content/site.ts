export type NavItem = {
  label: string;
  href: string;
};

export type Capability = {
  title: string;
  summary: string;
};

export type HomePath = {
  title: string;
  summary: string;
  href: string;
  label: string;
};

export type ProcessStep = {
  title: string;
  summary: string;
};

export type ApproachItem = {
  title: string;
  summary: string;
};

export type Testimonial = {
  quote: string;
  attribution: string;
  status: "placeholder" | "provisional" | "approved";
};

export type Founder = {
  name: string;
  role: string;
  bio: string;
  localTexture: string;
};

export const site = {
  name: "eCongruity",
  category: "Strategic Innovation Studio",
  positioning:
    "Connecting people, process, and technology for real-time business.",
  outcome:
    "A clear path to executable growth through strategy-to-implementation engagements and hands-on implementation.",
  contactCta: "Start the Conversation",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Approach", href: "/approach/" },
  { label: "Capabilities", href: "/capabilities/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const capabilities: Capability[] = [
  {
    title: "Workflow automation",
    summary:
      "Clarify repeatable work and reduce friction across teams, systems, and handoffs.",
  },
  {
    title: "App development",
    summary:
      "Shape practical digital tools around the organization's operating context.",
  },
  {
    title: "Enterprise CMS",
    summary:
      "Improve content operations where governance, structure, and scale matter.",
  },
  {
    title: "Learning management",
    summary:
      "Connect training, knowledge sharing, and implementation support into one working path.",
  },
  {
    title: "Mobile strategy",
    summary:
      "Decide where mobile experiences can support operations, growth, or service delivery.",
  },
  {
    title: "Process improvement",
    summary:
      "Make unclear processes visible, actionable, and easier to sustain after launch.",
  },
  {
    title: "Organizational efficiencies",
    summary:
      "Untangle disconnected work so leaders can direct energy toward durable business change.",
  },
  {
    title: "Innovation-as-a-service",
    summary:
      "Bring a flexible working group to stalled ideas that need strategy and execution momentum.",
  },
];

export const featuredCapabilities: Capability[] = [
  capabilities[0],
  capabilities[5],
  capabilities[7],
];

export const agileInnovationSteps: ProcessStep[] = [
  {
    title: "Problem",
    summary:
      "Clarify the operational or growth challenge before prescribing a tool, platform, or plan.",
  },
  {
    title: "Ideation",
    summary:
      "Reframe assumptions and shape a practical direction around the organization's real constraints.",
  },
  {
    title: "Collaboration",
    summary:
      "Align the Working Group so decisions, implementation needs, and lived process knowledge stay connected.",
  },
  {
    title: "Solution",
    summary:
      "Carry the selected path into a Tailored Solution through strategy, coordination, and hands-on implementation.",
  },
  {
    title: "Iteration",
    summary:
      "Use feedback and learning to refine the work before it hardens into a way of operating.",
  },
  {
    title: "Growth",
    summary:
      "Leave the organization with a clearer foundation for durable business change after launch.",
  },
];

export const approachComplexitySignals: ApproachItem[] = [
  {
    title: "Unclear processes",
    summary:
      "The work depends on informal knowledge, duplicated effort, or handoffs that are hard to see until something breaks.",
  },
  {
    title: "Disconnected systems",
    summary:
      "Teams are moving between tools, spreadsheets, and platforms without a shared operating picture.",
  },
  {
    title: "Underused technology",
    summary:
      "Existing tools have potential, but the organization needs a clearer strategy for adoption, configuration, or replacement.",
  },
  {
    title: "Stalled ideas",
    summary:
      "A promising initiative has enough support to matter, but not enough structure to move from concept to execution.",
  },
];

export const engagementModel: ApproachItem[] = [
  {
    title: "Clarify the challenge",
    summary:
      "Start by defining the operational or growth complexity in plain business terms before recommending a tool, platform, or workflow.",
  },
  {
    title: "Design the path",
    summary:
      "Shape a practical solution direction around the organization's needs, constraints, decision points, and people closest to the work.",
  },
  {
    title: "Carry it into implementation",
    summary:
      "Provide hands-on implementation where it matters, coordinating the work through launch without becoming detached development capacity.",
  },
];

export const workingGroupMembers: ApproachItem[] = [
  {
    title: "Client decision-makers",
    summary:
      "Leaders who can connect the work to business direction, priorities, and constraints.",
  },
  {
    title: "People closest to the work",
    summary:
      "Operators, team leads, or subject-matter experts who understand the real process and daily friction.",
  },
  {
    title: "eCongruity strategists and implementers",
    summary:
      "Guides who keep strategy, coordination, and hands-on execution connected as one engagement.",
  },
  {
    title: "Outside specialists or vendors",
    summary:
      "Additional expertise brought in when the solution path calls for it, not as a fixed bench.",
  },
];

export const homePaths: HomePath[] = [
  {
    title: "Approach",
    summary:
      "See how Agile Innovation moves from problem definition through collaboration, solution delivery, and growth.",
    href: "/approach/",
    label: "Explore Approach",
  },
  {
    title: "Capabilities",
    summary:
      "Review example capabilities that can be shaped into a Tailored Solution, not selected as preset choices.",
    href: "/capabilities/",
    label: "View Capabilities",
  },
  {
    title: "About",
    summary:
      "Understand the founder-led judgment behind eCongruity's strategy-to-implementation work.",
    href: "/about/",
    label: "Meet eCongruity",
  },
  {
    title: "Contact",
    summary:
      "Start with the challenge you are trying to solve. Timeline and cost come later, as part of strategy.",
    href: "/contact/",
    label: "Start the Conversation",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "eCongruity helped us move from a fuzzy operational challenge to an implemented path our team could actually use.",
    attribution: "Client story placeholder",
    status: "placeholder",
  },
  {
    quote:
      "The work connected business judgment with hands-on implementation, which kept the solution grounded.",
    attribution: "Client story placeholder",
    status: "placeholder",
  },
  {
    quote:
      "They brought structure to a cross-functional problem without forcing us into a rigid process.",
    attribution: "Client story placeholder",
    status: "placeholder",
  },
];

export const founders: Founder[] = [
  {
    name: "Founder bio placeholder",
    role: "Founder-led strategy and implementation",
    bio:
      "A concise credibility profile will describe the judgment, experience, and role behind eCongruity's strategy-to-implementation work.",
    localTexture:
      "Replaceable local texture can be added once approved founder details are available.",
  },
];
