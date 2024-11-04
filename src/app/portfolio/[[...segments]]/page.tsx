import { getTypesAndSubtypes } from "@/actions/project/DefaultTypesAndSubtypes";
import { handleGetProjects, ProjectWithRelations } from "@/actions/project/getProjects";


interface PortfolioPageProps {
  params: {
    segments?: string[];
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { segments } = params;

  const typeSlug = segments?.[0] || null;    // El primer segmento después de `/portfolio`
  const subtypeSlug = segments?.[1] || null; // El segundo segmento después de `/portfolio`

  // Obtiene todos los tipos y subtipos
  const { data: typesWithSubtypes } = await getTypesAndSubtypes();

  // Encuentra el ID del tipo y subtipo según los nombres (slugs)
  const type = typesWithSubtypes?.find((t) => t.name === typeSlug);
  const subtype = type?.subtypes.find((st) => st.name === subtypeSlug);

  const typeId = type ? type.id : undefined;
  const subtypeId = subtype ? subtype.id : undefined;

  // Llamada a la función `handleGetProjects` con los filtros aplicados
  const projects: ProjectWithRelations[] = await handleGetProjects(1, 10, typeId, subtypeId);

  return (
    <div className="flex items-center justify-center mt-32">
      <h1>Proyectos</h1>
      {type && <h2>Tipo: {type.name}</h2>}
      {subtype && <h3>Subtipo: {subtype.name}</h3>}

      {/* Renderiza los proyectos obtenidos */}
      <ul  className="flex flex-col items-center justify-start">
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              <h4>{project.title}</h4>
              <h5>{project.colorists.map((colorist) => colorist.fullname).join(", ")}</h5>
              {/* Puedes agregar más detalles del proyecto aquí */}
              <img src={project.mainImageUrl} alt={project.title} />
            </li>
          ))
        ) : (
          <p>No se encontraron proyectos para este filtro.</p>
        )}
      </ul>
    </div>
  );
}