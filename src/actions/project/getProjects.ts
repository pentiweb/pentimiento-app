'use server';

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
    include: { type: true; subtypes: true, colorists: true, gallery: true };
}>;


export async function handleGetProjects(
    page: number = 1,
    limit: number = 10,
    typeId?: number,
    subtypeId?: number,
    slug?: string
) {
    try {
        const filter: { typeId?: number; subtypeId?: number, title?: string } = {};

        if (typeId) {
            filter.typeId = typeId;
        }
        if (subtypeId) {
            filter.subtypeId = subtypeId;
        }
        if (slug) filter.title = slug.replace(/-/g, ' ');

        console.log(slug)

        const projects: ProjectWithRelations[] = await prisma.project.findMany({
            where: filter,
            orderBy: { displayOrder: 'asc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                type: true,
                subtypes: true,
                colorists: true,
                gallery: true
            }
        });

        return projects;
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        return [];
    }
}

export async function handleGetProjectById(
    projectId: number,
    typeId?: number
) {
    try {
        const whereClause: Record<string, number> = { id: projectId };
        if (typeId) {
            whereClause.typeId = typeId;
        }

        const project: ProjectWithRelations | null = await prisma.project.findFirst({
            where: whereClause,
            include: {
                type: true,
                subtypes: true,
                colorists: true,
                gallery: true,
            },
        });

        return project;
    } catch (error) {
        console.error("Error al obtener el proyecto por ID:", error);
        return null;
    }
}

export async function handleGetProjectsBySubtype(subtypeName: string): Promise<ProjectWithRelations[]> {
    try {
        const projects = await prisma.project.findMany({
            where: {
                subtypes: {
                    some: {
                        name: {
                            equals: subtypeName,
                            mode: 'insensitive',
                        },
                    },
                },
            },
            orderBy: { displayOrder: 'asc' },
            include: {
                type: true,
                subtypes: true,
                colorists: true,
                gallery: true,
            },
        });

        return projects;
    } catch (error) {
        console.error("Error al obtener proyectos por subtipo:", error);
        return [];
    }
}


