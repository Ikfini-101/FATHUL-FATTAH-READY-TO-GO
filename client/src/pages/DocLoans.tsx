import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Scan, CheckCircle, Clock, BookOpen, Loader2, User, Mail, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

export default function DocLoans() {
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [loanForm, setLoanForm] = useState({
    borrowerName: "",
    borrowerEmail: "",
    dueAt: "",
  });

  const { data: activeLoans, isLoading, refetch } = trpc.docLoans.listActive.useQuery();
  const createLoanMutation = trpc.docLoans.createByBarcode.useMutation({
    onSuccess: () => {
      toast.success("Prêt enregistré avec succès");
      setBarcode("");
      setShowLoanDialog(false);
      setLoanForm({ borrowerName: "", borrowerEmail: "", dueAt: "" });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement du prêt");
    },
  });

  const returnLoanMutation = trpc.docLoans.return.useMutation({
    onSuccess: () => {
      toast.success("Retour enregistré avec succès");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors du retour");
    },
  });

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) {
      toast.error("Veuillez scanner ou saisir un code-barres");
      return;
    }
    // Ouvrir le dialogue pour saisir les infos emprunteur
    setShowLoanDialog(true);
  };

  const handleCreateLoan = () => {
    if (!loanForm.borrowerName || !loanForm.borrowerEmail || !loanForm.dueAt) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    createLoanMutation.mutate({
      barcode,
      borrowerName: loanForm.borrowerName,
      borrowerEmail: loanForm.borrowerEmail,
      dueAt: new Date(loanForm.dueAt),
    });
  };

  const handleReturn = (loanId: number) => {
    if (confirm("Confirmer le retour de cet exemplaire ?")) {
      returnLoanMutation.mutate({ id: loanId });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysOverdue = (dueDate: Date | string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Prêts</h1>
            <p className="text-gray-600 mt-1">
              Scanner les codes-barres pour enregistrer les prêts et retours
            </p>
          </div>
        </div>

        {/* Scanner de code-barres */}
        <Card className="border-green-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-green-50 to-amber-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Scan className="h-6 w-6" />
              Scanner Code-Barres
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleScanBarcode} className="flex gap-4">
              <div className="flex-1">
                <Input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Scanner ou saisir le code-barres de l'exemplaire..."
                  className="h-12 text-lg border-green-300 focus:border-green-500"
                  autoFocus
                  disabled={isScanning}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5 mr-2" />
                    Enregistrer Prêt
                  </>
                )}
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-3">
              💡 Astuce : Placez le curseur dans le champ et scannez directement le code-barres
            </p>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prêts Actifs</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {activeLoans?.length || 0}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Retard</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {activeLoans?.filter((loan: any) => loan.isOverdue).length || 0}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-amber-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Retours Aujourd'hui</p>
                  <p className="text-3xl font-bold text-green-700">0</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des prêts actifs */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Prêts Actifs ({activeLoans?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : activeLoans && activeLoans.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code-Barres</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Date Prêt</TableHead>
                      <TableHead>Date Retour Prévue</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeLoans.map((loan: any) => {
                      const isOverdue = loan.isOverdue || false;
                      const daysOverdue = loan.daysOverdue || 0;

                      return (
                        <TableRow key={loan.id}>
                          <TableCell className="font-mono text-sm">
                            {loan.copy?.barcode || "N/A"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {loan.copy?.docItem ? (
                              <>
                                {JSON.parse(loan.copy.docItem.titleI18n).fr}
                                <span className="text-xs text-gray-500 block">
                                  {loan.copy.docItem.creator}
                                </span>
                              </>
                            ) : (
                              "Document inconnu"
                            )}
                          </TableCell>
                          <TableCell>{formatDate(loan.loanedAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {formatDate(loan.dueAt)}
                              {isOverdue && (
                                <Badge variant="destructive" className="text-xs">
                                  +{daysOverdue}j
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {isOverdue ? (
                              <Badge variant="destructive">En retard</Badge>
                            ) : (
                              <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                              onClick={() => handleReturn(loan.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Retour
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Aucun prêt actif</p>
                <p className="text-sm mt-1">
                  Scannez un code-barres pour enregistrer un nouveau prêt
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog création prêt */}
      <Dialog open={showLoanDialog} onOpenChange={setShowLoanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un prêt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Code-barres</Label>
              <Input value={barcode} disabled className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="borrowerName">
                <User className="inline h-4 w-4 mr-1" />
                Nom de l'emprunteur *
              </Label>
              <Input
                id="borrowerName"
                value={loanForm.borrowerName}
                onChange={(e) => setLoanForm({ ...loanForm, borrowerName: e.target.value })}
                placeholder="Cheikh Ndiaye"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="borrowerEmail">
                <Mail className="inline h-4 w-4 mr-1" />
                Email de l'emprunteur *
              </Label>
              <Input
                id="borrowerEmail"
                type="email"
                value={loanForm.borrowerEmail}
                onChange={(e) => setLoanForm({ ...loanForm, borrowerEmail: e.target.value })}
                placeholder="cheikh.ndiaye@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueAt">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date de retour prévue *
              </Label>
              <Input
                id="dueAt"
                type="date"
                value={loanForm.dueAt}
                onChange={(e) => setLoanForm({ ...loanForm, dueAt: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoanDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleCreateLoan}
              disabled={createLoanMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createLoanMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Enregistrer le prêt
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
