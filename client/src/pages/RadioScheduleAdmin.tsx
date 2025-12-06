import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { id: 0, name: "Dimanche" },
  { id: 1, name: "Lundi" },
  { id: 2, name: "Mardi" },
  { id: 3, name: "Mercredi" },
  { id: 4, name: "Jeudi" },
  { id: 5, name: "Vendredi" },
  { id: 6, name: "Samedi" },
];

export default function RadioScheduleAdmin() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [formData, setFormData] = useState({
    showId: 0,
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "10:00",
    timezone: "Africa/Dakar",
    isRecurring: true,
    startDate: "",
    endDate: "",
  });

  const { data: schedules, isLoading } = trpc.radioSchedule.list.useQuery();
  const { data: shows } = trpc.radioShows.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.radioSchedule.create.useMutation({
    onSuccess: () => {
      toast.success("Horaire créé avec succès");
      utils.radioSchedule.list.invalidate();
      setCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création: " + error.message);
    },
  });

  const updateMutation = trpc.radioSchedule.update.useMutation({
    onSuccess: () => {
      toast.success("Horaire mis à jour avec succès");
      utils.radioSchedule.list.invalidate();
      setEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour: " + error.message);
    },
  });

  const deleteMutation = trpc.radioSchedule.delete.useMutation({
    onSuccess: () => {
      toast.success("Horaire supprimé avec succès");
      utils.radioSchedule.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      showId: 0,
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "10:00",
      timezone: "Africa/Dakar",
      isRecurring: true,
      startDate: "",
      endDate: "",
    });
    setSelectedSchedule(null);
  };

  const handleCreate = () => {
    const payload: any = {
      ...formData,
    };
    if (formData.startDate) payload.startDate = new Date(formData.startDate);
    if (formData.endDate) payload.endDate = new Date(formData.endDate);
    
    createMutation.mutate(payload);
  };

  const handleUpdate = () => {
    if (!selectedSchedule) return;
    const payload: any = {
      id: selectedSchedule.id,
      ...formData,
    };
    if (formData.startDate) payload.startDate = new Date(formData.startDate);
    if (formData.endDate) payload.endDate = new Date(formData.endDate);
    
    updateMutation.mutate(payload);
  };

  const handleEdit = (schedule: any) => {
    setSelectedSchedule(schedule);
    setFormData({
      showId: schedule.showId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      timezone: schedule.timezone || "Africa/Dakar",
      isRecurring: schedule.isRecurring,
      startDate: schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : "",
      endDate: schedule.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : "",
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet horaire ?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getShowName = (showId: number) => {
    return shows?.find(s => s.id === showId)?.title || "Émission inconnue";
  };

  const getDayName = (dayId: number) => {
    return DAYS_OF_WEEK.find(d => d.id === dayId)?.name || "Inconnu";
  };

  // Grouper par jour pour affichage
  const schedulesByDay = DAYS_OF_WEEK.map(day => ({
    ...day,
    items: schedules?.filter(s => s.dayOfWeek === day.id).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    ) || []
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Grille des Programmes</h1>
          <p className="text-muted-foreground">
            Planifiez les horaires de diffusion de vos émissions radio
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Horaire
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <div className="space-y-6">
          {schedulesByDay.map(day => (
            <div key={day.id} className="border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h2 className="text-lg font-semibold">{day.name}</h2>
                <Badge variant="secondary" className="ml-auto">
                  {day.items.length} programme(s)
                </Badge>
              </div>
              
              {day.items.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Aucun programme planifié ce jour
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horaire</TableHead>
                      <TableHead>Émission</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {day.items.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>{getShowName(schedule.showId)}</TableCell>
                        <TableCell>
                          {schedule.isRecurring ? (
                            <Badge variant="default">Récurrent</Badge>
                          ) : (
                            <Badge variant="secondary">Ponctuel</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {schedule.startDate && schedule.endDate
                            ? `${new Date(schedule.startDate).toLocaleDateString()} - ${new Date(schedule.endDate).toLocaleDateString()}`
                            : schedule.startDate
                            ? `Depuis ${new Date(schedule.startDate).toLocaleDateString()}`
                            : "Permanent"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(schedule)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialog Création */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvel Horaire</DialogTitle>
            <DialogDescription>
              Planifiez un nouvel horaire de diffusion pour une émission
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="showId">Émission *</Label>
              <Select
                value={formData.showId.toString()}
                onValueChange={(value) => setFormData({ ...formData, showId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une émission" />
                </SelectTrigger>
                <SelectContent>
                  {shows?.map(show => (
                    <SelectItem key={show.id} value={show.id.toString()}>
                      {show.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dayOfWeek">Jour de la semaine *</Label>
              <Select
                value={formData.dayOfWeek.toString()}
                onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map(day => (
                    <SelectItem key={day.id} value={day.id.toString()}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Heure début *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Heure fin *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="isRecurring" className="text-base">
                  Diffusion récurrente
                </Label>
                <p className="text-sm text-muted-foreground">
                  Se répète chaque semaine au même horaire
                </p>
              </div>
              <Switch
                id="isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
            </div>

            {!formData.isRecurring && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Date début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">Date fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Tous les horaires sont en heure locale (Africa/Dakar)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={formData.showId === 0}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Édition */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'Horaire</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Même formulaire que création */}
            <div className="grid gap-2">
              <Label htmlFor="edit-showId">Émission *</Label>
              <Select
                value={formData.showId.toString()}
                onValueChange={(value) => setFormData({ ...formData, showId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shows?.map(show => (
                    <SelectItem key={show.id} value={show.id.toString()}>
                      {show.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-dayOfWeek">Jour *</Label>
              <Select
                value={formData.dayOfWeek.toString()}
                onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map(day => (
                    <SelectItem key={day.id} value={day.id.toString()}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startTime">Heure début</Label>
                <Input
                  id="edit-startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endTime">Heure fin</Label>
                <Input
                  id="edit-endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="edit-isRecurring" className="text-base">
                  Diffusion récurrente
                </Label>
                <p className="text-sm text-muted-foreground">
                  Se répète chaque semaine
                </p>
              </div>
              <Switch
                id="edit-isRecurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
            </div>

            {!formData.isRecurring && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-startDate">Date début</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-endDate">Date fin</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
