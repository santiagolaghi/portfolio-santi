"use client";

import { useEffect, useRef, useState, lazy, Suspense, type CSSProperties } from "react";
import {
  ArrowRight, ArrowUpRight, BarChart3, BriefcaseBusiness, Check, CheckCircle2,
  ChevronRight, Download, ExternalLink, Heart, Home, LayoutGrid, Menu,
  MessageCircle, Monitor, Pencil, Plus, RotateCcw, Smartphone, Sparkles, UserRound, Wrench, X, Zap,
} from "lucide-react";
import { publicPortfolio, type PortfolioData, type Project } from "@/lib/portfolio";
import { AppIcon } from "./Artwork";
import ReferenceArtwork, { ProductGlyph, WorldMap } from "./ReferenceArtwork";
import HeroScene from "./HeroScene";
import ColorModeToggle from "./ColorModeToggle";
import Modal from "./Modal";
import { Github, Linkedin } from "./BrandIcons";
import { previewKind, realDemoFor, realApps } from "@/lib/real-demos";

const Demo = lazy(() => import("./Demos"));
const Editor = lazy(() => import("./Editor"));

function Status({ value }: { value: string }) {
  const kind = value === "En desarrollo" ? "developing" : value === "Publicado" ? "published" : "";
  return <span className={"status-badge " + kind}><i />{value}</span>;
}
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [reset, setReset] = useState(0);
  const [viewport, setViewport] = useState<"mobile" | "desktop">("mobile");
  const kind = previewKind(project), realApp = realDemoFor(project);
  return (
    <Modal open label={project.name} onClose={onClose} className="project-modal">
      <div className={"project-dialog " + (kind === "real" || kind === "embed" ? "connected-project" : "")} style={{ "--app-color": project.color } as CSSProperties}>
        <header className="project-dialog-header">
          <div><AppIcon type={project.demoType} /><span><b>{project.name}</b><small>{project.category}</small></span></div>
          <button className="icon-button close-button" onClick={onClose} aria-label="Cerrar proyecto"><X size={21} /></button>
        </header>
        <div className="project-dialog-body">
          <div className="project-story">
            <Status value={project.status} />
            <h2>{project.subtitle || project.name}</h2>
            <p className="story-lead">{project.description}</p>
            {[
              ["El punto de partida", project.problem],
              ["La propuesta", project.solution],
              ["Mi aporte", project.contribution],
            ].map(([title, text]) => text && <section key={title}><h3>{title}</h3><p>{text}</p></section>)}
            {project.features.some(Boolean) && <section><h3>En este proyecto</h3><div className="project-tags">
              {project.features.filter(Boolean).map((feature, index) => <span key={index}><Check size={12} />{feature}</span>)}
            </div></section>}
            {project.stack.some(Boolean) && <section><h3>Tecnologías utilizadas</h3><div className="project-tags">
              {project.stack.filter(Boolean).map((tech, index) => <span key={index}>{tech}</span>)}
            </div></section>}
            <div className="story-actions">
              {project.url && <a className="button primary" href={project.url} target="_blank" rel="noopener noreferrer">Abrir app real<ExternalLink size={15} /></a>}
              {project.repoUrl && <a className="button secondary" href={project.repoUrl} target="_blank" rel="noopener noreferrer"><Github size={15} />Ver código</a>}
            </div>
          </div>
          <div className={"project-playground viewport-" + viewport}>
            <div className="playground-header">
              <span><i />{kind === "real" ? "APP ORIGINAL · MODO DE PRUEBA" : kind === "embed" ? "APP ORIGINAL · VISTA INTEGRADA" : kind === "gallery" ? (project.demoType === "semilla" ? "CAPTURAS REALES · ANDROID" : "CAPTURAS DEL PROYECTO") : "PENDIENTE DE CONECTAR"}</span>
              {(kind === "real" || kind === "embed") && <div className="preview-tools"><div className="viewport-switch" aria-label="Tamaño de la vista previa"><button className={viewport === "mobile" ? "active" : ""} aria-pressed={viewport === "mobile"} aria-label="Vista móvil" onClick={() => setViewport("mobile")}><Smartphone size={15} /><span>Móvil</span></button><button className={viewport === "desktop" ? "active" : ""} aria-pressed={viewport === "desktop"} aria-label="Vista de escritorio" onClick={() => setViewport("desktop")}><Monitor size={15} /><span>Escritorio</span></button></div><button className="icon-button" aria-label="Reiniciar demo" title="Reiniciar demo" onClick={() => setReset(value => value + 1)}><RotateCcw size={15} /></button></div>}
            </div>
            <div className="real-device-viewport"><div className={"device-frame " + (kind === "real" || kind === "embed" ? "original-device" : "")}>
                <div className="device-camera" />
                <Suspense fallback={<div className="demo-loading">Abriendo app…</div>}><Demo key={reset} project={project} /></Suspense>
            </div></div>
            <p className="playground-note">
              {kind === "real" ? "Pantallas y lógica originales, con datos de prueba. Los cambios duran esta sesión. El ingreso, la sincronización y los servicios externos están disponibles en la app publicada."
                : kind === "embed" ? "Esta vista carga la app desde la dirección configurada."
                  : kind === "gallery" ? project.demoType === "semilla" ? "Capturas reales de la app nativa para Android. Recorré la biblioteca, el editor, las series y el modo púlpito con las flechas." : "Capturas y contenido del proyecto." : "Falta vincular la versión original de esta app."}
              {realApp && <a className="preview-source" href={realApps[realApp].url} target="_blank" rel="noopener noreferrer">Fuente: {realApps[realApp].source}<ExternalLink size={11}/></a>}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ProjectCard({ app, onOpen }: { app: Project; onOpen: () => void }) {
  const kind = previewKind(app);
  return <article className={"project-card " + (app.featured ? "featured" : "")} data-demo={app.demoType}
    style={{ "--app-color": app.color } as CSSProperties}>
    <div className="project-glow" aria-hidden="true" />
    <div className="project-card-copy">
      <div className="project-title-row"><ProductGlyph type={app.demoType} /><h3><button onClick={onOpen}>{app.name}</button></h3></div>
      <p>{app.description || app.subtitle}</p>
      <button className="project-demo-button" onClick={onOpen}>{kind === "real" || kind === "embed" ? "Probar app" : app.demoType === "semilla" ? "Ver app Android" : "Ver proyecto"}<ArrowRight size={14} /></button>
      {app.status === "En desarrollo" && <span className="project-state">En desarrollo</span>}
    </div>
    <button className="project-art-button" onClick={onOpen} aria-label={"Ver y probar " + app.name}>
      <ReferenceArtwork project={app} />
    </button>
    <span className="card-demo-label">{kind === "real" ? "App original" : kind === "embed" ? "App integrada" : kind === "gallery" ? "Capturas reales" : "Vista previa por conectar"}</span>
  </article>;
}

function DetailModal({ kind, data, canEdit, onClose, onEdit }: {
  kind: "about" | "process" | "contact"; data: PortfolioData; canEdit: boolean;
  onClose: () => void; onEdit: (tab: string) => void;
}) {
  const p = data.profile;
  const hasContact = !!(p.email || p.whatsapp || p.linkedin || p.github);
  const title = kind === "about" ? "Un poco sobre mí" : kind === "process" ? data.sections.methodTitle : p.contactTitle;
  return <Modal open label={title} onClose={onClose} className="detail-modal">
    <div className="detail-panel">
      <header><span>{kind === "about" ? <UserRound size={20} /> : kind === "process" ? <Zap size={20} /> : <MessageCircle size={20} />}{title}</span>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
      </header>
      {kind === "about" ? <div className="detail-body">
        <h2>{p.aboutTitle}</h2><p className="detail-lead">{p.bio}</p><p>{p.aboutDetail}</p>
        <div className="interest-tags">{p.interests.filter(Boolean).map((interest, i) => <span key={i}>{interest}</span>)}</div>
        {p.cvUrl && <a className="button primary" href={p.cvUrl} target="_blank" rel="noopener noreferrer"><Download size={16} />Ver mi CV</a>}
      </div> : kind === "process" ? <div className="detail-body">
        <p className="detail-lead">{data.sections.methodIntro}</p>
        {data.sections.method.map((step, i) => <section key={i}><span className="detail-step">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></section>)}
      </div> : <div className="detail-body">
        {p.availability && <span className="availability"><i />{p.availability}</span>}<p className="detail-lead">{p.contactText}</p>
        <div className="contact-actions">
          {p.email && <a className="button primary" href={"mailto:" + p.email}>Escribime<ArrowUpRight size={17} /></a>}
          {p.whatsapp && <a className="button secondary" href={"https://wa.me/" + p.whatsapp.replace(/\D/g, "")} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />WhatsApp</a>}
          {p.linkedin && <a className="button secondary" href={p.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={17} />LinkedIn</a>}
          {p.github && <a className="button secondary" href={p.github} target="_blank" rel="noopener noreferrer"><Github size={17} />GitHub</a>}
          {p.cvUrl && <a className="button secondary" href={p.cvUrl} target="_blank" rel="noopener noreferrer"><Download size={17} />Mi CV</a>}
        </div>
        {!hasContact && (canEdit ? <div className="missing-contact"><p>Completá tu contacto para que puedan encontrarte.</p>
          <button className="button primary" onClick={() => { onClose(); onEdit("contact"); }}>Agregar mi contacto<ArrowRight size={16} /></button>
        </div> : <p className="contact-missing">Los medios de contacto todavía no están publicados.</p>)}
      </div>}
    </div>
  </Modal>;
}

export default function Portfolio({ initialData, canEdit }: { initialData: PortfolioData; canEdit: boolean }) {
  const [published, setPublished] = useState(initialData);
  const [preview, setPreview] = useState<PortfolioData | null>(null);
  const [editor, setEditor] = useState(false);
  const [editorTab, setEditorTab] = useState("profile");
  const [project, setProject] = useState<Project | null>(null);
  const [detail, setDetail] = useState<"about" | "process" | "contact" | null>(null);
  const [filter, setFilter] = useState("Todos");
  const [expanded, setExpanded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const menuButton = useRef<HTMLButtonElement>(null);
  const data = preview ? publicPortfolio(preview) : published;
  const p = data.profile;
  const apps = [...data.projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const categories = ["Todos", ...new Set(apps.map(app => app.category))];
  const activeFilter = categories.includes(filter) ? filter : "Todos";
  const shown = apps.filter(app => !expanded || activeFilter === "Todos" || app.category === activeFilter);
  const hasContact = !!(p.email || p.whatsapp || p.linkedin || p.github);
  const openEditor = (tab = "profile") => {
    setEditorTab(tab); setEditor(true); setMenu(false); setDetail(null);
  };

  useEffect(() => {
    if (canEdit && new URLSearchParams(window.location.search).has("editar")) setEditor(true);
  }, [canEdit]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (entry) setActiveSection(entry.target.id);
    }, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
    document.querySelectorAll("[data-nav-section]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menu) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenu(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [menu]);

  const navigateDetail = (kind: "about" | "process" | "contact") => {
    setDetail(kind); setMenu(false); setActiveSection(kind);
  };

  return <div className={"portfolio " + (preview ? "is-draft-preview" : "")} data-theme={data.theme}>
    <a className="skip-link" href="#contenido">Ir al contenido</a>
    {preview && <div className="draft-preview-bar">
      <span><Pencil size={14} />Vista previa del borrador · todavía sin aplicar</span>
      <button onClick={() => setPreview(null)}>Volver al editor<ArrowRight size={15} /></button>
    </div>}
    <main id="contenido">
      <div className="showcase">
        <header className="site-header">
          <a href="#inicio" className="brand" aria-label={"Portfolio de " + p.name + ", inicio"}><span>Portfolio</span><i /></a>
          <button ref={menuButton} className="icon-button menu-toggle" aria-expanded={menu} aria-controls="portfolio-nav"
            aria-label={menu ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenu(value => !value)}>{menu ? <X size={23} /> : <Menu size={23} />}</button>
          <nav id="portfolio-nav" className={"site-nav " + (menu ? "menu-open" : "")} aria-label="Navegación principal">
            <a href="#inicio" className={activeSection === "inicio" ? "active" : ""} onClick={() => { setActiveSection("inicio"); setMenu(false); }}><Home size={18} /><span>Inicio</span></a>
            <a href="#proyectos" className={activeSection === "proyectos" ? "active" : ""} onClick={() => { setActiveSection("proyectos"); setMenu(false); }}><LayoutGrid size={18} /><span>Proyectos</span></a>
            {data.sections.about && <button className={activeSection === "about" ? "active" : ""} onClick={() => navigateDetail("about")}><BriefcaseBusiness size={18} /><span>Experiencia</span></button>}
            {data.sections.process && <button className={activeSection === "process" ? "active" : ""} onClick={() => navigateDetail("process")}><Wrench size={18} /><span>Tech</span></button>}
            {data.sections.contact && <button className={activeSection === "contact" ? "active" : ""} onClick={() => navigateDetail("contact")}><MessageCircle size={18} /><span>Contacto</span></button>}
          </nav>
          <div className="sidebar-scenery" aria-hidden="true" />
          <p className="sidebar-quote">“Ideas que se<br />convierten<br />en herramientas<br />reales.”<i /></p>
          <div className="sidebar-bottom"><p>Desde {p.location || "una idea"}<br />para el mundo.</p>
            {canEdit && !preview && <button className="editor-trigger icon-button" onClick={() => openEditor()} aria-label="Editar portfolio" title="Editar portfolio"><Pencil size={16} /></button>}
          </div>
          <ColorModeToggle className="header-color-mode"/>
        </header>
        <div className="display-column">
          <section className="hero" id="inicio" data-nav-section>
            <div className="hero-copy">
              <span className="eyebrow hero-role"><i />{p.role}</span>
              <h1>{p.headline} <span>{p.headlineAccent}</span></h1>
              <p>{p.intro}</p>
              <div className="hero-buttons">
                <a className="button primary" href="#proyectos">Ver proyectos<ArrowRight size={19} /></a>
                {data.sections.contact && <button className="button secondary" onClick={() => navigateDetail("contact")}><MessageCircle size={18} />Trabajemos juntos</button>}
                {!data.sections.contact && p.cvUrl && <a className="button secondary" href={p.cvUrl} target="_blank" rel="noopener noreferrer"><Download size={17} />Mi CV</a>}
              </div>
            </div>
            <HeroScene profile={p} />
          </section>
          <section className="projects-section" id="proyectos" data-nav-section>
            <div className="projects-heading"><h2><LayoutGrid size={23} />{data.sections.projectsTitle}</h2>
              <div>{canEdit && !preview && <button className="add-project-public icon-button" onClick={() => openEditor("projects")} aria-label="Sumar otra app a mi portfolio" title="Sumar otra app"><Plus size={19} /></button>}
                <button className="view-all" aria-expanded={expanded} aria-controls="all-projects" onClick={() => { setExpanded(value => !value); setFilter("Todos"); }}>{expanded ? "Ocultar filtros" : "Ver todos"}<ArrowRight size={15} />{!expanded && apps.length > 5 && <small>{apps.length}</small>}</button></div>
            </div>
            {expanded && <div className="projects-toolbar"><p>{data.sections.projectsIntro}</p><div className="project-filters" aria-label="Filtrar proyectos">
              {categories.map(category => <button className={activeFilter === category ? "active" : ""} key={category} onClick={() => setFilter(category)} aria-pressed={activeFilter === category}>{category}</button>)}
            </div><span className="project-count" role="status">{shown.length} proyectos</span></div>}
            <div id="all-projects" className="project-grid">{shown.map(app => <ProjectCard key={app.id} app={app} onOpen={() => setProject(app)} />)}</div>
            {shown.length === 0 && <p className="empty-projects">Próximamente, nuevas ideas en este espacio.</p>}
          </section>
        </div>
      </div>
      <section className="overview-grid" aria-label="Conocé mi forma de crear">
        {data.sections.about && <article className="overview-panel overview-about" id="sobre-mi">
          <header><h2><UserRound size={23} />Un poco sobre mí</h2><button className="icon-button" aria-label="Más sobre mí" onClick={() => navigateDetail("about")}><ChevronRight size={16} /></button></header>
          <p>{p.bio}</p><div className="interest-tags">{p.interests.filter(Boolean).map((interest, i) => <span key={i}>{i === 0 ? <CheckCircle2 size={12} /> : i === 1 ? <Heart size={12} /> : <Sparkles size={12} />}{interest}</span>)}</div>
        </article>}
        {data.sections.process && <article className="overview-panel overview-method" id="mi-proceso">
          <header><h2><Zap size={23} />{data.sections.methodTitle}</h2><button className="icon-button" aria-label="Más sobre mi enfoque" onClick={() => navigateDetail("process")}><ChevronRight size={16} /></button></header>
          <div className="method-mini-grid">{data.sections.method.map((step, i) => <button key={i} className={"method-mini method-" + i} onClick={() => navigateDetail("process")}>
            <span className="method-mini-icon">{i === 0 ? <Sparkles size={17} /> : i === 1 ? <UserRound size={17} /> : <RotateCcw size={17} />}</span>
            <span><b>{step.title}</b><small>{step.text}</small></span>
          </button>)}</div>
        </article>}
        <article className="overview-panel overview-world"><WorldMap /><h2><BarChart3 size={24} /><span>Desde {p.location || "una idea"}<br />al mundo.</span></h2><p>Creando herramientas digitales<br />para una vida más simple,<br />productiva y con más libertad.</p></article>
      </section>
    </main>
    <footer className="site-footer"><span>{p.footer}</span><div><span>© {new Date().getFullYear()} {p.name}</span>
      {p.cvUrl && <a href={p.cvUrl} target="_blank" rel="noopener noreferrer"><Download size={13} />Mi CV</a>}
      {data.sections.contact && (hasContact || canEdit) && <button onClick={() => navigateDetail("contact")}>Contacto<ArrowUpRight size={13} /></button>}
      {canEdit ? <button onClick={() => openEditor()}>Editar portfolio<Pencil size={12} /></button>
        : <a href="https://santi-apps-portfolio.laghisantiagonicolas.chatgpt.site/signin-with-chatgpt?return_to=%2F%3Feditar%3D1" target="_top" className="owner-login">Acceso del propietario</a>}
    </div></footer>
    {project && <ProjectModal key={project.id} project={project} onClose={() => setProject(null)} />}
    {detail && <DetailModal kind={detail} data={data} canEdit={canEdit} onClose={() => setDetail(null)} onEdit={openEditor} />}
    {editor && <Suspense fallback={<div className="opening-editor" role="status">Abriendo tu editor…</div>}>
      <Editor open={!preview} initialTab={editorTab} onClose={() => setEditor(false)}
        onPreview={draft => { setProject(null); setDetail(null); setPreview(draft); window.scrollTo({ top: 0 }); }}
        onPublished={next => setPublished(publicPortfolio(next))} />
    </Suspense>}
  </div>;
}
