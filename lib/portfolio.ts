import { z } from "zod";
import { upgradeCatalog } from "./catalog.js";

const text = (max = 400) => z.string().trim().max(max);
const webUrl = z.string().trim().max(2000).refine(value => {
  if (!value) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
  catch { return false; }
}, "Usá una dirección completa que empiece con https://");
const mediaUrl = z.string().max(2000).refine(value => !value || /^\/assets\/semilla\/(library|editor|series|series-detail|pulpit|verse-preview)\.png$/.test(value) || /^\/media\/[a-f0-9-]+\.(png|jpg|webp|gif|pdf)$/.test(value) || webUrl.safeParse(value).success, "La dirección del archivo no es válida.");
export const studioPortraitUrl = "https://santi-apps-portfolio.laghisantiagonicolas.chatgpt.site/assets/santi-portrait-studio-v1.png";
// Replace the superseded portrait when reading existing content. New uploads stay editable.
const profilePhotoUrl = mediaUrl.transform(value => value === "/media/17d885f9-eef5-4b46-b09e-d4cdea828e2d.png" ? studioPortraitUrl : value);
export const demoTypes = ["tnt", "finance", "bible", "notes", "day", "semilla", "planner", "pantry", "gallery", "embed"] as const;
export const projectSchema = z.object({
  id: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  name: text(90).min(1, "Cada app necesita un nombre."),
  subtitle: text(120), category: text(60).min(1),
  status: z.enum(["Proyecto", "Publicado", "En desarrollo", "Prototipo"]),
  description: text(700), problem: text(2000), solution: text(2000), contribution: text(1600),
  features: z.array(text(120)).max(15), stack: z.array(text(60)).max(15),
  url: webUrl, repoUrl: webUrl, embedUrl: webUrl, coverUrl: mediaUrl,
  gallery: z.array(mediaUrl).max(6),
  color: z.string().regex(/^#[a-fA-F0-9]{6}$/),
  demoType: z.enum(demoTypes), visible: z.boolean(), featured: z.boolean(),
  previewMode: z.enum(["auto", "real", "embed", "gallery", "none"]).default("auto"),
  realApp: z.enum(["", "tnt", "finance", "day", "bible", "planner", "pantry"]).default(""),
});
export const portfolioSchema = z.object({
  catalogVersion: z.number().int().nonnegative().default(0),
  profile: z.object({
    name: text(60).min(1), role: text(120), headline: text(120).min(1), headlineAccent: text(120),
    intro: text(600), location: text(80), availability: text(120), aboutTitle: text(150),
    bio: text(2500), aboutDetail: text(2500), interests: z.array(text(80)).max(12), photoUrl: profilePhotoUrl,
    email: z.union([z.literal(""), z.string().trim().email().max(200)]),
    whatsapp: z.string().max(30).regex(/^[0-9+\s()-]*$/, "Usá solo el número de teléfono con código de país."),
    linkedin: webUrl, github: webUrl, cvUrl: mediaUrl,
    contactTitle: text(160), contactText: text(500), footer: text(180),
  }),
  sections: z.object({
    projectsTitle: text(120), projectsIntro: text(500), methodTitle: text(150), methodIntro: text(500),
    method: z.array(z.object({ title: text(100), text: text(500) })).length(3),
    about: z.boolean(), process: z.boolean(), contact: z.boolean(),
  }),
  theme: z.enum(["violet", "blue", "green", "rose", "amber"]),
  projects: z.array(projectSchema).max(100).superRefine((projects, ctx) => {
    if (new Set(projects.map(p => p.id)).size !== projects.length) ctx.addIssue({code:z.ZodIssueCode.custom,message:"Hay identificadores de apps repetidos."});
  }),
});
export type Project = z.infer<typeof projectSchema>;
export type PortfolioData = z.infer<typeof portfolioSchema>;
export const themes = [
  { id: "green", name: "Lima", color: "#cdff6b" },
  { id: "violet", name: "Violeta", color: "#bca2ff" },
  { id: "blue", name: "Azul", color: "#80b7ff" },
  { id: "rose", name: "Rosa", color: "#ffa0c0" },
  { id: "amber", name: "Ámbar", color: "#ffcc79" },
] as const;
const baseProject = { url: "", repoUrl: "", embedUrl: "", coverUrl: "", gallery: [], stack: [], visible: true, featured: false, previewMode: "auto" as const, realApp: "" as const };
const originalPortfolio: PortfolioData = {
  catalogVersion: 0,
  profile: {
    name: "Santi", role: "Creador de aplicaciones · Productos digitales", headline: "Hola, soy", headlineAccent: "Santi.",
    intro: "Diseño y desarrollo herramientas digitales que simplifican la vida. Me enfoco en crear productos útiles, simples y con una gran experiencia de uso.",
    location: "Argentina", availability: "Abierto a oportunidades", aboutTitle: "Detrás de cada app, una necesidad real.",
    bio: "Soy Santi, pastor de jóvenes y creador de aplicaciones. Mi fe y el trabajo con personas son parte de lo que me inspira a crear.",
    aboutDetail: "Me gusta transformar necesidades cotidianas en herramientas útiles: para una comunidad, para organizar las finanzas o para compartir mejor el día a día. Defino las ideas, pienso las funciones y trabajo el desarrollo con asistencia de IA, probando y ajustando cada experiencia.",
    interests: ["Crear herramientas útiles", "La comunidad", "Mi fe", "Organizar ideas"],
    photoUrl: studioPortraitUrl, email: "", whatsapp: "", linkedin: "", github: "", cvUrl: "",
    contactTitle: "Construyamos la próxima idea.",
    contactText: "Estoy buscando oportunidades para aportar mi manera de pensar, crear y resolver problemas. Si mi trabajo conecta con lo que necesitás, conversemos.",
    footer: "Hecho con ideas, propósito y muchas ganas de crear.",
  },
  sections: {
    projectsTitle: "Mis productos",
    projectsIntro: "Proyectos que nacen de lo cotidiano. Conocé su propósito y probá las apps conectadas con su código original.",
    methodTitle: "Mi enfoque", methodIntro: "Entender, construir, probar. Y volver a mejorar.",
    method: [
      { title: "Productos reales", text: "Que la gente use y disfrute." },
      { title: "Diseño simple y funcional", text: "Menos fricción, más acción." },
      { title: "Mejora continua", text: "Siempre hay una versión mejor." },
    ],
    about: true, process: true, contact: true,
  },
  theme: "green",
  projects: [
    { ...baseProject, id: "tnt", name: "TNT", subtitle: "Una comunidad, más conectada.", category: "Comunidad", status: "Proyecto", description: "Organizá tus tareas, proyectos y actividades en un solo lugar.", problem: "Coordinar actividades, equipos e información de una comunidad implica muchas personas y tareas diferentes.", solution: "Reunir esa organización en una app con módulos para distintas necesidades y accesos según la participación de cada persona.", contribution: "Idea del producto, definición de módulos y recorridos, seguimiento del desarrollo con asistencia de IA y revisión a partir del uso.", features: ["Actividades y equipos", "Organización por módulos", "Comunidad"], color: "#7756df", demoType: "tnt", featured: true },
    { ...baseProject, id: "biblia", name: "Biblia", subtitle: "Un espacio para leer y profundizar.", category: "Fe", status: "En desarrollo", description: "Leé, organizá y reflexioná con una experiencia simple y moderna.", problem: "Busco una forma cómoda de recorrer la Biblia y conectar la lectura con el estudio personal.", solution: "Una experiencia centrada en la lectura, con navegación por libros y capítulos. El proyecto continúa en desarrollo.", contribution: "Definición de la experiencia, elección de la dirección visual y desarrollo iterativo con asistencia de IA.", features: ["Lectura bíblica", "Libros y capítulos", "Diseño en evolución"], color: "#7485a4", demoType: "bible" },
    { ...baseProject, id: "finanzas", name: "Finanzas Pro", subtitle: "Más claridad para tu dinero.", category: "Finanzas", status: "Publicado", description: "Controlá tus ingresos, gastos y objetivos financieros.", problem: "Tener gastos, tarjetas y deudas en lugares distintos hace difícil entender qué corresponde pagar cada mes.", solution: "Unificar la información financiera en una experiencia que ayude a organizar el dinero y planificar el mes.", contribution: "Definición de necesidades, decisiones sobre organización de la información y seguimiento de mejoras con asistencia de IA.", features: ["Finanzas personales", "Planificación mensual", "Organización de gastos"], color: "#39816a", demoType: "finance" },
    { ...baseProject, id: "notas", name: "Bloc de notas", subtitle: "Que ninguna idea se pierda.", category: "Vida diaria", status: "Proyecto", description: "Tu espacio para pensar, escribir y organizar ideas sin distracciones.", problem: "Las ideas aparecen en cualquier momento y necesitan un lugar donde quedar guardadas.", solution: "Una app dedicada a escribir y reunir notas.", contribution: "Idea y definición de necesidades del proyecto, con desarrollo asistido por IA.", features: ["Notas e ideas", "Escritura simple"], color: "#a286cf", demoType: "notes" },
    { ...baseProject, id: "dia", name: "Día a Día", subtitle: "Organizarse también es compartir.", category: "Vida diaria", status: "Proyecto", description: "Una rutina más simple para organizar tareas y planes en pareja.", problem: "Compartir la vida también implica coordinar horarios, tareas y responsabilidades.", solution: "Una organización compartida con tareas, horarios y responsables para tener una visión en común.", contribution: "Definición de funciones y flujos de invitación, pruebas de la experiencia y mejoras con asistencia de IA.", features: ["Organización en pareja", "Tareas compartidas", "Horarios y responsables"], color: "#c68c46", demoType: "day" },
  ],
};
export const initialPortfolio = upgradeCatalog(originalPortfolio);
export function createProjectId(): string {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `app-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
}
export function newProject(): Project {
  return { ...baseProject, id: createProjectId(), name: "Nueva app", subtitle: "", category: "Otros", status: "En desarrollo", description: "", problem: "", solution: "", contribution: "", features: [], stack: [], gallery: [], color: "#7254e8", demoType: "gallery", visible: false };
}
export function publicPortfolio(data: PortfolioData): PortfolioData {
  return { ...data, projects: data.projects.filter(p => p.visible) };
}
