# Velaris Community Site

A lightweight community website for **Velaris**, a society in **SEED**.

The site includes:

- **Home** — a public landing page introducing Velaris.
- **History** — a milestone archive documenting how the society changes over time.
- **Policies** — a searchable public ledger for community policy that operates outside the game.
- **Tools** — a directory of community planning calculators.
- **Land Calculator** — estimates territory value from plot size, wages, resources, and scarcity.
- **Business Profit Calculator** — estimates revenue, labor, fees, total costs, profit margins, and break-even prices.

Use the shared navigation in the site header to move between the community pages and tools.

## Land valuation formula

```text
(area in m² / 100) × average daily wage × 168 × resources factor × scarcity factor
```

Premiums entered in the calculator are converted into factors automatically. For example, a 20% resources premium becomes `1.20`, while a 50% scarcity premium becomes `1.50`.

### Example

For a 640 m² chyropyrite plot, using an average daily wage of 104:

```text
(640 / 100) × 104 × 168 × 1.20 × 1.50 = 201,277.44
```

Rounded estimated land value: **201,277**.

## Business profit model

```text
revenue = units × sale price
labor = production hours × workers × (daily wage ÷ workday hours)
market fees = revenue × fee percentage
net profit = revenue − materials − labor − market fees − other costs
```

The break-even price accounts for percentage-based market fees, rather than treating them as a fixed cost.

## Using the calculators

Serve the `src/` directory with any static web server and open the displayed local URL. Change any input and its results update immediately.

The project is deliberately dependency-free. It consists of plain HTML, CSS, and JavaScript, so there is no install or build step.

## Publishing policies

Public policy records live in `src/policies/policy-data.mjs`. Add one structured record per policy using the documented schema in that file. Each policy supports:

- A stable policy ID and title
- Draft, active, under-review, superseded, or archived status
- Category, responsible authority, and searchable tags
- Adoption, effective, and review dates
- Full policy sections, superseded policy IDs, and an optional source link
- Related calculators, forms, or supporting resources

Superseded and archived policies should remain in the data file so the public history stays searchable. The ledger validates IDs, statuses, and categories when it loads.

Supported policy categories use stable keys:

- `executive-orders` — Executive Orders
- `legislative` — Legislative
- `urban-manager` — Urban Manager
- `treasury` — Treasury

## Project structure

```text
src/
├── favicon.ico # Browser favicon
├── assets/
│   ├── seed-coin.png # Seed Coin currency icon
│   ├── week-1.png # First society history milestone
│   └── velaris-icon.png # Site icon
├── business/
│   ├── index.html  # Business calculator route
│   └── business.js # Business profit model and interactions
├── history/
│   └── index.html  # Society milestone archive
├── land/
│   └── index.html  # Land calculator route
├── policies/
│   ├── index.html        # Public policy ledger
│   ├── policy-data.mjs   # Published policy records and schema
│   ├── ledger-core.mjs   # Validation, full-text search, filtering, and sorting
│   └── ledger.mjs        # Ledger rendering and URL query state
├── tools/
│   └── index.html  # Community tools directory
├── index.html      # Community landing page
├── styles.css      # Shared responsive visual design
└── app.js          # Land valuation model and interactions
```

## GitHub Pages

The included GitHub Actions workflow publishes the contents of `src/` whenever a change is pushed to `main` or `master`.

In the GitHub repository, select **Settings → Pages → Source → GitHub Actions**. The next push will deploy the site.

## Note

This is a community valuation model, not an official Seed pricing system. Its assumptions can be adjusted as Velaris gains better information about wages, territory expansion, zoning time, resources, and scarcity.
