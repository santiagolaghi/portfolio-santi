import type { PortfolioData, Project } from "./portfolio";

const base = { url:"",repoUrl:"",embedUrl:"",coverUrl:"",gallery:[],stack:[],visible:true,featured:false,previewMode:"auto" as const,realApp:"" as const };
const assets = "/assets/semilla/";
export const catalogVersion = 1;
export const addedProjects: Project[] = [
  {...base,id:"semilla",name:"Semilla",subtitle:"Un lugar para preparar lo que querés compartir.",category:"Fe",status:"En desarrollo",description:"Prepará prédicas, organizá series y desarrollá tus ideas con un editor por bloques.",problem:"Preparar una prédica requiere reunir ideas, pasajes y una estructura que después sea cómoda de leer al compartirla.",solution:"Una app nativa para Android con biblioteca de prédicas, series, editor por bloques y un modo de lectura para predicar.",contribution:"Idea del producto, diseño de los recorridos, definición del editor y desarrollo con asistencia de IA, probando la app en el celular.",features:["Prédicas y series","Puntos y subpuntos","Inserción de pasajes","Modo púlpito","Guardado local"],stack:["Kotlin","Jetpack Compose","Material 3","Room"],color:"#ca4d44",demoType:"semilla",previewMode:"gallery",coverUrl:assets+"library.png",gallery:["library","editor","series","series-detail","pulpit","verse-preview"].map(name=>assets+name+".png")},
  {...base,id:"cch",name:"Planificación CCH",subtitle:"Un calendario compartido para organizarse mejor.",category:"Organización",status:"Publicado",description:"Coordiná actividades, responsables y horarios en un calendario compartido.",problem:"La planificación de una comunidad necesita fechas claras, responsables y una forma de evitar actividades superpuestas.",solution:"Un calendario colaborativo con edición de actividades, control de horarios y un panel para programar repeticiones mensuales.",contribution:"Definición de necesidades, decisiones de diseño, desarrollo con asistencia de IA y ajustes a partir del uso de los líderes.",features:["Calendario compartido","Actividades recurrentes","Control de superposiciones","Edición de fechas","Acceso directo instalable"],stack:["React","TypeScript","Supabase","Vite","PWA"],color:"#d1794b",demoType:"planner",realApp:"planner",url:"https://calendario-de-planificacion.laghisantiagonicolas.chatgpt.site"},
  {...base,id:"alacena",name:"Alacena",subtitle:"La despensa y las compras, en un mismo lugar.",category:"Vida diaria",status:"Publicado",description:"Marcá lo que falta en casa, armá las compras y compartí la despensa con tu pareja.",problem:"Anotar los mismos productos cada vez y coordinar las compras por mensajes hace fácil olvidarse de algo.",solution:"Una despensa por categorías que permite marcar faltantes, preparar la compra y consultar los hábitos de reposición.",contribution:"Idea del producto, definición de la experiencia y desarrollo con asistencia de IA, con foco en hacer más simple una tarea cotidiana.",features:["Despensa por categorías","Lista de faltantes","Compras registradas","Hábitos de consumo","Despensa compartida"],stack:["React","TypeScript","Cloudflare D1","PWA"],color:"#6e9577",demoType:"pantry",realApp:"pantry",url:"https://alacena-super-santi.laghisantiagonicolas.chatgpt.site"},
];
export const bibleUpdate: Partial<Project> = {
  subtitle:"Un espacio para leer, estudiar y conectar la Biblia.",description:"Leé la Biblia, guardá notas y conectá pasajes en una experiencia centrada en la lectura.",
  solution:"Una app de lectura y estudio con navegación por libros y capítulos, marcas, notas, cuadernos y un recorrido para conocer a Jesús. Continúa en desarrollo.",
  features:["Lectura de los 66 libros","Marcas y notas","Cuadernos de estudio","Pasajes relacionados","Recorrido de lectura"],stack:["JavaScript","IndexedDB","PWA"],realApp:"bible",previewMode:"real",url:"https://biblia-mi-diseno.laghisantiagonicolas.chatgpt.site",
};

// Apply this catalog update once to older drafts/publications. After an owner saves,
// deleting, hiding, reordering, or editing any project remains the owner's choice.
export function upgradeCatalog(data: PortfolioData): PortfolioData {
  if(data.catalogVersion>=catalogVersion)return data;
  const semilla=addedProjects[0];
  const hasSemilla=data.projects.some(p=>p.id==="semilla");
  const projects=data.projects.flatMap(project=>{
    if(project.id==="notas")return hasSemilla?[]:[{...semilla,visible:project.visible,featured:project.featured}];
    if(project.id==="biblia")return [{...project,...bibleUpdate}];
    return [project];
  });
  for(const project of addedProjects)if(!projects.some(p=>p.id===project.id))projects.push(structuredClone(project));
  return {...data,catalogVersion,projects};
}
