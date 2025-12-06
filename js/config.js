// ===========================================
// ECONOMY SYSTEM
// ===========================================

export const economyPhases = {
    expansion: { duration: [24, 48], propertyMod: 1.1, rentMod: 1.0, businessMod: 1.1, stockMod: 1.15, rateMod: 1.0, vacancyMod: 0.7, jobLossRisk: 0.01 },
    peak: { duration: [6, 12], propertyMod: 1.2, rentMod: 1.05, businessMod: 1.05, stockMod: 1.0, rateMod: 1.2, vacancyMod: 0.8, jobLossRisk: 0.02 },
    recession: { duration: [12, 24], propertyMod: 0.85, rentMod: 0.9, businessMod: 0.8, stockMod: 0.7, rateMod: 0.8, vacancyMod: 1.5, jobLossRisk: 0.08 },
    recovery: { duration: [12, 24], propertyMod: 0.95, rentMod: 0.95, businessMod: 0.95, stockMod: 1.1, rateMod: 0.9, vacancyMod: 1.0, jobLossRisk: 0.03 }
};

export const phaseTransitions = {
    expansion: 'peak',
    peak: 'recession',
    recession: 'recovery',
    recovery: 'expansion'
};

// ===========================================
// LIFESTYLE SYSTEM
// ===========================================

export const lifestyles = {
    frugal: { expenses: 1200, salaryMod: 0.9, investAccessMod: 0.9, description: 'Live simply, save more' },
    normal: { expenses: 1500, salaryMod: 1.0, investAccessMod: 1.0, description: 'Balanced lifestyle' },
    comfortable: { expenses: 2000, salaryMod: 1.1, investAccessMod: 1.1, description: 'Better networking' },
    luxury: { expenses: 3500, salaryMod: 1.2, investAccessMod: 1.2, description: 'Best opportunities' }
};

// ===========================================
// ASSET DATA
// ===========================================

export const properties = [
    { name: 'Small Rental', price: 80000, grossRent: 900, appreciation: 0.03, iqReq: 10, tag: 'starter', maintenanceRate: 0.008, taxRate: 0.01, insuranceRate: 0.004, vacancyRate: 0.08 },
    { name: 'Duplex', price: 150000, grossRent: 1600, appreciation: 0.035, iqReq: 20, maintenanceRate: 0.008, taxRate: 0.01, insuranceRate: 0.004, vacancyRate: 0.07 },
    { name: 'Small Apartment', price: 300000, grossRent: 3200, appreciation: 0.04, iqReq: 35, tag: 'popular', maintenanceRate: 0.008, taxRate: 0.01, insuranceRate: 0.004, vacancyRate: 0.06 },
    { name: 'Commercial Property', price: 500000, grossRent: 5500, appreciation: 0.03, iqReq: 50, maintenanceRate: 0.006, taxRate: 0.012, insuranceRate: 0.005, vacancyRate: 0.1 },
    { name: 'Apartment Complex', price: 1000000, grossRent: 11000, appreciation: 0.035, iqReq: 70, tag: 'premium', maintenanceRate: 0.006, taxRate: 0.01, insuranceRate: 0.004, vacancyRate: 0.05 },
    { name: 'Townhouse', price: 120000, grossRent: 1400, appreciation: 0.035, iqReq: 15, maintenanceRate: 0.008, taxRate: 0.01, insuranceRate: 0.004, vacancyRate: 0.07 },
    { name: 'Single Family Home', price: 200000, grossRent: 2200, appreciation: 0.032, iqReq: 25, tag: 'popular', maintenanceRate: 0.008, taxRate: 0.01, insuranceRate: 0.004, vacancyRate: 0.06 },
    { name: 'Warehouse', price: 400000, grossRent: 4500, appreciation: 0.028, iqReq: 45, maintenanceRate: 0.006, taxRate: 0.012, insuranceRate: 0.005, vacancyRate: 0.12 },
    { name: 'Retail Storefront', price: 350000, grossRent: 4000, appreciation: 0.03, iqReq: 40, maintenanceRate: 0.007, taxRate: 0.012, insuranceRate: 0.005, vacancyRate: 0.10 },
    { name: 'Office Building', price: 750000, grossRent: 8500, appreciation: 0.032, iqReq: 60, tag: 'premium', maintenanceRate: 0.006, taxRate: 0.012, insuranceRate: 0.005, vacancyRate: 0.08 },
    { name: 'Mobile Home Park', price: 600000, grossRent: 7000, appreciation: 0.035, iqReq: 55, maintenanceRate: 0.007, taxRate: 0.01, insuranceRate: 0.004, vacancyRate: 0.06 },
    { name: 'Storage Units', price: 300000, grossRent: 3500, appreciation: 0.03, iqReq: 35, tag: 'popular', maintenanceRate: 0.005, taxRate: 0.01, insuranceRate: 0.003, vacancyRate: 0.05 },
    { name: 'Vacation Rental', price: 250000, grossRent: 3000, appreciation: 0.04, iqReq: 30, maintenanceRate: 0.009, taxRate: 0.01, insuranceRate: 0.005, vacancyRate: 0.15 }
];

export const businesses = [
    { name: 'Vending Route', price: 15000, baseIncome: 250, growth: 0.02, iqReq: 15, failureRisk: 0.05, tag: 'low-risk' },
    { name: 'E-commerce Store', price: 30000, baseIncome: 500, growth: 0.05, iqReq: 25, failureRisk: 0.15, tag: 'popular' },
    { name: 'Laundromat', price: 100000, baseIncome: 1200, growth: 0.03, iqReq: 40, failureRisk: 0.08 },
    { name: 'Franchise', price: 250000, baseIncome: 3000, growth: 0.04, iqReq: 55, failureRisk: 0.10 },
    { name: 'Tech Startup', price: 500000, baseIncome: 2000, growth: 0.15, iqReq: 75, failureRisk: 0.30, tag: 'high-risk' },
    { name: 'Food Truck', price: 25000, baseIncome: 600, growth: 0.04, iqReq: 20, failureRisk: 0.12, tag: 'popular' },
    { name: 'Coffee Shop', price: 80000, baseIncome: 1500, growth: 0.03, iqReq: 35, failureRisk: 0.15 },
    { name: 'Consulting Firm', price: 50000, baseIncome: 1200, growth: 0.06, iqReq: 45, failureRisk: 0.10 },
    { name: 'Rental Car Service', price: 120000, baseIncome: 2000, growth: 0.03, iqReq: 50, failureRisk: 0.12 },
    { name: 'Digital Marketing Agency', price: 60000, baseIncome: 1800, growth: 0.08, iqReq: 40, failureRisk: 0.12, tag: 'popular' },
    { name: 'Restaurant', price: 200000, baseIncome: 4000, growth: 0.04, iqReq: 60, failureRisk: 0.25, tag: 'high-risk' },
    { name: 'Gym/Fitness Center', price: 150000, baseIncome: 3500, growth: 0.05, iqReq: 55, failureRisk: 0.15 },
    { name: 'Online Education Platform', price: 100000, baseIncome: 2500, growth: 0.10, iqReq: 50, failureRisk: 0.12 }
];

export const stocks = [
    { name: 'Coca-Cola (KO)', minBuy: 500, returnRate: 0.08, dividend: 0.031, volatility: 0.15, iqReq: 5, tag: 'starter' },
    { name: 'Tesla (TSLA)', minBuy: 1000, returnRate: 0.18, dividend: 0, volatility: 0.40, iqReq: 20, tag: 'high-risk' },
    { name: 'Apple (AAPL)', minBuy: 500, returnRate: 0.12, dividend: 0.005, volatility: 0.25, iqReq: 10, tag: 'popular' },
    { name: 'Microsoft (MSFT)', minBuy: 500, returnRate: 0.11, dividend: 0.007, volatility: 0.22, iqReq: 10 },
    { name: 'Johnson & Johnson (JNJ)', minBuy: 500, returnRate: 0.07, dividend: 0.032, volatility: 0.18, iqReq: 5, tag: 'safe' },
    { name: 'Amazon (AMZN)', minBuy: 1000, returnRate: 0.13, dividend: 0, volatility: 0.30, iqReq: 15, tag: 'high-risk' },
    { name: 'Berkshire Hathaway (BRK.B)', minBuy: 500, returnRate: 0.10, dividend: 0, volatility: 0.20, iqReq: 25 },
    { name: 'Visa (V)', minBuy: 500, returnRate: 0.14, dividend: 0.007, volatility: 0.24, iqReq: 15 },
    { name: 'Procter & Gamble (PG)', minBuy: 500, returnRate: 0.08, dividend: 0.025, volatility: 0.16, iqReq: 5, tag: 'safe' },
    { name: 'NVIDIA (NVDA)', minBuy: 1000, returnRate: 0.25, dividend: 0, volatility: 0.50, iqReq: 30, tag: 'high-risk' }
];

export const cryptocurrencies = [
    { name: 'Bitcoin (BTC)', symbol: 'BTC', minBuy: 500, returnRate: 0.18, volatility: 0.60, stakingYield: 0, iqReq: 15, tag: 'popular' },
    { name: 'Ethereum (ETH)', symbol: 'ETH', minBuy: 400, returnRate: 0.16, volatility: 0.50, stakingYield: 0.04, iqReq: 12, tag: 'popular' },
    { name: 'Tether (USDT)', symbol: 'USDT', minBuy: 200, returnRate: 0.02, volatility: 0.02, stakingYield: 0.05, iqReq: 5, tag: 'safe' },
    { name: 'BNB (BNB)', symbol: 'BNB', minBuy: 300, returnRate: 0.12, volatility: 0.40, stakingYield: 0.03, iqReq: 10 },
    { name: 'Solana (SOL)', symbol: 'SOL', minBuy: 300, returnRate: 0.20, volatility: 0.65, stakingYield: 0.05, iqReq: 18, tag: 'high-risk' }
];

export const education = [
    { name: 'Finance Books', price: 100, iqGain: 5, instant: true },
    { name: 'Online Course', price: 400, iqGain: 10, tag: 'recommended', instant: true },
    { name: 'Mentorship', price: 3500, iqGain: 18, instant: true },
    { name: 'Software Bootcamp', price: 12000, iqGain: 12, monthsRequired: 6, degreeType: 'certificate', degreeId: 'cs_bootcamp', tag: 'starter' },
    { name: "Computer Science Bachelor's", price: 40000, iqGain: 25, monthsRequired: 48, degreeType: 'bachelors', degreeId: 'cs_bachelors', tag: 'degree' },
    { name: "Computer Science Master's", price: 65000, iqGain: 40, monthsRequired: 24, degreeType: 'masters', degreeId: 'cs_masters', prerequisites: ['cs_bachelors'], tag: 'degree' },
    { name: "Finance Bachelor's", price: 35000, iqGain: 22, monthsRequired: 48, degreeType: 'bachelors', degreeId: 'finance_bachelors', tag: 'degree' },
    { name: "Finance Master's", price: 60000, iqGain: 35, monthsRequired: 24, degreeType: 'masters', degreeId: 'finance_masters', prerequisites: ['finance_bachelors'], tag: 'degree' },
    { name: "Nursing Bachelor's", price: 38000, iqGain: 24, monthsRequired: 48, degreeType: 'bachelors', degreeId: 'nursing_bachelors', tag: 'degree' },
    { name: "Healthcare Leadership Master's", price: 65000, iqGain: 38, monthsRequired: 24, degreeType: 'masters', degreeId: 'health_masters', prerequisites: ['nursing_bachelors'], tag: 'degree' },
    { name: 'MBA Program', price: 70000, iqGain: 45, monthsRequired: 24, degreeType: 'mba', degreeId: 'mba', requiresAnyBachelors: true, tag: 'premium' }
];

// ===========================================
// JOB SYSTEM
// ===========================================

export const jobFields = ['Tech', 'Finance', 'Healthcare', 'Sales', 'Education', 'Engineering', 'Law', 'Marketing'];

export const jobLevels = [
    { level: 0, title: 'Entry Level', monthsToPromote: 12 },
    { level: 1, title: 'Junior', monthsToPromote: 18 },
    { level: 2, title: 'Mid-Level', monthsToPromote: 24 },
    { level: 3, title: 'Senior', monthsToPromote: 30 },
    { level: 4, title: 'Manager', monthsToPromote: 36 },
    { level: 5, title: 'Director', monthsToPromote: 48 },
    { level: 6, title: 'VP', monthsToPromote: 60 },
    { level: 7, title: 'C-Level', monthsToPromote: 0 }
];

export const jobs = {
    Tech: [
        { level: 0, title: 'Entry Level Tech', baseSalary: 3500, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Junior Developer', baseSalary: 4500, educationReq: 'none', iqReq: 10, requiredDegrees: ['cs_bachelors', 'cs_bootcamp'] },
        { level: 2, title: 'Mid-Level Developer', baseSalary: 6000, educationReq: 'bachelors', iqReq: 20, requiredDegrees: ['cs_bachelors'] },
        { level: 3, title: 'Senior Developer', baseSalary: 8500, educationReq: 'bachelors', iqReq: 35, requiredDegrees: ['cs_bachelors'] },
        { level: 4, title: 'Tech Manager', baseSalary: 12000, educationReq: 'bachelors', iqReq: 50, requiredDegrees: ['cs_masters', 'mba'] },
        { level: 5, title: 'Tech Director', baseSalary: 18000, educationReq: 'masters', iqReq: 70, requiredDegrees: ['cs_masters', 'mba'] },
        { level: 6, title: 'VP of Engineering', baseSalary: 28000, educationReq: 'masters', iqReq: 85, requiredDegrees: ['cs_masters', 'mba'] },
        { level: 7, title: 'CTO', baseSalary: 50000, educationReq: 'masters', iqReq: 100, requiredDegrees: ['cs_masters', 'mba'] }
    ],
    Finance: [
        { level: 0, title: 'Entry Level Finance', baseSalary: 3200, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Junior Analyst', baseSalary: 4200, educationReq: 'bachelors', iqReq: 10, requiredDegrees: ['finance_bachelors'] },
        { level: 2, title: 'Financial Analyst', baseSalary: 5800, educationReq: 'bachelors', iqReq: 20, requiredDegrees: ['finance_bachelors'] },
        { level: 3, title: 'Senior Analyst', baseSalary: 8200, educationReq: 'bachelors', iqReq: 35, requiredDegrees: ['finance_bachelors'] },
        { level: 4, title: 'Finance Manager', baseSalary: 11500, educationReq: 'bachelors', iqReq: 50, requiredDegrees: ['finance_masters', 'mba'] },
        { level: 5, title: 'Finance Director', baseSalary: 17000, educationReq: 'masters', iqReq: 70, requiredDegrees: ['finance_masters', 'mba'] },
        { level: 6, title: 'VP of Finance', baseSalary: 26000, educationReq: 'masters', iqReq: 85, requiredDegrees: ['finance_masters', 'mba'] },
        { level: 7, title: 'CFO', baseSalary: 48000, educationReq: 'masters', iqReq: 100, requiredDegrees: ['finance_masters', 'mba'] }
    ],
    Healthcare: [
        { level: 0, title: 'Entry Level Healthcare', baseSalary: 3000, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Junior Healthcare Worker', baseSalary: 4000, educationReq: 'none', iqReq: 10 },
        { level: 2, title: 'Registered Nurse', baseSalary: 5500, educationReq: 'bachelors', iqReq: 20, requiredDegrees: ['nursing_bachelors'] },
        { level: 3, title: 'Senior Nurse', baseSalary: 7800, educationReq: 'bachelors', iqReq: 35, requiredDegrees: ['nursing_bachelors'] },
        { level: 4, title: 'Nurse Manager', baseSalary: 11000, educationReq: 'bachelors', iqReq: 50, requiredDegrees: ['nursing_bachelors'] },
        { level: 5, title: 'Healthcare Director', baseSalary: 16000, educationReq: 'masters', iqReq: 70, requiredDegrees: ['health_masters', 'mba'] },
        { level: 6, title: 'VP of Healthcare', baseSalary: 24000, educationReq: 'masters', iqReq: 85, requiredDegrees: ['health_masters', 'mba'] },
        { level: 7, title: 'Chief Medical Officer', baseSalary: 45000, educationReq: 'masters', iqReq: 100, requiredDegrees: ['health_masters', 'mba'] }
    ],
    Sales: [
        { level: 0, title: 'Entry Level Sales', baseSalary: 2800, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Junior Sales Rep', baseSalary: 3800, educationReq: 'none', iqReq: 10 },
        { level: 2, title: 'Sales Representative', baseSalary: 5200, educationReq: 'bachelors', iqReq: 20 },
        { level: 3, title: 'Senior Sales Rep', baseSalary: 7500, educationReq: 'bachelors', iqReq: 35 },
        { level: 4, title: 'Sales Manager', baseSalary: 10500, educationReq: 'bachelors', iqReq: 50 },
        { level: 5, title: 'Sales Director', baseSalary: 15000, educationReq: 'masters', iqReq: 70 },
        { level: 6, title: 'VP of Sales', baseSalary: 22000, educationReq: 'masters', iqReq: 85 },
        { level: 7, title: 'Chief Revenue Officer', baseSalary: 42000, educationReq: 'masters', iqReq: 100 }
    ],
    Education: [
        { level: 0, title: 'Entry Level Education', baseSalary: 3000, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Teaching Assistant', baseSalary: 4000, educationReq: 'none', iqReq: 10 },
        { level: 2, title: 'Teacher', baseSalary: 5400, educationReq: 'bachelors', iqReq: 20 },
        { level: 3, title: 'Senior Teacher', baseSalary: 7600, educationReq: 'bachelors', iqReq: 35 },
        { level: 4, title: 'Department Head', baseSalary: 10800, educationReq: 'bachelors', iqReq: 50 },
        { level: 5, title: 'Principal', baseSalary: 15500, educationReq: 'masters', iqReq: 70 },
        { level: 6, title: 'VP of Education', baseSalary: 23000, educationReq: 'masters', iqReq: 85 },
        { level: 7, title: 'Superintendent', baseSalary: 44000, educationReq: 'masters', iqReq: 100 }
    ],
    Engineering: [
        { level: 0, title: 'Entry Level Engineer', baseSalary: 3600, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Junior Engineer', baseSalary: 4600, educationReq: 'none', iqReq: 10 },
        { level: 2, title: 'Engineer', baseSalary: 6200, educationReq: 'bachelors', iqReq: 20 },
        { level: 3, title: 'Senior Engineer', baseSalary: 8800, educationReq: 'bachelors', iqReq: 35 },
        { level: 4, title: 'Engineering Manager', baseSalary: 12500, educationReq: 'bachelors', iqReq: 50 },
        { level: 5, title: 'Engineering Director', baseSalary: 18500, educationReq: 'masters', iqReq: 70 },
        { level: 6, title: 'VP of Engineering', baseSalary: 29000, educationReq: 'masters', iqReq: 85 },
        { level: 7, title: 'Chief Engineer', baseSalary: 52000, educationReq: 'masters', iqReq: 100 }
    ],
    Law: [
        { level: 0, title: 'Entry Level Legal', baseSalary: 3400, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Legal Assistant', baseSalary: 4400, educationReq: 'none', iqReq: 10 },
        { level: 2, title: 'Associate Attorney', baseSalary: 6000, educationReq: 'bachelors', iqReq: 20 },
        { level: 3, title: 'Senior Attorney', baseSalary: 8500, educationReq: 'bachelors', iqReq: 35 },
        { level: 4, title: 'Partner', baseSalary: 12000, educationReq: 'bachelors', iqReq: 50 },
        { level: 5, title: 'Managing Partner', baseSalary: 17500, educationReq: 'masters', iqReq: 70 },
        { level: 6, title: 'VP Legal', baseSalary: 27000, educationReq: 'masters', iqReq: 85 },
        { level: 7, title: 'General Counsel', baseSalary: 49000, educationReq: 'masters', iqReq: 100 }
    ],
    Marketing: [
        { level: 0, title: 'Entry Level Marketing', baseSalary: 3100, educationReq: 'none', iqReq: 5 },
        { level: 1, title: 'Junior Marketer', baseSalary: 4100, educationReq: 'none', iqReq: 10 },
        { level: 2, title: 'Marketing Specialist', baseSalary: 5600, educationReq: 'bachelors', iqReq: 20 },
        { level: 3, title: 'Senior Marketer', baseSalary: 8000, educationReq: 'bachelors', iqReq: 35 },
        { level: 4, title: 'Marketing Manager', baseSalary: 11200, educationReq: 'bachelors', iqReq: 50 },
        { level: 5, title: 'Marketing Director', baseSalary: 16500, educationReq: 'masters', iqReq: 70 },
        { level: 6, title: 'VP of Marketing', baseSalary: 25000, educationReq: 'masters', iqReq: 85 },
        { level: 7, title: 'CMO', baseSalary: 46000, educationReq: 'masters', iqReq: 100 }
    ]
};

