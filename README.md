# Wealth Builder: The Rich Dad Simulation

Wealth Builder is a browser-based financial simulation game inspired by Rich Dad principles. You start at age 18 with a job, debts, and modest cash, then build wealth through properties, businesses, stocks, crypto, education, and career progression while navigating economic cycles.

## Quick Start

### Requirements
- Node.js 18+ (for running a simple static server)

### Run the game
```powershell
# From the repo root
npx --yes http-server -p 4173
# Then open http://localhost:4173 in your browser
```
If port 4173 is busy, pick another port (e.g., `-p 4174`).

## How to Play
- **Start**: Click “Begin Your Journey”.
- **Actions**: Use the center tabs to buy properties, start businesses, invest in stocks/crypto, manage jobs/education/debt, and adjust lifestyle.
- **Income & Expenses**: Left panel shows salary, passive income, debts, and cash flow.
- **Goals**: Escape the Rat Race (passive ≥ expenses), reach millionaire and generational wealth milestones.
- **Economy**: Phases (expansion, peak, recession, recovery) affect asset returns, vacancies, and job risk.
- **Progress**: Advance time with “Next Month” or “Skip Year”.
- **Assets**: Right panel lists holdings; click an asset to sell.
- **Events**: Random events and phase shifts are logged in the Events panel.

## Game Structure
- `index.html` — shell and layout.
- `css/` — styles.
- `js/state.js` — core game state.
- `js/config.js` — economy settings, assets, jobs, education programs.
- `js/core.js` — financial calculations (cash flow, net worth, interest).
- `js/ui.js` & `js/ui-render.js` — UI updates and action cards.
- `js/modals*.js` — modals for assets, education, jobs, debt, etc.
- `js/gameloop*.js` — monthly/yearly progression, events, asset updates.
- `js/achievements.js` — milestones and achievements.

## Modifying the Game
- **Add assets**: Extend arrays in `js/config.js` (`properties`, `businesses`, `stocks`, `cryptocurrencies`).
- **Tweak economy**: Adjust `economyPhases` in `js/config.js`.
- **Jobs & education**: Update degree programs and job requirements in `js/config.js`.
- **Balance**: Modify income/expense formulas in `js/core.js` and event impacts in `js/events.js`.
- **UI**: Change layout or styling in `index.html` and `css/`.

## Controls & Tips
- Buying requires enough cash; mortgages/loans are simulated in property calculations.
- Businesses can fail; crypto/stocks are volatile.
- Education unlocks job tiers; some roles require specific degrees.
- Lifestyle changes affect expenses and salary multipliers.
- Quitting your job boosts business income but removes salary.

## Testing
Run locally via the static server above and interact through the browser. No build step is required.

## License
MIT License. See `LICENSE` if provided; otherwise the above applies.


