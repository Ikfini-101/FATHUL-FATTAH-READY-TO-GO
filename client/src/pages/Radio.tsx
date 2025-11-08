import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, Radio as RadioIcon, Mic } from "lucide-react";

export default function Radio() {
  // Récupérer les émissions radio
  const { data: shows, isLoading } = trpc.radioShows.list.useQuery();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">E-Radio</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les émissions et épisodes radio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle émission
        </Button>
      </div>

      {/* Émissions Radio */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <RadioIcon className="h-5 w-5 text-purple-600" />
            Émissions Radio
          </CardTitle>
          <CardDescription>
            {shows?.length || 0} émission(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : shows && shows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Émission</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shows.map((show: any) => (
                  <TableRow key={show.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Mic className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p>{show.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {show.host || "Pas d'animateur"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {show.description || "Pas de description"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={show.status === "ACTIVE" ? "default" : "secondary"}>
                        {show.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <RadioIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune émission radio</p>
              <Button className="mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Créer votre première émission
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
