/**
 * Page copy that belongs to the design rather than to site settings. Facts come
 * from the previous portfolio, Anil's GitHub profile and NepCart's source code.
 */

/** One entry per line. */
export const headline = ["I build reliable", "software for", "the real world."];

export const approach = [
  { title: "Understand the problem", text: "Start with what people need to do and the rules the data has to follow." },
  { title: "Design the solution", text: "Settle the data model, the boundaries between parts, and how they talk to each other." },
  { title: "Build it", text: "Write clear code in focused pieces, with validation and permissions on the server." },
  { title: "Test it", text: "Check the real workflow, including the paths where something goes wrong." },
  { title: "Improve it", text: "Use what was learned to simplify the code and make the product better." },
];

export const philosophy =
  "I put the emphasis on clean architecture, clear code and continuous improvement. A payment is not complete because a browser says so, and an order is not saved until every part of it is.";

export const interests = ["Backend architecture", "Database design", "API development", "Deploying real-world applications"];

/** Labels are only shown when the skill is listed in site settings. */
export const expertise = [
  {
    title: "Backend engineering",
    text: "Application logic, authentication and services, divided into focused parts that stay maintainable as a project grows.",
    skills: ["Python", "Django"],
  },
  {
    title: "Databases and data modeling",
    text: "Relational models whose constraints hold the rules, with queries and migrations that keep data consistent.",
    skills: ["PostgreSQL", "MySQL", "SQLite", "Django ORM"],
  },
  {
    title: "APIs and system architecture",
    text: "REST endpoints with clear contracts, and boundaries that let each part of a system change on its own.",
    skills: ["REST APIs", "Django REST Framework"],
  },
  {
    title: "DevOps and deployment",
    text: "Containers, version control and repeatable releases, from a local machine to production.",
    skills: ["Docker", "Linux", "Git", "GitHub", "Vercel"],
  },
  {
    title: "Frontend development",
    text: "Responsive interfaces that connect cleanly to the systems behind them.",
    skills: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Bootstrap"],
  },
];
