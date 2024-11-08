import { getTypesAndSubtypes } from "@/actions/project/DefaultTypesAndSubtypes";
import { handleGetProjectById, handleGetProjects, ProjectWithRelations } from "@/actions/project/getProjects";
import PortfolioPage from "@/components/portfolio/PortfolioPage";
import ProjectDetail from "@/components/portfolio/ProjectDetail";

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

interface PortfolioPageProps {
    params: {
        segments?: string[];
    };
}

export default async function PortfolioServerPage({ params }: PortfolioPageProps) {
    const { segments } = params;
    const typeSlug = segments?.[0] || null;
    const projectIdSegment = segments?.[1] || null;

    // Obtiene todos los tipos
    const { data: types } = await getTypesAndSubtypes();
    const type = types?.find((t) => slugify(t.name) === typeSlug);

    if (segments?.length === 2) {
        // Caso de ruta: /portfolio/type/id (vista de proyecto individual)
        const projectId = parseInt(projectIdSegment as string, 10);
        if (isNaN(projectId)) {
            return <p>ID de proyecto inválido.</p>;
        }

        // Obtiene el proyecto específico por ID y tipo
        const project = await handleGetProjectById(projectId, type?.id);

        return project ? (
            <ProjectDetail project={project} />
        ) : (
            <p>Proyecto no encontrado.</p>
        );
    }

    if (segments?.length === 1) {
        // Caso de ruta: /portfolio/type (muestra proyectos por tipo)
        const typeId = type ? type.id : undefined;
        const projects: ProjectWithRelations[] = await handleGetProjects(1, 20, typeId);
        return <PortfolioPage initialProjects={projects} typeId={typeId} />;
    }

    // Caso de ruta: /portfolio (muestra todos los proyectos)
    const projects: ProjectWithRelations[] = await handleGetProjects(1, 20);
    return <PortfolioPage initialProjects={projects} />;
}

export async function generateStaticParams() {
    const { data: types } = await getTypesAndSubtypes();
    const paths = [];

    paths.push({ segments: [] }); // Ruta raíz /portfolio

    for (const type of types || []) {
        const typeSlug = slugify(type.name);
        paths.push({ segments: [typeSlug] }); // Ruta /portfolio/type

        // Obtiene todos los proyectos de este tipo
        const projects: ProjectWithRelations[] = await handleGetProjects(1, 1000, type.id);
        for (const project of projects) {
            paths.push({ segments: [typeSlug, project.id.toString()] }); // Ruta /portfolio/type/id
        }
    }

    return paths;
}
