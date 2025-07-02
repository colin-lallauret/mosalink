"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationAddDomainAdmin } from "@/hooks/super-admin/useMutationAddDomainAdmin";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";

interface AddAdminDialogProps {
  domainId: string;
  domainName: string;
}

export default function AddAdminDialog({ domainId, domainName }: AddAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
  });

  const { toast } = useToast();
  const addAdminMutation = useMutationAddDomainAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Erreur",
        description: "L&apos;email est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      await addAdminMutation.mutateAsync({
        domainId,
        email: formData.email,
        name: formData.name || undefined,
      });
      toast({
        title: "Succès",
        description: "Administrateur ajouté avec succès",
      });
      setOpen(false);
      setFormData({ email: "", name: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l&apos;ajout",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un administrateur à {domainName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nom (optionnel)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nom de l&apos;administrateur"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={addAdminMutation.isLoading}>
              {addAdminMutation.isLoading ? "Ajout..." : "Ajouter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
