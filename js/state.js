// ===========================================
// GAME STATE
// ===========================================

export let game = {
    month: 1,
    cash: 2000,
    baseSalary: 4000,
    salary: 4000,
    baseLivingExpenses: 1500,
    livingExpenses: 1500,
    creditScore: 680,
    financialIQ: 10,
    age: 18,
    deathAge: null,
    escapedRatRace: false,
    financiallyIndependent: false,
    isMillionaire: false,
    hasQuitJob: false,
    raiseReceivedThisYear: false,
    currentJob: {
        field: 'Tech',
        level: 0,
        title: 'Entry Level',
        baseSalary: 4000,
        monthsInPosition: 0
    },
    education: {
        hasBachelors: false,
        hasMasters: false,
        degreeField: null,
        educationInProgress: null,
        monthsRemaining: 0,
        startMonth: 0,
        completedDegrees: []
    },
    jobHistory: [],
    lifestyle: 'normal',
    economyPhase: 'expansion',
    economyMonthsInPhase: 0,
    baseInterestRate: 0.05,
    debts: [
        { name: 'Mortgage', balance: 180000, rate: 0.045, payment: 1200, type: 'mortgage', isGoodDebt: false },
        { name: 'Car Loan', balance: 15000, rate: 0.065, payment: 400, type: 'car', isGoodDebt: false },
        { name: 'Credit Card', balance: 8000, rate: 0.199, payment: 200, type: 'credit', isGoodDebt: false }
    ],
    assets: [],
    achievements: [],
    milestones: {
        ratRaceEscaped: false,
        financialIndependence: false,
        millionaire: false,
        generationalWealth: false
    },
    nextAssetId: 1
};

export let currentTab = 'properties';

export function setCurrentTab(tab) {
    currentTab = tab;
}

