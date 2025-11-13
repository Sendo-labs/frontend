# Migration Homev3 - Résumé Rapide

## 🎯 Vue d'ensemble en 1 minute

**Objectif** : Remplacer la home actuelle (5 sections avec snap-scroll) par Homev3 (page unique scroll libre)

**Temps estimé** : 4 heures  
**Complexité** : Moyenne  
**Impact** : Majeur (redesign complet de la home)

---

## 📊 Comparaison Rapide

| Critère | Home Actuelle | Homev3 |
|---------|--------------|---------|
| **Sections** | 5 (Hero, How It Works, Stats, Team, Contact) | 4 (Hero, Hall of Pain, Products, Final CTA) |
| **Navigation** | Snap-scroll + dots | Scroll libre |
| **Composants** | 5 fichiers séparés | 1 fichier monolithique |
| **Focus** | Éducatif | Conversion |
| **CTA** | 1 wallet input | 3 wallet inputs |
| **Leaderboard** | Top 3 | Top 10 complet |

---

## ✅ Avantages de Homev3

✅ Plus de focus sur la conversion (3 CTAs)  
✅ Leaderboard complet (top 10 vs top 3)  
✅ Messaging plus agressif et engageant  
✅ Design plus moderne avec animations subtiles  
✅ Simplicité de maintenance (1 fichier vs 5)  
✅ Section "Three Products" claire et actionnable

---

## ❌ Pertes avec Homev3

❌ Section "How It Works" détaillée (5 étapes avec vidéos)  
❌ Section "Team" (4 membres)  
❌ Section "Contact" (formulaire + réseaux sociaux)  
❌ Expérience snap-scroll unique  
❌ Aspect éducatif approfondi

**Solution** : Créer des pages dédiées `/about` et `/how-it-works`

---

## 🔧 Modifications Techniques Principales

### 1. Remplacer le fichier principal
```
frontend/src/app/client.tsx
```
- Remplacer tout le contenu par Homev3 converti
- Convertir JSX → TSX
- React Router → Next.js Router
- Ajouter les types TypeScript

### 2. Adapter les imports
```typescript
// ❌ Avant
import { Link, useNavigate } from "react-router-dom";

// ✅ Après
import Link from "next/link";
import { useRouter } from "next/navigation";
```

### 3. Adapter la navigation
```typescript
// ❌ Avant
navigate(createPageUrl("Analyzer") + `?wallet=${wallet}`);

// ✅ Après
router.push(`/analyzer?wallet=${wallet}`);
```

### 4. Intégrer l'API Leaderboard
```typescript
import { getShameLeaderboard } from '@/actions/analyzer/get';

useEffect(() => {
  async function loadLeaderboard() {
    const result = await getShameLeaderboard(10, 'all');
    // Mapper vers format Homev3
  }
  loadLeaderboard();
}, []);
```

### 5. Ajouter la font TECHNOS
```css
/* frontend/src/app/globals.css */
@font-face {
  font-family: 'TECHNOS';
  src: url('https://cdn.prod.website-files.com/.../Technos-PKDZP.otf') format('opentype');
}
```

### 6. Archiver les anciens composants
```
frontend/src/components/home/
├── _archive/
│   ├── hero-section.tsx
│   ├── how-it-works-section.tsx
│   ├── statistics-section.tsx
│   ├── team-section.tsx
│   └── contact-section.tsx
```

---

## 📋 Checklist d'Implémentation

### Étape 1 : Préparation (30 min)
- [ ] Créer `components/home/_archive/`
- [ ] Déplacer les 5 anciennes sections
- [ ] Créer `lib/api/leaderboard.ts`
- [ ] Définir les types TypeScript

### Étape 2 : Conversion (1h30)
- [ ] Copier Homev3.jsx dans client.tsx
- [ ] Convertir tous les imports
- [ ] Ajouter tous les types
- [ ] Adapter navigation et routing
- [ ] Intégrer API leaderboard
- [ ] Corriger erreurs TypeScript

### Étape 3 : Styles (30 min)
- [ ] Ajouter font TECHNOS
- [ ] Configurer couleurs Tailwind
- [ ] Vérifier responsive

### Étape 4 : Tests (1h)
- [ ] Navigation desktop
- [ ] Responsive mobile/tablet
- [ ] Animations Framer Motion
- [ ] Wallet input → redirection
- [ ] Chargement leaderboard
- [ ] Liens produits

### Étape 5 : Optimisation (30 min)
- [ ] Next.js Image optimization
- [ ] SEO metadata
- [ ] Lighthouse > 90
- [ ] Corriger warnings

---

## 🎨 Structure Homev3

```
┌─────────────────────────────────┐
│    1. HERO SECTION              │
│    - Badge airdrop              │
│    - Titre "HOW MUCH DID YOU    │
│      LOSE?"                     │
│    - Wallet input #1            │
│    - Quick stats (847K, $2.4B)  │
└─────────────────────────────────┘
           ↓ Scroll
┌─────────────────────────────────┐
│    2. HALL OF PAIN              │
│    - Podium (top 3)             │
│    - Table (rank 4-10)          │
│    - CTA "Analyze my wallet"    │
└─────────────────────────────────┘
           ↓ Scroll
┌─────────────────────────────────┐
│    3. THREE PRODUCTS            │
│    - Analyzer (LIVE)            │
│    - Worker (SOON)              │
│    - Marketplace (SOON)         │
└─────────────────────────────────┘
           ↓ Scroll
┌─────────────────────────────────┐
│    4. FINAL CTA                 │
│    - "STOP LOSING. START        │
│      WINNING."                  │
│    - Wallet input #2            │
└─────────────────────────────────┘
```

---

## 📦 Fichiers à Modifier

| Fichier | Action | Priorité |
|---------|--------|----------|
| `app/client.tsx` | Remplacer entièrement | 🔴 Critique |
| `app/globals.css` | Ajouter font TECHNOS | 🔴 Critique |
| `lib/api/leaderboard.ts` | Créer nouveau | 🟠 Important |
| `tailwind.config.ts` | Ajouter couleurs | 🟡 Optionnel |
| `app/layout.tsx` | Ajuster navbar | 🟡 Optionnel |
| `components/home/*` | Archiver | 🟢 Nettoyage |

---

## 🚨 Points d'Attention Critiques

### 1. Types TypeScript
```typescript
// Définir ces interfaces
interface LeaderboardEntry { ... }
interface Product { ... }
```

### 2. Routing Next.js
```typescript
// Utiliser le bon router
import { useRouter } from "next/navigation"; // App Router
// PAS: import { useRouter } from "next/router"; // Pages Router
```

### 3. API Leaderboard
```typescript
// Mapper les données API vers format Homev3
{
  rank: 1,
  wallet: "7hG3...xK2p",
  missed_usd: 2847293,
  badge: "🐋",
  nickname: "The Final Boss"
}
```

### 4. Client Component
```typescript
// Homev3 DOIT être un Client Component
'use client';
```

### 5. Liens
```typescript
// Vérifier que ces routes existent
/analyzer
/leaderboard
/worker
/marketplace
```

---

## 🎯 Métriques de Succès

Après migration, vérifier :

- [ ] **Lighthouse Performance** : > 90
- [ ] **Lighthouse SEO** : > 95
- [ ] **Temps de chargement** : < 2s
- [ ] **Taux de conversion** : Suivre les clics sur "Analyze"
- [ ] **Zéro erreurs** TypeScript
- [ ] **Zéro warnings** console
- [ ] **Mobile friendly** : 100%

---

## 🔗 Liens Utiles

- **Documentation complète** : `HOMEV3_MIGRATION.md`
- **Code source Homev3** : `sendo-copy-fc1c0a28/src/pages/Homev3.jsx`
- **Composants UI** : `frontend/src/components/ui/`

---

## 📞 Besoin d'Aide ?

### Questions fréquentes

**Q: Faut-il garder les anciennes sections ?**  
R: Oui, archiver dans `_archive/` au cas où.

**Q: Comment gérer la navbar ?**  
R: Homev3 peut fonctionner avec ou sans navbar. À décider selon le design global.

**Q: Que faire des vidéos de How It Works ?**  
R: Les déplacer vers une page `/how-it-works` dédiée.

**Q: Le leaderboard est-il en temps réel ?**  
R: Non, il se charge au montage du composant. Pour temps réel, ajouter un intervalle.

---

**Status** : 📝 Prêt à implémenter  
**Dernière MAJ** : 13 Nov 2025  
**Version** : 1.0

---

## 🚀 Commencer maintenant

```bash
# 1. Créer le dossier archive
mkdir -p frontend/src/components/home/_archive

# 2. Déplacer les anciens composants
mv frontend/src/components/home/*.tsx frontend/src/components/home/_archive/

# 3. Créer le nouveau client.tsx
code frontend/src/app/client.tsx

# 4. Copier le contenu de Homev3.jsx et commencer la conversion
```

Bonne migration ! 🎉

