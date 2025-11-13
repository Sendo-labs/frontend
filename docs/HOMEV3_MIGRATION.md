# Migration vers Homev3 - Plan de Modifications

## 📋 Vue d'ensemble

Ce document détaille toutes les modifications nécessaires pour remplacer la page d'accueil actuelle (basée sur un système de snap-scroll avec 5 sections) par **Homev3** (une page unique avec scroll libre).

---

## 🎯 Objectif

Remplacer l'architecture actuelle de la home qui utilise :
- Un système de snap-scroll desktop avec navigation par dots
- 5 sections séparées (Hero, How It Works, Statistics, Team, Contact)
- Des composants individuels pour chaque section

Par **Homev3** qui propose :
- Une page unique avec scroll libre et fluide
- 4 sections principales : Hero avec leaderboard, Hall of Pain (Top 10), Three Products, Final CTA
- Tous les éléments sont regroupés dans un seul composant
- Design épuré et axé sur la conversion

---

## 📁 Analyse de la Structure Actuelle

### Frontend Next.js (Actuel)
```
frontend/src/
├── app/
│   ├── client.tsx                    # Page Home avec snap-scroll
│   └── page.tsx                      # Point d'entrée
├── components/
│   └── home/
│       ├── hero-section.tsx          # Section Hero actuelle
│       ├── how-it-works-section.tsx  # Section How It Works
│       ├── statistics-section.tsx    # Section Statistics
│       ├── team-section.tsx          # Section Team
│       └── contact-section.tsx       # Section Contact
```

### Sendo-copy (Homev3 Source)
```
sendo-copy-fc1c0a28/src/
├── pages/
│   └── Homev3.jsx                    # Composant complet de Homev3
├── components/home/
│   ├── HeroSection.jsx               # Hero alternatif (non utilisé dans Homev3)
│   ├── HowItWorksSection.jsx         # Section alternative (non utilisée)
│   ├── StatisticsSection.jsx         # Section alternative (non utilisée)
│   ├── TeamSection.jsx               # Section alternative (non utilisée)
│   └── ContactSection.jsx            # Section alternative (non utilisée)
```

---

## 🔄 Différences Majeures

### Architecture
| Aspect | Home Actuelle | Homev3 |
|--------|--------------|--------|
| **Structure** | 5 composants séparés | 1 composant monolithique |
| **Navigation** | Snap-scroll avec dots | Scroll libre standard |
| **Sections** | Hero, How It Works, Stats, Team, Contact | Hero, Leaderboard, Products, Final CTA |
| **Framework** | Next.js 15 + TypeScript | Vite + React + JSX |
| **Routing** | Next.js Router | React Router DOM |
| **API Calls** | Server Actions Next.js | React Query + REST |

### Contenu
| Section | Home Actuelle | Homev3 |
|---------|--------------|--------|
| **Hero** | Wallet input + Top 3 de la semaine | Wallet input + Stats rapides (847K wallets) |
| **Section 2** | How It Works (5 étapes avec vidéos) | Hall of Pain (Top 10 leaderboard complet) |
| **Section 3** | Statistics (4 stats animées) | Three Products (Analyzer, Worker, Marketplace) |
| **Section 4** | Team (4 membres) | Final CTA (Wallet input répété) |
| **Section 5** | Contact (form + socials) | ❌ Supprimé |

### Design
- **Couleurs** : Identiques (`#0D0D0D`, `#F2EDE7`, gradients orange/rouge)
- **Font** : Même font TECHNOS
- **Animations** : Plus légères dans Homev3
- **Background** : Orbes animées dans Homev3 vs gradient statique actuel

---

## 🛠️ Modifications à Apporter

### 1. Convertir Homev3.jsx en TypeScript Next.js

**Fichier à créer** : `frontend/src/app/client.tsx` (remplacer le contenu)

**Adaptations nécessaires** :

#### A. Imports et Types
```typescript
// Remplacer les imports React Router par Next.js
- import { Link, useNavigate } from "react-router-dom";
- import { createPageUrl } from "@/utils";
+ import Link from "next/link";
+ import { useRouter } from "next/navigation";

// Ajouter les types TypeScript
+ interface LeaderboardEntry {
+   rank: number;
+   wallet: string;
+   missed_usd: number;
+   badge: string;
+   nickname: string;
+ }
+ 
+ interface Product {
+   name: string;
+   status: "LIVE" | "SOON";
+   tagline: string;
+   description: string;
+   link: string;
+   color: string;
+   icon: LucideIcon;
+   available: boolean;
+ }
```

#### B. Navigation et Routing
```typescript
// Remplacer
const navigate = useNavigate();
const handleAnalyze = () => {
  if (wallet.trim()) {
    navigate(createPageUrl("Analyzer") + `?wallet=${wallet}`);
  }
};

// Par
const router = useRouter();
const handleAnalyze = () => {
  if (wallet.trim()) {
    router.push(`/analyzer?wallet=${wallet}`);
  }
};

// Links
- <Link to={createPageUrl("Analyzer")}>
+ <Link href="/analyzer">

- <Link to={createPageUrl("Leaderboard")}>
+ <Link href="/leaderboard">
```

#### C. Données du Leaderboard
```typescript
// Option 1 : Garder le mock (temporaire)
const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, wallet: "7hG3...xK2p", missed_usd: 2847293, badge: "🐋", nickname: "The Final Boss" },
  // ... autres données
];

// Option 2 : Intégrer avec l'API existante
+ import { getShameLeaderboard } from '@/actions/analyzer/get';
+ 
+ const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
+ 
+ useEffect(() => {
+   const fetchLeaderboard = async () => {
+     try {
+       const result = await getShameLeaderboard(10, 'all');
+       if (result.success) {
+         // Mapper les données vers le format Homev3
+         const mappedData = result.data.entries.map((entry, idx) => ({
+           rank: idx + 1,
+           wallet: entry.wallet,
+           missed_usd: entry.total_missed_usd || 0,
+           badge: getBadgeForRank(idx + 1),
+           nickname: generateNickname(entry.wallet)
+         }));
+         setLeaderboard(mappedData);
+       }
+     } catch (error) {
+       console.error('Failed to fetch leaderboard:', error);
+     }
+   };
+   fetchLeaderboard();
+ }, []);
```

#### D. Styles et Classes
```typescript
// Remplacer les classes Tailwind custom si nécessaire
- className="text-[#F2EDE7]"
+ className="text-foreground"

- className="bg-[#0D0D0D]"
+ className="bg-background"

// Garder les gradients custom
className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B]"
```

#### E. Structure du Composant
```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, Zap, TrendingDown, Crown, Trophy, 
  Target, Skull, Flame, Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Types
interface LeaderboardEntry {
  rank: number;
  wallet: string;
  missed_usd: number;
  badge: string;
  nickname: string;
}

interface Product {
  name: string;
  status: "LIVE" | "SOON";
  tagline: string;
  description: string;
  link: string;
  color: string;
  icon: typeof Zap;
  available: boolean;
}

// Data
const LEADERBOARD: LeaderboardEntry[] = [
  // ... données du leaderboard
];

const PRODUCTS: Product[] = [
  // ... données des produits
];

export default function Home() {
  const router = useRouter();
  const [wallet, setWallet] = useState("");

  const handleAnalyze = () => {
    if (wallet.trim()) {
      router.push(`/analyzer?wallet=${wallet}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* ... contenu de Homev3 ... */}
    </div>
  );
}
```

---

### 2. Mise à Jour du Point d'Entrée

**Fichier** : `frontend/src/app/page.tsx`

```typescript
// Le fichier peut rester simple car client.tsx gère tout
import Home from './client';

export default function Page() {
  return <Home />;
}
```

---

### 3. Gestion de la Navigation

**Considération** : Homev3 n'utilise pas la navbar du Layout actuel.

#### Option A : Désactiver la navbar sur la home
```typescript
// frontend/src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* La home gère sa propre navigation si nécessaire */}
        {children}
      </body>
    </html>
  );
}
```

#### Option B : Ajouter une navbar minimale dans Homev3
```typescript
// À ajouter au début de Homev3
<nav className="fixed top-6 left-0 right-0 z-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="bg-background/80 border border-foreground/10 backdrop-blur-sm p-4 flex justify-between items-center">
      <Link href="/">
        <img src="/logo.png" alt="SENDO" className="h-6" />
      </Link>
      <div className="flex gap-4">
        <Link href="/analyzer" className="text-sm text-foreground/70 hover:text-foreground">
          ANALYZER
        </Link>
        <Link href="/leaderboard" className="text-sm text-foreground/70 hover:text-foreground">
          LEADERBOARD
        </Link>
      </div>
    </div>
  </div>
</nav>
```

---

### 4. Composants à Supprimer ou Archiver

Ces fichiers ne seront plus utilisés avec Homev3 :

**À archiver** (déplacer vers `frontend/src/components/home/_archive/`) :
- `hero-section.tsx`
- `how-it-works-section.tsx`
- `statistics-section.tsx`
- `team-section.tsx`
- `contact-section.tsx`

**Raison** : Homev3 est un composant autonome qui n'utilise pas ces sections.

---

### 5. Styles et Thème

**Fichier** : `frontend/src/app/globals.css`

#### A. Ajouter la Font TECHNOS
```css
@font-face {
  font-family: 'TECHNOS';
  src: url('https://cdn.prod.website-files.com/61b3737273405dd7b65eec4c/68e3cd8726651e5fccb99f93_Technos-PKDZP.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.title-font {
  font-family: 'TECHNOS', sans-serif;
  letter-spacing: 0.1em;
}
```

#### B. Variables de couleurs (si utilisation de CSS custom)
```css
:root {
  --sendo-orange: #FF6B00;
  --sendo-red: #FF223B;
  --sendo-dark-red: #450C13;
  --sendo-green: #14F195;
  --sendo-teal: #00D9B5;
  --sendo-purple: #A855F7;
  --sendo-pink: #EC4899;
  --sendo-gold: #FFD700;
  --sendo-silver: #C0C0C0;
  --sendo-bronze: #CD7F32;
}
```

#### C. Classes utilitaires pour Homev3
```css
/* Clip path pour les boutons */
.sendo-clip-corner {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
}

/* Animations personnalisées */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

---

### 6. Configuration Tailwind

**Fichier** : `frontend/tailwind.config.ts`

Ajouter les couleurs Sendo si nécessaire :

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sendo-orange': '#FF6B00',
        'sendo-red': '#FF223B',
        'sendo-dark-red': '#450C13',
        'sendo-green': '#14F195',
        'sendo-teal': '#00D9B5',
        'sendo-purple': '#A855F7',
        'sendo-pink': '#EC4899',
        'sendo-gold': '#FFD700',
        'sendo-silver': '#C0C0C0',
        'sendo-bronze': '#CD7F32',
      },
      fontFamily: {
        'technos': ['TECHNOS', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### 7. Intégration des Données Backend

#### A. Leaderboard API
```typescript
// frontend/src/lib/api/leaderboard.ts
export interface LeaderboardApiEntry {
  wallet: string;
  total_missed_usd: number;
  rank: number;
}

export async function fetchLeaderboard(limit: number = 10): Promise<LeaderboardApiEntry[]> {
  const result = await getShameLeaderboard(limit, 'all');
  if (!result.success) {
    throw new Error('Failed to fetch leaderboard');
  }
  return result.data.entries;
}

// Mapper vers le format Homev3
export function mapToHomev3Format(entries: LeaderboardApiEntry[]) {
  const badges = ['🐋', '💀', '🔥', '⚡', '💎', '🎯', '🌊', '🚀', '👑', '🎲'];
  const nicknames = [
    'The Final Boss', 'Diamond Graveyard', 'Eternal Flame', 'Thunder Loser',
    'Certified Bagger', 'Miss Master', 'Wave Rider', 'Moon Misser',
    'Paper King', 'Casino Degen'
  ];
  
  return entries.map((entry, idx) => ({
    rank: idx + 1,
    wallet: entry.wallet,
    missed_usd: entry.total_missed_usd || 0,
    badge: badges[idx] || '💸',
    nickname: nicknames[idx] || `Degen #${idx + 1}`
  }));
}
```

#### B. Utilisation dans Homev3
```typescript
// Dans le composant Home
import { fetchLeaderboard, mapToHomev3Format } from '@/lib/api/leaderboard';

const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

useEffect(() => {
  async function loadLeaderboard() {
    try {
      setIsLoadingLeaderboard(true);
      const data = await fetchLeaderboard(10);
      const formatted = mapToHomev3Format(data);
      setLeaderboard(formatted);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Utiliser les données mock en cas d'erreur
      setLeaderboard(LEADERBOARD_MOCK);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }
  loadLeaderboard();
}, []);
```

---

### 8. Tests et Validation

#### Checklist de validation :
- [ ] **Conversion TypeScript** : Tous les types sont définis
- [ ] **Navigation** : Les liens pointent vers les bonnes routes Next.js
- [ ] **Wallet Input** : Le formulaire redirige correctement vers `/analyzer`
- [ ] **Leaderboard** : Les données se chargent depuis l'API
- [ ] **Responsive** : Mobile, tablet et desktop fonctionnent
- [ ] **Animations** : Framer Motion fonctionne sans erreur
- [ ] **Fonts** : TECHNOS se charge correctement
- [ ] **Colors** : Les couleurs correspondent au design
- [ ] **Products Links** : Les 3 produits redirigent correctement
- [ ] **SEO** : Metadata et og:tags sont configurés

---

### 9. Optimisations Next.js

#### A. Metadata
**Fichier** : `frontend/src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'SENDO - Stop Losing, Start Winning',
  description: 'Calculate your missed ATH gains. Compare with other degens. Earn $SNDO airdrop points for your pain.',
  openGraph: {
    title: 'SENDO - How Much Did You Lose?',
    description: 'Calculate your pain. Build your trading AI. Never miss the ATH again.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SENDO - Stop Losing, Start Winning',
    description: 'Calculate your missed gains and earn $SNDO',
    images: ['/og-image.png'],
  },
};
```

#### B. Performance
```typescript
// Lazy loading des images
import Image from 'next/image';

// Remplacer
<img src="..." alt="..." />

// Par
<Image 
  src="..." 
  alt="..." 
  width={400} 
  height={400}
  priority={isHero} // true pour le hero, false ailleurs
/>
```

#### C. Server Components vs Client Components
```typescript
// Homev3 doit rester un Client Component à cause de :
// - useState
// - useEffect
// - framer-motion
// - Interactions utilisateur

'use client';
```

---

## 📦 Fichiers Finaux

### Structure après migration :
```
frontend/src/
├── app/
│   ├── client.tsx              # ✅ Homev3 converti en TypeScript Next.js
│   ├── page.tsx                # ✅ Point d'entrée simplifié
│   ├── layout.tsx              # ✅ Layout sans navbar sur home
│   └── globals.css             # ✅ Styles + Font TECHNOS
├── components/
│   ├── home/
│   │   └── _archive/           # 📦 Anciennes sections (archivées)
│   │       ├── hero-section.tsx
│   │       ├── how-it-works-section.tsx
│   │       ├── statistics-section.tsx
│   │       ├── team-section.tsx
│   │       └── contact-section.tsx
│   └── ui/                     # ✅ Composants UI réutilisés
│       ├── button.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   └── api/
│       └── leaderboard.ts      # ✅ API helper pour le leaderboard
└── actions/
    └── analyzer/
        └── get.ts              # ✅ Server Actions existantes
```

---

## 🚀 Plan d'Implémentation

### Phase 1 : Préparation (30 min)
1. ✅ Créer le dossier `_archive` dans `components/home/`
2. ✅ Déplacer les anciennes sections dans `_archive/`
3. ✅ Créer `lib/api/leaderboard.ts`
4. ✅ Ajouter les types TypeScript nécessaires

### Phase 2 : Conversion (1h30)
1. ✅ Copier le contenu de `Homev3.jsx` dans `app/client.tsx`
2. ✅ Convertir tous les imports (React Router → Next.js)
3. ✅ Ajouter les types TypeScript
4. ✅ Adapter la navigation et les liens
5. ✅ Intégrer l'API du leaderboard
6. ✅ Tester la compilation TypeScript

### Phase 3 : Styles (30 min)
1. ✅ Ajouter la font TECHNOS dans `globals.css`
2. ✅ Configurer Tailwind avec les couleurs Sendo
3. ✅ Vérifier le responsive sur tous les breakpoints

### Phase 4 : Tests (1h)
1. ✅ Tester la navigation desktop
2. ✅ Tester le responsive mobile/tablet
3. ✅ Vérifier les animations Framer Motion
4. ✅ Tester le wallet input et la redirection
5. ✅ Valider le chargement du leaderboard
6. ✅ Tester les liens vers les produits

### Phase 5 : Optimisations (30 min)
1. ✅ Optimiser les images avec Next.js Image
2. ✅ Ajouter les metadata SEO
3. ✅ Vérifier les performances Lighthouse
4. ✅ Corriger les warnings/erreurs

**Temps total estimé : 4 heures**

---

## ⚠️ Points d'Attention

### 1. Breaking Changes
- **Suppression du snap-scroll** : Les utilisateurs habitués au scroll par section devront s'adapter
- **Suppression de la section Contact** : Vérifier si important pour l'entreprise
- **Suppression de la section Team** : Peut être déplacée vers une page `/about`
- **Suppression de How It Works détaillé** : Informations condensées dans les produits

### 2. Dépendances
Vérifier que ces packages sont installés :
```json
{
  "framer-motion": "^12.x",
  "lucide-react": "^0.x",
  "@radix-ui/react-*": "^1.x"
}
```

### 3. API Backend
- S'assurer que `getShameLeaderboard()` peut retourner 10 entrées
- Vérifier que les données incluent `wallet`, `total_missed_usd`, `rank`

### 4. Routage
- `/analyzer` doit accepter le query param `?wallet=...`
- `/leaderboard` doit exister
- `/worker` et `/marketplace` doivent être créés ou remplacés par des modals

---

## 🎨 Design Considerations

### Homev3 apporte :
✅ **Plus de focus sur la conversion** : 3 CTAs pour analyser le wallet  
✅ **Gamification accrue** : Hall of Pain avec top 10 complet  
✅ **Messaging plus agressif** : "How much did you lose?" vs ancien messaging  
✅ **Simplification** : 4 sections vs 5  
✅ **Animations subtiles** : Orbes en background vs statique  

### Homev3 perd :
❌ **Section How It Works détaillée** : Plus d'éducation sur le fonctionnement  
❌ **Section Team** : Moins de humanisation/confiance  
❌ **Section Contact** : Moins d'engagement communautaire direct  
❌ **Snap Scroll** : Expérience utilisateur unique  

**Recommandation** : Si ces sections sont importantes, envisager de créer :
- Une page `/about` pour Team + Contact
- Une page `/how-it-works` pour le détail du produit

---

## 📝 Checklist Finale

### Avant le merge :
- [ ] Toutes les conversions TypeScript sont complètes
- [ ] Aucun `any` type dans le code
- [ ] Tous les liens fonctionnent
- [ ] Le leaderboard se charge depuis l'API
- [ ] Les animations sont fluides (60fps)
- [ ] Le responsive est parfait sur tous les devices
- [ ] La font TECHNOS se charge
- [ ] Les couleurs sont correctes
- [ ] SEO metadata configuré
- [ ] Tests manuels passés
- [ ] Lighthouse score > 90

### Après le merge :
- [ ] Monitoring des erreurs frontend
- [ ] Analytics sur le taux de conversion
- [ ] A/B test vs ancienne home (optionnel)
- [ ] Feedback utilisateurs

---

## 🔗 Ressources

### Documentation
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Assets
- **Font TECHNOS** : `https://cdn.prod.website-files.com/.../Technos-PKDZP.otf`
- **Images** : Hébergées sur Supabase Storage

---

## 📧 Support

Pour toute question sur cette migration, contacter :
- **Tech Lead** : Documenter les décisions importantes
- **Design** : Valider les changements visuels
- **Product** : Valider la perte de fonctionnalités

---

**Dernière mise à jour** : 13 Novembre 2025  
**Version** : 1.0  
**Statut** : 📝 Documentation prête - En attente d'implémentation

