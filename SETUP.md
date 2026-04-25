# 🎮 TENTIA — Guide de déploiement

## ÉTAPE 1 : Supabase — créer les tables

1. Va sur https://supabase.com → ton projet Tentia
2. Clique sur **SQL Editor** → **New query**
3. Colle tout le contenu du fichier `server/schema.sql`
4. Clique **Run**
5. Tu dois voir "Success" — la table `profiles` est créée

---

## ÉTAPE 2 : Modifier les fichiers HTML

Dans `index.html` ET `stats.html`, ajoute ces deux lignes dans le `<head>` :

```html
<link rel="stylesheet" href="login.css">
<script src="api.js" defer></script>
```

Dans `index.html`, ajoute au début du `<body>` (avant tout autre contenu) :

```html
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    const ok = await TentiaAPI.initApp();
    if (!ok) return; // affiche login screen
  });
</script>
```

Pareil dans `stats.html`.

---

## ÉTAPE 3 : Installer Node.js

1. Va sur https://nodejs.org et installe la version LTS
2. Vérifie : `node --version` dans un terminal

---

## ÉTAPE 4 : Installer les dépendances

Dans ton terminal, navigue vers le dossier `server/` :

```bash
cd C:\Users\i-gamer\Documents\GitHub\Tentia\server
npm install
```

---

## ÉTAPE 5 : Tester en local

```bash
node index.js
```

Ouvre http://localhost:3000 — tu dois voir l'écran de login Tentia.

---

## ÉTAPE 6 : Déployer sur GitHub

```bash
cd C:\Users\i-gamer\Documents\GitHub\Tentia

git init
git add .
git commit -m "Initial commit — Tentia RPG"
git remote add origin https://github.com/TON_USERNAME/Tentia.git
git push -u origin main
```

⚠️ Le fichier `.env` est dans `.gitignore` — il ne sera PAS envoyé sur GitHub. C'est normal et voulu.

---

## ÉTAPE 7 : Déployer sur Render

1. Va sur https://render.com → **New Web Service**
2. Connecte ton repo GitHub **Tentia**
3. Configure :
   - **Root directory** : `server`
   - **Build command** : `npm install`
   - **Start command** : `node index.js`
4. Dans **Environment Variables**, ajoute :
   - `SUPABASE_URL` = https://ylxabznzgqayqwokslos.supabase.co
   - `SUPABASE_ANON_KEY` = (ta clé anon)
   - `SUPABASE_SERVICE_KEY` = (ta clé service)
   - `FRONTEND_URL` = https://ton-app.onrender.com
5. Clique **Deploy**

---

## ÉTAPE 8 : Migrer tes données existantes

Une fois connecté sur le site :

1. Ouvre la console F12
2. Colle cette commande :
```javascript
await TentiaAPI.importFromLocalStorage()
```
3. Tu verras "Import réussi !" — toutes tes données sont maintenant dans Supabase

---

## Structure des fichiers à mettre dans le dossier Tentia/

```
Tentia/
├── index.html
├── stats.html
├── style.css
├── stats.css
├── script.js
├── stats.js
├── api.js          ← NOUVEAU
├── login.css       ← NOUVEAU
├── assets/
└── server/         ← NOUVEAU
    ├── index.js
    ├── package.json
    ├── .env        ← NE PAS METTRE SUR GITHUB
    ├── .gitignore
    ├── schema.sql
    ├── supabase.js
    ├── middleware/
    │   └── auth.js
    └── routes/
        ├── auth.js
        └── data.js
```
