export type NavItem = {
  label: string;
  href: string;
};

export type Capability = {
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
