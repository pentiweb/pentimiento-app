import Footer from "@/components/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jorge Russo - Colorista Senior",
    description: `Jorge Russo es un colorista Senior con treinta años de experiencia en corrección de color digital para cine, publicidad y TV. Ha trabajado con destacados directores de fotografía y cine en proyectos nacionales e internacionales.`,
    openGraph: {
        title: "Jorge Russo - Colorista Senior",
        description: `Jorge Russo es un colorista Senior con treinta años de experiencia en corrección de color digital para cine, publicidad y TV. Con una trayectoria que incluye cine y publicidad de alta calidad, Jorge aporta una sensibilidad única al proceso creativo.`,
        images: [{ url: "https://res.cloudinary.com/da305oaa0/image/upload/v1731571870/equipo/qyvcvksg35iat4ivsb4a.png" }],
        url: "https://pentimento.cc/equipo/jorge",
        siteName: "Pentimento Color Grading",
        locale: "es_AR",
        type: "profile",
    }
};

export default function JorgeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
            {children}
            <Footer />
        </div>
    )
}