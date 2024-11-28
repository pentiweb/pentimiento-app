'use client';

import { handleCreateProject } from "@/actions/project/create";
import { SubmitButton } from "@/components/auth/submitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import ColoristsCheckbox from "./ColoristsCheckbox";
import ImgGallery from "./ImgGallery";
import ImgPortada from "./ImgPortada";
import SelectTypeAndSubtype from "./SelectTypeAndSubtype";
import ImgThumbnail from "./ImgThumbnail";
// import { generateDefaultTypesAndSubtypes } from "@/actions/project/DefaultTypesAndSubtypes";

interface FormCreateProps {
    onCreate: () => void;
}

export function FormCreate({ onCreate }: FormCreateProps) {

    const [open, setOpen] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [portadaFile, setPortadaFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [typeId, setTypeId] = useState<string | null>(null);
    const [subtypeIds, setSubtypeIds] = useState<string[]>([]);
    const [selectedColorists, setSelectedColorists] = useState<number[]>([]);

    const handleSubmit = async (formData: FormData) => {
        formData.append('thumbnailUrl', thumbnailFile as File);
        formData.append('mainImageUrl', portadaFile as File);
        if (typeId) formData.append('typeId', typeId);
        if (subtypeIds.length > 0) {
            formData.append('subtypeIds', JSON.stringify(subtypeIds));
        }
        if (galleryFiles.length > 0) {
            galleryFiles.forEach((file) => formData.append("galleryFiles", file));
        }
        if (selectedColorists.length > 0) {
            formData.append('colorists', JSON.stringify(selectedColorists));
        }
        try {
            const result = await handleCreateProject(formData);

            // Determinar mensaje y variante de toast
            const isSuccess = !!result?.message;
            const title = isSuccess
                ? 'Proyecto creado 😃!'
                : 'Error al crear proyecto 😢';
            const message = result?.message ?? result?.error ?? 'Error desconocido.';

            toast({
                title,
                description: message,
                variant: result?.message ? 'default' : 'destructive',
            });

            // Llamar a onCreate solo si el proyecto se creó exitosamente
            if (result?.message && onCreate) {
                onCreate();
            }
        } catch (error) {
            console.error("Error en la creación del proyecto:", error);
            toast({
                title: "Error al crear proyecto 😢",
                description: "Ocurrió un problema al crear el proyecto. Inténtalo de nuevo.",
                variant: "destructive",
            });
        }
    };

    // CREADOR MASIVO DE TIPOS Y SUBTIPOS
    // const handleCreateTypesAndSubtypes = async () => {

    //     const result = await generateDefaultTypesAndSubtypes();

    //     console.log(result)
    // }


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button className="mt-4" onClick={() => setOpen(true)}>Agregar proyecto</Button>
            </SheetTrigger>
            <SheetContent className="max-w-xl mx-auto h-full  overflow-y-auto lg:px-16 rounded" side='bottom'>
                <SheetHeader>
                    <SheetTitle>Crear proyecto</SheetTitle>
                    <SheetDescription>
                        Ingresa los datos necesarios para crear un nuevo proyecto
                    </SheetDescription>
                </SheetHeader>
                {/* <Button onClick={handleCreateTypesAndSubtypes}>Crear types y subtypes</Button> */}
                <form action={handleSubmit} className="flex flex-col gap-4 py-4">
                    {/* Input Title */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="title" className="text-right">
                            Título
                        </Label>
                        <Input id="title" name="title" className="col-span-3" placeholder="Título del proyecto" required />
                    </div>
                    <div className="flex flex-col items-start gap-4 w-fit">
                        <Label htmlFor="uniqueCode" className="text-right">
                            Código único
                        </Label>
                        <Input id="uniqueCode" name="uniqueCode" className="col-span-3" placeholder="Año-Mes-Título" required />
                    </div>
                    {/* Input Thumbnail */}
                    <ImgThumbnail setThumbnailFile={setThumbnailFile} />
                    {/* Input Portada */}
                    <ImgPortada setPortadaFile={setPortadaFile} />
                    {/* Select Type and Subtype */}
                    <SelectTypeAndSubtype setTypeId={setTypeId} setSubtypeIds={setSubtypeIds} />
                    {/* Colorists Checkbox */}
                    <ColoristsCheckbox setSelectedColorists={setSelectedColorists} />
                    {/* Input Director */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="director" className="text-right">
                            Director (opcional)
                        </Label>
                        <Input id="director" name="director" className="col-span-3" placeholder="Nombre del director" />
                    </div>
                    {/* Input Producer */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="producer" className="text-right">
                            Productora (opcional)
                        </Label>
                        <Input id="producer" name="producer" className="col-span-3" placeholder="Nombre de la productora" />
                    </div>
                    {/* Input Cinematographer */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="df" className="text-right">
                            Director de Fotografía (opcional)
                        </Label>
                        <Input id="df" name="df" className="col-span-3" placeholder="Nombre del DF" />
                    </div>
                    {/* Input Agency */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="agency" className="text-right">
                            Agencia (opcional)
                        </Label>
                        <Input id="agency" name="agency" className="col-span-3" placeholder="Nombre de la agencia" />
                    </div>
                    {/* Input Video Link */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="videoLink" className="text-right">
                            Link del Video (opcional)
                        </Label>
                        <Input id="videoLink" name="videoLink" className="col-span-3" placeholder="https://video.com/watch?v=123" />
                    </div>
                    {/* Input IMDB Link */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="imdbUrl" className="text-right">
                            Link de IMDB (opcional)
                        </Label>
                        <Input id="imdbUrl" name="imdbUrl" className="col-span-3" placeholder="https://imdb.com/title/tt123456789" />
                    </div>
                    {/* Input Gallery */}
                    <ImgGallery setGalleryFiles={setGalleryFiles} />
                    {/* Input Synopsis */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="synopsis" className="text-right">
                            Sinopsis (opcional)
                        </Label>
                        <Input id="synopsis" name="synopsis" className="col-span-3" placeholder="Breve descripción del proyecto" />
                    </div>
                    {/* Input Description */}
                    <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="description" className="text-right">
                            Descripción (opcional)
                        </Label>
                        <Textarea id="description" name="description" className="col-span-3" placeholder="Descripción detallada del proyecto" />
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <SubmitButton title="Crear nuevo proyecto" />
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
