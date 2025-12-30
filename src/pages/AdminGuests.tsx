import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Users, CheckCircle, XCircle, Clock, RefreshCw, Search, Download, Copy, Shuffle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleGenerateCode = () => {
    setNewGuest({ ...newGuest, code: generateCode() });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado!",
      description: `Código ${code} copiado para a área de transferência.`,
    });
  };

  const handleExportCSV = () => {
    const headers = ['Nome', 'Código', 'Acompanhantes', 'Status', 'Restrições Alimentares'];
    const rows = guests.map(guest => [
      guest.name,
      guest.code,
      guest.companions.toString(),
      guest.confirmed === true ? 'Confirmado' : guest.confirmed === false ? 'Não irá' : 'Pendente',
      guest.dietary_restrictions || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `convidados-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportado!",
      description: "Lista de convidados exportada com sucesso.",
    });
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/admin/login");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
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
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={fetchGuests} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="code">Código (opcional)</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateCode}
                      className="h-8"
                    >
                      <Shuffle className="w-3 h-3 mr-1" />
                      Gerar
                    </Button>
                  </div>
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
              {searchTerm 
                ? `${filteredGuests.length} convidado(s) encontrado(s)` 
                : `Todos os convidados cadastrados e seus status de confirmação`}
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
                    {filteredGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{guest.code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyCode(guest.code)}
                              title="Copiar código"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
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
