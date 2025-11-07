import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const postSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  slug: z.string().min(3, "Le slug doit contenir au moins 3 caractères"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featuredImage: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    status: string;
    featuredImage?: string | null;
  };
}

export function CreatePostDialog({ open, onOpenChange, post }: CreatePostDialogProps) {
  const utils = trpc.useUtils();
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          status: post.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
          featuredImage: post.featuredImage || "",
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          status: "DRAFT",
          featuredImage: "",
        },
  });

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      toast.success("Article créé avec succès");
      utils.posts.list.invalidate();
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updatePost = trpc.posts.update.useMutation({
    onSuccess: () => {
      toast.success("Article mis à jour avec succès");
      utils.posts.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: PostFormValues) => {
    if (post) {
      updatePost.mutate({ id: post.id, ...data });
    } else {
      createPost.mutate(data);
    }
  };

  // Générer automatiquement le slug à partir du titre
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
      .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
      .replace(/^-+|-+$/g, ""); // Enlever les tirets au début et à la fin
  };

  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (!post && !form.getValues("slug")) {
      setIsGeneratingSlug(true);
      setTimeout(() => {
        form.setValue("slug", generateSlug(value));
        setIsGeneratingSlug(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          <DialogDescription>
            {post
              ? "Modifiez les informations de l'article"
              : "Créez un nouvel article pour votre blog"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Titre */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Titre de l'article"
                      {...field}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="slug-de-l-article"
                      {...field}
                      disabled={isGeneratingSlug}
                    />
                  </FormControl>
                  <FormDescription>
                    URL de l'article (généré automatiquement depuis le titre)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Extrait */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extrait</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Court résumé de l'article..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Résumé court qui apparaîtra dans les listes d'articles
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contenu */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contenu de l'article..."
                      className="resize-none min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Contenu principal de l'article (Markdown supporté)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image à la une */}
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image à la une</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de l'image" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL de l'image principale de l'article
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Statut */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Brouillon</SelectItem>
                      <SelectItem value="PUBLISHED">Publié</SelectItem>
                      <SelectItem value="ARCHIVED">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createPost.isPending || updatePost.isPending}
              >
                {(createPost.isPending || updatePost.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {post ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
