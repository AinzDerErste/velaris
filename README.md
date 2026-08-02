# Velaris Land Calculator

A lightweight land valuation calculator for **Velaris**, a community in **Seed**.

The calculator gives the community a consistent starting point for valuing useful territory. It accounts for plot size, the current average daily wage, valuable resources, and the scarcity of land that can be expanded and zoned.

## Formula

```text
(area in m² / 100) × average daily wage × 168 × resources factor × scarcity factor
```

Premiums entered in the calculator are converted into factors automatically. For example, a 20% resources premium becomes `1.20`, while a 50% scarcity premium becomes `1.50`.

### Example

For a 640 m² chyropyrite plot, using an average daily wage of 104:

```text
(640 / 100) × 104 × 168 × 1.20 × 1.50 = 201,277.44
```

Rounded estimated land value: **201,278**.

## Using the calculator

Open `src/index.html` in a browser. Change any input and the valuation, premiums, and calculation breakdown update immediately.

The project is deliberately dependency-free. It consists of plain HTML, CSS, and JavaScript, so there is no install or build step.

## Project structure

```text
src/
├── index.html   # Calculator interface
├── styles.css   # Responsive visual design
└── app.js       # Formula and interactions
```

## GitHub Pages

The included GitHub Actions workflow publishes the contents of `src/` whenever a change is pushed to `main` or `master`.

In the GitHub repository, select **Settings → Pages → Source → GitHub Actions**. The next push will deploy the calculator.

## Note

This is a community valuation model, not an official Seed pricing system. Its assumptions can be adjusted as Velaris gains better information about wages, territory expansion, zoning time, resources, and scarcity.
