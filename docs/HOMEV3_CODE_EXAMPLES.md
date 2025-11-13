# Homev3 - Exemples de Code Côte-à-Côte

## 🔄 Guide de Conversion Pratique

Ce document montre les transformations de code nécessaires avec des exemples concrets.

---

## 1. Structure du Composant Principal

### ❌ Avant (client.tsx actuel)

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import HeroSection from '@/components/home/hero-section';
import ContactSection from '@/components/home/contact-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import StatisticsSection from '@/components/home/statistics-section';
import TeamSection from '@/components/home/team-section';

const totalSections = 5;

export default function Home() {
	const [currentSection, setCurrentSection] = useState(0);
	const [isScrolling, setIsScrolling] = useState(false);

	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (window.innerWidth >= 768 && !isScrolling) {
				e.preventDefault();
				setIsScrolling(true);
				if (e.deltaY > 0 && currentSection < totalSections - 1) {
					setCurrentSection((prev) => prev + 1);
				} else if (e.deltaY < 0 && currentSection > 0) {
					setCurrentSection((prev) => prev - 1);
				}
				setTimeout(() => setIsScrolling(false), 1000);
			}
		};
		window.addEventListener('wheel', handleWheel, { passive: false });
		return () => window.removeEventListener('wheel', handleWheel);
	}, [currentSection, isScrolling]);

	return (
		<>
			{/* Desktop - Snap Scroll */}
			<div className='hidden md:block relative w-full h-screen overflow-hidden'>
				{/* Navigation Dots */}
				<div className='fixed right-8 top-1/2 -translate-y-1/2 z-50'>
					{/* ... */}
				</div>
				
				<motion.div
					className='relative w-full'
					animate={{ y: `-${currentSection * 100}vh` }}
				>
					<HeroSection />
					<HowItWorksSection />
					<StatisticsSection />
					<TeamSection />
					<ContactSection />
				</motion.div>
			</div>

			{/* Mobile */}
			<div className='md:hidden'>
				<HeroSection />
				<HowItWorksSection />
				<StatisticsSection />
				<TeamSection />
				<ContactSection />
			</div>
		</>
	);
}
```

### ✅ Après (Homev3)

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
import { getShameLeaderboard } from '@/actions/analyzer/get';

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

// Mock Data (fallback)
const LEADERBOARD_MOCK: LeaderboardEntry[] = [
  { rank: 1, wallet: "7hG3...xK2p", missed_usd: 2847293, badge: "🐋", nickname: "The Final Boss" },
  // ... 9 autres entrées
];

const PRODUCTS: Product[] = [
  {
    name: "ANALYZER",
    status: "LIVE",
    tagline: "Calculate Your Pain 💀",
    description: "See exactly how much you lost by not selling at ATH.",
    link: "/analyzer",
    color: "from-[#FF6B00] to-[#FF223B]",
    icon: TrendingDown,
    available: true
  },
  // ... 2 autres produits
];

export default function Home() {
  const router = useRouter();
  const [wallet, setWallet] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(LEADERBOARD_MOCK);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real leaderboard
  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const result = await getShameLeaderboard(10, 'all');
        if (result.success) {
          const mapped = result.data.entries.map((entry, idx) => ({
            rank: idx + 1,
            wallet: entry.wallet,
            missed_usd: entry.total_missed_usd || 0,
            badge: getBadgeForRank(idx + 1),
            nickname: getNicknameForRank(idx + 1)
          }));
          setLeaderboard(mapped);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const handleAnalyze = () => {
    if (wallet.trim()) {
      router.push(`/analyzer?wallet=${wallet}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 4 orbes animées */}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center justify-center px-4 py-20">
          {/* Contenu Hero */}
        </section>

        {/* Leaderboard Section */}
        <section className="py-20 px-4">
          {/* Hall of Pain */}
        </section>

        {/* Products Section */}
        <section className="py-20 px-4">
          {/* 3 Products */}
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          {/* Final CTA */}
        </section>
      </div>
    </div>
  );
}

// Helper functions
function getBadgeForRank(rank: number): string {
  const badges = ['🐋', '💀', '🔥', '⚡', '💎', '🎯', '🌊', '🚀', '👑', '🎲'];
  return badges[rank - 1] || '💸';
}

function getNicknameForRank(rank: number): string {
  const nicknames = [
    'The Final Boss', 'Diamond Graveyard', 'Eternal Flame', 
    'Thunder Loser', 'Certified Bagger', 'Miss Master',
    'Wave Rider', 'Moon Misser', 'Paper King', 'Casino Degen'
  ];
  return nicknames[rank - 1] || `Degen #${rank}`;
}
```

**Changements clés** :
- ✅ Suppression du système snap-scroll
- ✅ Tout le contenu dans un seul composant
- ✅ Ajout des types TypeScript
- ✅ Intégration API leaderboard
- ✅ Gestion du routing Next.js

---

## 2. Navigation et Routing

### ❌ Avant (React Router)

```jsx
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

function Component() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(createPageUrl("Analyzer") + `?wallet=${wallet}`);
  };
  
  return (
    <>
      <Link to={createPageUrl("Analyzer")}>Analyzer</Link>
      <Link to={createPageUrl("Leaderboard")}>Leaderboard</Link>
      <button onClick={handleClick}>Analyze</button>
    </>
  );
}
```

### ✅ Après (Next.js)

```typescript
import Link from "next/link";
import { useRouter } from "next/navigation";

function Component() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/analyzer?wallet=${wallet}`);
  };
  
  return (
    <>
      <Link href="/analyzer">Analyzer</Link>
      <Link href="/leaderboard">Leaderboard</Link>
      <button onClick={handleClick}>Analyze</button>
    </>
  );
}
```

---

## 3. Section Hero

### ❌ Avant (Composant séparé)

```typescript
// components/home/hero-section.tsx
export default function HeroSection() {
  const [topLoosers, setTopLoosers] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchTopLoosers = async () => {
      const result = await getShameLeaderboard(3, 'week');
      if (result.success) {
        setTopLoosers(result.data.entries);
      }
    };
    fetchTopLoosers();
  }, []);

  return (
    <section className='relative w-full h-screen'>
      {/* Background */}
      <div className='absolute inset-0'>
        {/* Gradient */}
      </div>
      
      {/* Content */}
      <div className='relative z-10'>
        <h1>HOW MUCH DID<br/>YOU LOSE?</h1>
        <WalletInput onAnalyze={handleAnalyze} />
        
        {/* Top 3 Loosers */}
        <div className='grid grid-cols-3 gap-4'>
          {topLoosers.map((looser, index) => (
            <div key={index}>{/* Card */}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### ✅ Après (Intégré dans Homev3)

```typescript
// Dans Home() component
<section className="min-h-[90vh] flex items-center justify-center px-4 py-20">
  <div className="max-w-5xl mx-auto text-center w-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Badge Airdrop */}
      <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-4 py-2 mb-8">
        <Flame className="w-4 h-4 text-[#FF6B00]" />
        <span className="text-sm text-foreground/80 uppercase font-bold">
          Airdrop Live • Earn $SNDO
        </span>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase title-font">
        HOW MUCH DID<br/>
        YOU{" "}
        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
          LOSE?
        </span>
      </h1>

      <p className="text-xl text-foreground/70 mb-12 max-w-3xl mx-auto">
        Calculate your missed ATH gains. Compare with other degens.
        <br/>
        Earn <span className="text-[#FF6B00] font-bold">$SNDO</span> airdrop points 💀
      </p>

      {/* Wallet Input */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Paste your Solana wallet..."
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
            className="flex-1 h-16 bg-foreground/5 border-2 border-foreground/20"
          />
          <Button
            onClick={handleAnalyze}
            className="h-16 px-10 bg-gradient-to-r from-[#FF6B00] to-[#FF223B]"
          >
            ANALYZE MY PAIN
            <TrendingDown className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex justify-center gap-8 text-sm text-foreground/60">
        <div>
          <span className="text-3xl font-bold text-[#FF6B00] block">847K+</span>
          <span>Wallets Analyzed</span>
        </div>
        <div>
          <span className="text-3xl font-bold text-[#FF223B] block">$2.4B</span>
          <span>Missed Gains</span>
        </div>
        <div>
          <span className="text-3xl font-bold text-[#14F195] block">20%</span>
          <span>$SNDO Airdrop</span>
        </div>
      </div>
    </motion.div>
  </div>
</section>
```

**Changements** :
- ✅ Top 3 remplacé par Quick Stats
- ✅ Badge airdrop ajouté
- ✅ CTA plus direct
- ✅ Tout intégré dans le composant principal

---

## 4. Leaderboard (Nouvelle Section)

### ✅ Section Hall of Pain (Homev3)

```typescript
<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-6xl font-bold mb-4 uppercase title-font">
        HALL OF{" "}
        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
          PAIN
        </span>
      </h2>
      <p className="text-lg text-foreground/60">
        Top 10 biggest losers. Can you beat them? 💀
      </p>
    </motion.div>

    {/* Podium - Top 3 */}
    <div className="grid grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
      {/* 2nd Place */}
      <div className="order-1">
        <div className="bg-foreground/5 border-2 border-[#C0C0C0]/50 p-6 text-center">
          <div className="text-6xl mb-3">{leaderboard[1].badge}</div>
          <div className="text-5xl font-bold mb-2 text-[#C0C0C0]">2</div>
          <p className="text-lg font-bold mb-1">{leaderboard[1].nickname}</p>
          <p className="text-xs text-foreground/40 mb-3 font-mono">
            {leaderboard[1].wallet}
          </p>
          <div className="bg-[#C0C0C0]/20 px-3 py-1">
            <p className="text-2xl font-bold text-[#FF223B]">
              ${(leaderboard[1].missed_usd / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-foreground/60">MISSED</p>
          </div>
        </div>
      </div>

      {/* 1st Place - Bigger */}
      <div className="order-2">
        <div className="bg-gradient-to-b from-[#FFD700]/20 to-foreground/5 border-2 border-[#FFD700] p-8 text-center transform scale-110">
          <Crown className="w-12 h-12 text-[#FFD700] mx-auto mb-2 animate-pulse" />
          <div className="text-7xl mb-3">{leaderboard[0].badge}</div>
          <div className="text-6xl font-bold mb-2 text-[#FFD700]">1</div>
          <p className="text-xl font-bold mb-1">{leaderboard[0].nickname}</p>
          <p className="text-xs text-foreground/40 mb-4 font-mono">
            {leaderboard[0].wallet}
          </p>
          <div className="bg-[#FFD700]/30 px-4 py-2">
            <p className="text-3xl font-bold text-[#FF223B]">
              ${(leaderboard[0].missed_usd / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-foreground/60 uppercase">TOTAL PAIN</p>
          </div>
        </div>
      </div>

      {/* 3rd Place */}
      <div className="order-3">
        <div className="bg-foreground/5 border-2 border-[#CD7F32]/50 p-6 text-center">
          {/* Similar to 2nd place */}
        </div>
      </div>
    </div>

    {/* Rest of Leaderboard (4-10) */}
    <div className="max-w-4xl mx-auto bg-foreground/5 border border-foreground/10">
      <table className="w-full">
        <thead className="bg-background border-b border-foreground/10">
          <tr>
            <th className="text-left p-4 text-foreground/60 text-xs uppercase">Rank</th>
            <th className="text-left p-4 text-foreground/60 text-xs uppercase">Degen</th>
            <th className="text-right p-4 text-foreground/60 text-xs uppercase">Missed</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.slice(3, 10).map((entry, index) => (
            <tr
              key={entry.rank}
              className="border-b border-foreground/5 hover:bg-foreground/5"
            >
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-foreground/40">
                    #{entry.rank}
                  </span>
                  <span className="text-3xl">{entry.badge}</span>
                </div>
              </td>
              <td className="p-4">
                <p className="font-bold text-foreground">{entry.nickname}</p>
                <p className="text-xs text-foreground/40 font-mono">{entry.wallet}</p>
              </td>
              <td className="p-4 text-right">
                <p className="text-xl font-bold text-[#FF223B]">
                  ${entry.missed_usd >= 1000000 
                    ? `${(entry.missed_usd / 1000000).toFixed(2)}M` 
                    : `${(entry.missed_usd / 1000).toFixed(0)}K`
                  }
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Full Leaderboard Button */}
      <div className="p-6 bg-background border-t border-foreground/10 text-center">
        <Link href="/leaderboard">
          <Button className="bg-foreground/10 hover:bg-foreground/20">
            <Trophy className="w-5 h-5 mr-2" />
            VIEW FULL LEADERBOARD
          </Button>
        </Link>
      </div>
    </div>

    {/* Compare CTA */}
    <div className="mt-12 text-center">
      <p className="text-xl text-foreground/70 mb-6">
        Think you can beat them? 🎯
      </p>
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="h-14 px-10 bg-gradient-to-r from-[#FF6B00] to-[#FF223B]"
      >
        ANALYZE MY WALLET
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  </div>
</section>
```

**Nouvelle fonctionnalité** : Leaderboard complet avec podium + table

---

## 5. Products Section

### ✅ Three Products (Homev3)

```typescript
<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <h2 className="text-6xl font-bold mb-4 uppercase title-font">
        THREE{" "}
        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF223B] bg-clip-text text-transparent">
          PRODUCTS
        </span>
      </h2>
      <p className="text-lg text-foreground/60">
        Simple tools. Big results. No BS.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PRODUCTS.map((product, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={`bg-foreground/5 border-2 ${
            product.available 
              ? 'border-foreground/10 hover:border-[#FF6B00]/50' 
              : 'border-foreground/5'
          } p-8 relative`}
        >
          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase ${
            product.available 
              ? 'bg-[#14F195] text-background' 
              : 'bg-foreground/10 text-foreground/60'
          }`}>
            {product.status}
          </div>

          {/* Icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${product.color} flex items-center justify-center mb-6`}>
            <product.icon className="w-8 h-8 text-white" />
          </div>

          {/* Product Name */}
          <h3 className="text-3xl font-bold mb-3 uppercase title-font">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xl font-bold mb-4">
            {product.tagline}
          </p>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6 text-foreground/70">
            {product.description}
          </p>

          {/* CTA */}
          {product.available ? (
            <Link href={product.link}>
              <Button className={`w-full bg-gradient-to-r ${product.color} h-12`}>
                TRY NOW
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              disabled
              className="w-full bg-foreground/5 text-foreground/40 h-12"
            >
              <Lock className="w-4 h-4 mr-2" />
              COMING SOON
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

**Nouvelle section** : Remplace How It Works + Statistics + Team

---

## 6. Background Animations

### ❌ Avant (Statique)

```typescript
<div className='absolute inset-0'>
  <div className='absolute inset-0 bg-gradient-to-r from-[#FFBDA3] via-[#FFA7B0] to-[#E89E9E]' />
  <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background' />
</div>
```

### ✅ Après (Orbes Animées)

```typescript
<div className="fixed inset-0 pointer-events-none">
  <motion.div
    className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-[#FF223B]/20 blur-[100px]"
    style={{ top: '10%', left: '10%' }}
    animate={{
      x: [0, 100, -50, 0],
      y: [0, -80, 60, 0],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
  />
  
  <motion.div
    className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#14F195]/20 to-[#00D9B5]/10 blur-[100px]"
    style={{ top: '40%', right: '15%' }}
    animate={{
      x: [0, -120, 80, 0],
      y: [0, 100, -60, 0],
      scale: [1, 0.8, 1.3, 1],
    }}
    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
  />
  
  {/* 2 autres orbes similaires */}
</div>
```

**Amélioration** : Background dynamique et moderne

---

## 7. API Integration

### ❌ Avant (Mock Data Seulement)

```javascript
// Homev3.jsx (React)
const LEADERBOARD = [
  { rank: 1, wallet: "7hG3...xK2p", missed_usd: 2847293, badge: "🐋", nickname: "The Final Boss" },
  // ... données en dur
];
```

### ✅ Après (API + Fallback)

```typescript
import { getShameLeaderboard } from '@/actions/analyzer/get';

// Mock data as fallback
const LEADERBOARD_MOCK: LeaderboardEntry[] = [
  // ... données de secours
];

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(LEADERBOARD_MOCK);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setIsLoading(true);
        const result = await getShameLeaderboard(10, 'all');
        
        if (result.success && result.data.entries.length > 0) {
          const mapped = result.data.entries.map((entry, idx) => ({
            rank: idx + 1,
            wallet: entry.wallet,
            missed_usd: entry.total_missed_usd || 0,
            badge: getBadgeForRank(idx + 1),
            nickname: getNicknameForRank(idx + 1)
          }));
          setLeaderboard(mapped);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        // Garder le mock data en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    }
    
    loadLeaderboard();
  }, []);

  // Render avec état de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    // ... reste du composant
  );
}
```

**Amélioration** : Données réelles avec fallback

---

## 8. Styling et Theming

### ❌ Avant (Couleurs en dur)

```tsx
className="text-[#F2EDE7]"
className="bg-[#0D0D0D]"
className="border-[#F2EDE7]/10"
```

### ✅ Après (Variables de thème)

```tsx
className="text-foreground"
className="bg-background"
className="border-foreground/10"
```

**Config Tailwind** :
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        foreground: '#F2EDE7',
        'sendo-orange': '#FF6B00',
        'sendo-red': '#FF223B',
      }
    }
  }
}
```

---

## 9. Responsive Design

### ✅ Mobile-First Approach

```typescript
{/* Mobile: Stack vertical */}
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  <Input className="flex-1 h-12 sm:h-16 text-sm sm:text-lg" />
  <Button className="h-12 sm:h-16 px-6 sm:px-10">
    <span className="sm:hidden">ANALYZE</span>
    <span className="hidden sm:inline">ANALYZE MY PAIN</span>
  </Button>
</div>

{/* Grilles responsive */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {/* Podium */}
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Products */}
</div>

{/* Font sizes responsive */}
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
  HOW MUCH DID YOU LOSE?
</h1>
```

---

## 10. TypeScript Types

### ✅ Définitions de Types

```typescript
// Leaderboard Entry
interface LeaderboardEntry {
  rank: number;
  wallet: string;
  missed_usd: number;
  badge: string;
  nickname: string;
}

// Product
interface Product {
  name: string;
  status: "LIVE" | "SOON";
  tagline: string;
  description: string;
  link: string;
  color: string;
  icon: LucideIcon; // ou typeof Zap
  available: boolean;
}

// Component Props (si nécessaire)
interface HomeProps {
  initialLeaderboard?: LeaderboardEntry[];
}

// API Response Types
interface LeaderboardApiResponse {
  success: boolean;
  data: {
    entries: Array<{
      wallet: string;
      total_missed_usd: number;
      rank: number;
    }>;
  };
}
```

---

## 📝 Checklist de Conversion

Pour chaque section, vérifier :

- [ ] Imports convertis (React Router → Next.js)
- [ ] Types TypeScript ajoutés
- [ ] Navigation adaptée (Link, useRouter)
- [ ] Classes Tailwind vérifiées
- [ ] Animations Framer Motion testées
- [ ] Responsive mobile/tablet/desktop
- [ ] API calls fonctionnelles
- [ ] States et useEffect corrects
- [ ] Event handlers correctement typés
- [ ] Aucune erreur TypeScript

---

## 🎯 Prochaines Étapes

1. Copier le code de Homev3.jsx
2. Appliquer les transformations ci-dessus
3. Compiler et corriger les erreurs TypeScript
4. Tester toutes les fonctionnalités
5. Optimiser les performances
6. Déployer

---

**Document créé le** : 13 Novembre 2025  
**Pour** : Migration Homev3 vers Next.js  
**Status** : ✅ Prêt pour implémentation

