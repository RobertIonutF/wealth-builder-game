// ===========================================
// EVENTS SYSTEM
// ===========================================

import { game } from './state.js';

export const minorEvents = [
    { text: '💼 Bonus at work!', effect: () => { if (!game.hasQuitJob) { game.cash += 2000; return '+$2,000 bonus!'; } return 'No job bonus (self-employed)'; }, type: 'positive', category: 'career' },
    { text: '🔧 Car repair needed', effect: () => { game.cash -= 800; return '-$800 car repair'; }, type: 'negative', category: 'personal' },
    { text: '🎁 Tax refund!', effect: () => { game.cash += 1200; return '+$1,200 tax refund!'; }, type: 'positive', category: 'personal' },
    { text: '📊 Credit score improved', effect: () => { game.creditScore = Math.min(850, game.creditScore + 20); return '+20 credit score!'; }, type: 'gold', category: 'personal' },
    { text: '💸 Unexpected expense', effect: () => { game.cash -= 500; return '-$500 misc expense'; }, type: 'negative', category: 'personal' },
    { text: '🎉 Side gig income!', effect: () => { game.cash += 800; return '+$800 side income!'; }, type: 'positive', category: 'career' }
];

export const majorEvents = [
    { text: '💊 Medical emergency!', effect: () => { game.cash -= 3000; return '-$3,000 medical bills'; }, type: 'negative', category: 'personal' },
    { text: '🎰 Small inheritance', effect: () => { game.cash += 5000; return '+$5,000 inheritance!'; }, type: 'positive', category: 'personal' },
    { text: '📉 Market correction', effect: () => { 
        game.assets.filter(a => a.type === 'stock').forEach(a => a.value *= 0.85); 
        return 'Stocks down 15%!'; 
    }, type: 'negative', category: 'market' },
    { text: '📈 Market rally!', effect: () => { 
        game.assets.filter(a => a.type === 'stock').forEach(a => a.value *= 1.12); 
        return 'Stocks up 12%!'; 
    }, type: 'positive', category: 'market' }
];

export const propertyEvents = [
    { text: '🔨 Major repair needed!', effect: (asset) => { const cost = Math.round(asset.value * 0.02); game.cash -= cost; return `-$${cost.toLocaleString()} repair on ${asset.name}`; }, type: 'negative' },
    { text: '🏚️ Vacancy!', effect: (asset) => { asset.isVacant = true; asset.vacantMonths = 3; return `${asset.name} is now vacant for 3 months`; }, type: 'negative' },
    { text: '🏘️ Area improvement!', effect: (asset) => { asset.value *= 1.08; return `${asset.name} value up 8%!`; }, type: 'positive' },
    { text: '😤 Problem tenant', effect: (asset) => { const cost = 1000; game.cash -= cost; return `-$${cost} tenant issue on ${asset.name}`; }, type: 'negative' }
];

export const businessEvents = [
    { text: '📊 Competition entered market', effect: (asset) => { asset.income = Math.round(asset.income * 0.85); return `${asset.name} income reduced by competition`; }, type: 'negative' },
    { text: '🚀 Viral success!', effect: (asset) => { asset.income = Math.round(asset.income * 1.25); return `${asset.name} income up 25%!`; }, type: 'positive' },
    { text: '⚙️ Equipment failure', effect: (asset) => { const cost = Math.round(asset.value * 0.1); game.cash -= cost; return `-$${cost.toLocaleString()} equipment repair`; }, type: 'negative' },
    { text: '📈 Expansion opportunity', effect: (asset) => { asset.canExpand = true; return `${asset.name} can be expanded!`; }, type: 'gold' }
];

