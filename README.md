# Install project

- npm ci

# Run project

- npm run dev
- open [http://localhost:3000](http://localhost:3000)

# Create .env

- add variable

# Install Postgresql

- https://get.enterprisedb.com/postgresql/postgresql-16.9-2-windows-x64.exe

# Init database

- cd C:\Users\colin\Desktop\Mosalink_dev
- psql -U postgres -d mosalink -h localhost -f mosalink-24-01-2024.dump

# Appliquer mes modification de la base de données (Colin)

- Ajout d'un domain "Super-admin"
- Ajout d'un compte "Super-admin" à l'email "superadmin@mosalink.com"

```bash
psql -U postgres -d mosalink -h localhost -f modification-bdd-colin.sql
```

---

## TODO

### Le "Cahier Des Charges"

- ✅ Gestion des "domaines"
  - ✅ Chaque utilisateur ne voit uniquement le domaine qui lui est attribué
  - ⬜️ Permettre à un utilisateur d'avoir accès a plusieurs domaines
- ✅ Création d'un compte et d'un espace superadmin
  - ✅ Interface dédiée super-admin avec header et navigation
  - ✅ Redirection automatique pour les super-admins
  - ✅ Scripts SQL
  - ✅ Permettre l'ajout/la suppression des domaines
  - ✅ Permettre la gestion des administrateurs de chaque domaine
- ⬜️ Harmonisation
  - Du design
  - Du vocabulaire
- ⬜️ Interface utilisateur
  - Correction des problèmes d'UI
  - Ajout de nouvelles fonctionnalités
- ⬜️ Amélioration de la version mobile
- ⬜️ Gestion du système d'authentification (supprimer le système de vérification par e-mail et utiliser un système de mot de passe)

### Les différents problèmes

> ✅ Problème résolu (fix)  
> ❌ Problème non résolu

- ✅ Interface admin dans un domaine, ajout d'un nouvelle utilisateur qui est

---

## Auteur du README

Colin LALLAURET
