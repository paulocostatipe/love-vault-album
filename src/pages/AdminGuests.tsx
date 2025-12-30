import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Users, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Guest {
  id: string;
  name: string;
  code: string;
  companions: number;
  confirmed: boolean | null;
  dietary_restrictions: string | null;
  created_at: string;
}

export default function AdminGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState({ name: "", code: "", companions: 0 });
  const { toast } = useToast();

  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar convidados",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGuests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleAddGuest = async () => {
    if (!newGuest.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome do convidado.",
        variant: "destructive",
      });
      return;
    }

    const code = newGuest.code.trim().toUpperCase() || generateCode();

    const { error } = await supabase
      .from('guests')
      .insert([{ 
        name: newGuest.name.trim(), 
        code,
        companions: newGuest.companions 
      }]);

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Código já existe",
          description: "Este código já está em uso. Tente outro.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao adicionar convidado",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Convidado adicionado!",
        description: `${newGuest.name} foi adicionado com o código ${code}`,
      });
      setNewGuest({ name: "", code: "", companions: 0 });
      setIsAddDialogOpen(false);
      fetchGuests();
    }
  };

  const handleEditGuest = async () => {
    if (!editingGuest) return;

    const { error } = await supabase
      .from('guests')
      .update({ 
        name: editingGuest.name, 
        code: editingGuest.code.toUpperCase(),
        companions: editingGuest.companions 
      })
      .eq('id', editingGuest.id);

    if (error) {
      toast({
        title: "Erro ao atualizar convidado",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Convidado atualizado!",
        description: `${editingGuest.name} foi atualizado com sucesso.`,
      });
      setIsEditDialogOpen(false);
      setEditingGuest(null);
      fetchGuests();
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guest.id);

    if (error) {
      toast({
        title: "Erro ao remover convidado",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Convidado removido",
        description: `${guest.name} foi removido da lista.`,
      });
      fetchGuests();
    }
  };

  const confirmedCount = guests.filter(g => g.confirmed === true).length;
  const declinedCount = guests.filter(g => g.confirmed === false).length;
  const pendingCount = guests.filter(g => g.confirmed === null).length;
  const totalCompanions = guests.reduce((acc, g) => acc + (g.confirmed === true ? g.companions + 1 : 0), 0);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-wedding-sage mb-4">
            Administração
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Gerenciar Convidados
          </h1>
          <p className="font-sans text-muted-foreground max-w-md mx-auto">
            Adicione, edite e acompanhe a confirmação de presença dos convidados
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="wedding">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-wedding-sage" />
              <p className="text-2xl font-serif">{guests.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card variant="wedding">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-serif">{confirmedCount}</p>
              <p className="text-sm text-muted-foreground">Confirmados</p>
            </CardContent>
          </Card>
          <Card variant="wedding">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-serif">{declinedCount}</p>
              <p className="text-sm text-muted-foreground">Não irão</p>
            </CardContent>
          </Card>
          <Card variant="wedding">
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-serif">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Total confirmed guests */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">
            Total de pessoas confirmadas (incluindo acompanhantes): <span className="font-serif text-2xl text-wedding-sage">{totalCompanions}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={fetchGuests} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="wedding">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Convidado
                </Button>
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Convidado</DialogTitle>
                <DialogDescription>
                  Preencha os dados do convidado. O código será gerado automaticamente se não for informado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Convidado</Label>
                  <Input
                    id="name"
                    placeholder="Nome completo"
                    value={newGuest.name}
                    onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código (opcional)</Label>
                  <Input
                    id="code"
                    placeholder="Será gerado automaticamente"
                    value={newGuest.code}
                    onChange={(e) => setNewGuest({ ...newGuest, code: e.target.value.toUpperCase() })}
                    maxLength={6}
                    className="uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companions">Nº de Acompanhantes</Label>
                  <Input
                    id="companions"
                    type="number"
                    min={0}
                    value={newGuest.companions}
                    onChange={(e) => setNewGuest({ ...newGuest, companions: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="wedding" onClick={handleAddGuest}>
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Guests Table */}
        <Card variant="wedding">
          <CardHeader>
            <CardTitle>Lista de Convidados</CardTitle>
            <CardDescription>
              Todos os convidados cadastrados e seus status de confirmação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : guests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum convidado cadastrado ainda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead className="text-center">Acompanhantes</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Restrições</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell className="font-mono text-sm">{guest.code}</TableCell>
                        <TableCell className="text-center">{guest.companions}</TableCell>
                        <TableCell className="text-center">
                          {guest.confirmed === true && (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Confirmado
                            </span>
                          )}
                          {guest.confirmed === false && (
                            <span className="inline-flex items-center gap-1 text-red-500">
                              <XCircle className="w-4 h-4" />
                              Não irá
                            </span>
                          )}
                          {guest.confirmed === null && (
                            <span className="inline-flex items-center gap-1 text-yellow-600">
                              <Clock className="w-4 h-4" />
                              Pendente
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {guest.dietary_restrictions || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingGuest(guest);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteGuest(guest)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Convidado</DialogTitle>
              <DialogDescription>
                Atualize os dados do convidado.
              </DialogDescription>
            </DialogHeader>
            {editingGuest && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Convidado</Label>
                  <Input
                    id="edit-name"
                    value={editingGuest.name}
                    onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Código</Label>
                  <Input
                    id="edit-code"
                    value={editingGuest.code}
                    onChange={(e) => setEditingGuest({ ...editingGuest, code: e.target.value.toUpperCase() })}
                    maxLength={6}
                    className="uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-companions">Nº de Acompanhantes</Label>
                  <Input
                    id="edit-companions"
                    type="number"
                    min={0}
                    value={editingGuest.companions}
                    onChange={(e) => setEditingGuest({ ...editingGuest, companions: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="wedding" onClick={handleEditGuest}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
