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

export type HomeDiagnostic = {
  signal: string;
  firstMove: string;
};

export type ClientStory = {
  context: string;
  action: string;
  outcome: string;
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
  name: string;
  initials: string;
  role: string;
  organization: string;
  status: "placeholder" | "provisional" | "approved";
  note: string;
  story?: ClientStory;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutTimelineItem = {
  year: string;
  title: string;
  summary: string;
};

export type Founder = {
  name: string;
  role: string;
  quote: string;
  imageSrc?: string;
  imageAlt?: string;
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

export const homeDiagnostics: HomeDiagnostic[] = [
  {
    signal: "Teams keep routing work through side spreadsheets, duplicate entry, and informal handoffs.",
    firstMove:
      "Map the real operating path, name the friction points, and decide what should be automated, simplified, or governed.",
  },
  {
    signal: "A promising initiative has sponsor support but no clear route from idea to implementation.",
    firstMove:
      "Shape the Working Group, decision points, and first executable slice so momentum has somewhere concrete to go.",
  },
  {
    signal: "Technology is already in place, but adoption, configuration, or ownership keeps stalling.",
    firstMove:
      "Clarify the business job, align the people closest to the work, and tune the tool around how the organization operates.",
  },
];

export const agileInnovationSteps: ProcessStep[] = [
  {
    title: "Problem",
    summary:
      "Name the operational or growth challenge in plain business terms before choosing a tool, platform, or plan.",
  },
  {
    title: "Ideation",
    summary:
      "Reframe assumptions and shape a practical direction around the organization's constraints, capacity, and goals.",
  },
  {
    title: "Collaboration",
    summary:
      "Bring the Working Group into the same picture so decisions, implementation needs, and lived process knowledge stay connected.",
  },
  {
    title: "Solution",
    summary:
      "Turn the selected path into a Tailored Solution through strategy, coordination, and hands-on implementation.",
  },
  {
    title: "Iteration",
    summary:
      "Use feedback and learning to refine the work before it becomes the new way of operating.",
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
      "Work depends on informal knowledge, duplicated effort, or handoffs that are hard to see until something breaks.",
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
      "Define the operating conditions, decision points, constraints, and friction before recommending a tool, platform, or workflow.",
  },
  {
    title: "Design the path",
    summary:
      "Shape a practical solution direction around the organization's needs and the people closest to the work.",
  },
  {
    title: "Carry it into implementation",
    summary:
      "Coordinate and build where it matters, carrying the work through launch without becoming detached development capacity.",
  },
];

export const challengeMapOutputs: ApproachItem[] = [
  {
    title: "Operating map",
    summary:
      "The real path of the work, including handoffs, tools, ownership, constraints, and points of friction.",
  },
  {
    title: "Working group shape",
    summary:
      "The decision-makers, operators, implementers, and specialists needed for the challenge at hand.",
  },
  {
    title: "First executable slice",
    summary:
      "A practical starting move that can be built, configured, coordinated, or tested without losing the larger strategy.",
  },
];

export const workingGroupMembers: ApproachItem[] = [
  {
    title: "Client decision-makers",
    summary:
      "Leaders who connect the work to business direction, priorities, constraints, and tradeoffs.",
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
      "I have a passion for finding innovative ways to use technology. Working with eCongruity as a strategic partner has created a path forward to new markets.",
    name: "Paul Nutting",
    initials: "PN",
    role: "Founder",
    organization: "Tap Cloud",
    status: "provisional",
    note: "Named Tap Cloud testimonial. Keep provisional until approved for publication.",
    story: {
      context: "A founder needed a practical path from technical possibility to market expansion.",
      action:
        "eCongruity worked as a strategic partner, connecting product direction with implementation judgment.",
      outcome: "The work created a clearer path toward new markets.",
    },
  },
  {
    quote:
      "eCongruity helped us streamline process and deliver a more effective immersive digital experience.",
    name: "Jere Stocks",
    initials: "JS",
    role: "President",
    organization: "LMI North America",
    status: "provisional",
    note: "Named testimonial. Keep provisional until approved for publication.",
    story: {
      context: "Process and learning delivery needed to work together instead of living as separate efforts.",
      action:
        "eCongruity streamlined operational process and helped develop the online learning management system.",
      outcome: "The organization could deliver a more effective immersive digital experience.",
    },
  },
  {
    quote:
      "The process was easy, and development moved much faster than I anticipated.",
    name: "Beth Miller",
    initials: "BM",
    role: "Director of Performance Nutrition",
    organization: "UCLA",
    status: "provisional",
    note: "Named testimonial. Keep provisional until approved for publication.",
    story: {
      context: "A performance nutrition team needed development support without losing momentum.",
      action:
        "eCongruity kept the process moving with hands-on implementation and responsive collaboration.",
      outcome: "The development process moved faster than expected.",
    },
  },
];

export const aboutStats: AboutStat[] = [
  { value: "12+", label: "Years of Experience" },
  { value: "50+", label: "Projects Delivered" },
  { value: "3", label: "Markets Served" },
  { value: "100%", label: "Client Focus" },
];

export const aboutTimeline: AboutTimelineItem[] = [
  {
    year: "2012",
    title: "Founded in Montana",
    summary:
      "eCongruity opens its doors with a focus on strategic process design and mobile innovation.",
  },
  {
    year: "2015",
    title: "First Enterprise CMS",
    summary:
      "Delivered our first large-scale learning management system, setting the foundation for our LMS practice.",
  },
  {
    year: "2018",
    title: "Agile Innovation Framework",
    summary:
      "Codified our proprietary 5-step agile innovation process, now used across all engagements.",
  },
  {
    year: "2022",
    title: "US Expansion",
    summary:
      "Expanded our client base nationally, partnering with organizations from UCLA to Tap Cloud.",
  },
  {
    year: "Today",
    title: "Nature × Technology",
    summary:
      "Doubling down on our mission — connecting people, process and technology with purpose and sustainability.",
  },
];

export const founders: Founder[] = [
  {
    name: "D. Scott Martell",
    role: "CEO/Founder",
    quote:
      "You cannot discover new oceans unless you have the courage to lose sight of the shore. (Anonymous)",
    imageSrc: "/images/team/team-member-06.png",
    imageAlt: "Portrait of D. Scott Martell, CEO and founder.",
  },
  {
    name: "Angie Martell",
    role: "COO/Co-Founder",
    quote: "A well designed process makes the right thing the easy thing.",
    imageSrc: "/images/team/team-member-05.png",
    imageAlt: "Portrait of Angie Martell, COO and co-founder.",
  },
  {
    name: "Colin Nygaard",
    role: "VP Business Development",
    quote:
      "Like water shaping stone, great process design leaves everything better than it found it.",
    imageSrc: "/images/team/team-member-01.png",
    imageAlt: "Portrait of Colin Nygaard, VP business development.",
  },
  {
    name: "Colton Schmacher",
    role: "Senior Program Manager",
    quote:
      "A forest thrives because every element supports the others. Great client work is no different.",
    imageSrc: "/images/team/team-member-04.png",
    imageAlt: "Portrait of Colton Schmacher, senior program manager.",
  },
  {
    name: "Amanda Cruz",
    role: "VP Strategic Partnerships",
    quote: "Trusting the path, building with purpose, and connecting with heart.",
    imageSrc: "/images/team/team-member-02.png",
    imageAlt: "Portrait of Amanda Cruz, VP strategic partnerships.",
  },
  {
    name: "Jim Aumack",
    role: "VP Marketing",
    quote:
      "Data reveals the invisible currents, the patterns that guide sustainable growth.",
    imageSrc: "/images/team/team-member-03.png",
    imageAlt: "Portrait of Jim Aumack, VP marketing.",
  },
];
