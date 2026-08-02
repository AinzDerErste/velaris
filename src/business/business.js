const defaults = {
  productName: "Construction materials",
  units: 10,
  salePrice: 550,
  materialCost: 2400,
  productionHours: 8,
  workers: 1,
  dailyWage: 104,
  workdayHours: 8,
  marketFee: 5,
  otherCosts: 100,
};

const elements = {
  form: document.querySelector("#business-form"),
  productName: document.querySelector("#product-name"),
  units: document.querySelector("#units"),
  salePrice: document.querySelector("#sale-price"),
  materialCost: document.querySelector("#material-cost"),
  productionHours: document.querySelector("#production-hours"),
  workers: document.querySelector("#workers"),
  dailyWage: document.querySelector("#daily-wage"),
  workdayHours: document.querySelector("#workday-hours"),
  marketFee: document.querySelector("#market-fee"),
  otherCosts: document.querySelector("#other-costs"),
  resultCard: document.querySelector("#result-card"),
  profitStatus: document.querySelector("#profit-status"),
  netProfit: document.querySelector("#net-profit"),
  profitCaption: document.querySelector("#profit-caption"),
  profitMargin: document.querySelector("#profit-margin"),
  breakEvenPrice: document.querySelector("#break-even-price"),
  profitPerHour: document.querySelector("#profit-per-hour"),
  returnOnCost: document.querySelector("#return-on-cost"),
  formulaDisplay: document.querySelector("#formula-display"),
  grossRevenue: document.querySelector("#gross-revenue"),
  laborCost: document.querySelector("#labor-cost"),
  laborCaption: document.querySelector("#labor-caption"),
  marketFeeCost: document.querySelector("#market-fee-cost"),
  marketFeeCaption: document.querySelector("#market-fee-caption"),
  totalCost: document.querySelector("#total-cost"),
  resetButton: document.querySelector("#reset-button"),
  copyButton: document.querySelector("#copy-button"),
  copyLabel: document.querySelector("#copy-label"),
};

const integerFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function numberFrom(input) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : 0;
}

function nonNegative(input) {
  return Math.max(0, numberFrom(input));
}

function readCalculation() {
  const productName = elements.productName.value.trim() || "Unnamed product";
  const units = nonNegative(elements.units);
  const salePrice = nonNegative(elements.salePrice);
  const materialCost = nonNegative(elements.materialCost);
  const productionHours = nonNegative(elements.productionHours);
  const workers = nonNegative(elements.workers);
  const dailyWage = nonNegative(elements.dailyWage);
  const workdayHours = nonNegative(elements.workdayHours);
  const marketFee = Math.min(99.99, nonNegative(elements.marketFee));
  const otherCosts = nonNegative(elements.otherCosts);

  const grossRevenue = units * salePrice;
  const laborHours = productionHours * workers;
  const hourlyWage = workdayHours > 0 ? dailyWage / workdayHours : 0;
  const laborCost = laborHours * hourlyWage;
  const marketFeeCost = grossRevenue * (marketFee / 100);
  const fixedCosts = materialCost + laborCost + otherCosts;
  const totalCost = fixedCosts + marketFeeCost;
  const netProfit = grossRevenue - totalCost;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const returnOnCost = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const profitPerHour = laborHours > 0 ? netProfit / laborHours : 0;
  const retainedRevenueRate = 1 - marketFee / 100;
  const breakEvenPrice = units > 0 && retainedRevenueRate > 0
    ? fixedCosts / units / retainedRevenueRate
    : 0;

  return {
    productName,
    units,
    salePrice,
    materialCost,
    otherCosts,
    marketFee,
    grossRevenue,
    laborHours,
    hourlyWage,
    laborCost,
    marketFeeCost,
    totalCost,
    netProfit,
    profitMargin,
    returnOnCost,
    profitPerHour,
    breakEvenPrice,
  };
}

function formatPercent(value) {
  return `${value >= 0 ? "+" : ""}${decimalFormatter.format(value)}%`;
}

function renderStatus(netProfit) {
  const tolerance = 0.005;
  const isProfit = netProfit > tolerance;
  const isLoss = netProfit < -tolerance;

  elements.resultCard.classList.toggle("is-loss", isLoss);
  elements.resultCard.classList.toggle("is-break-even", !isProfit && !isLoss);
  elements.profitStatus.textContent = isProfit ? "Profitable" : isLoss ? "Operating at a loss" : "Break even";
}

function render() {
  const value = readCalculation();

  renderStatus(value.netProfit);
  elements.netProfit.textContent = integerFormatter.format(value.netProfit);
  elements.profitCaption.textContent = `from ${integerFormatter.format(value.units)} units sold at ${decimalFormatter.format(value.salePrice)} each`;
  elements.profitMargin.textContent = formatPercent(value.profitMargin);
  elements.breakEvenPrice.textContent = decimalFormatter.format(value.breakEvenPrice);
  elements.profitPerHour.textContent = decimalFormatter.format(value.profitPerHour);
  elements.returnOnCost.textContent = formatPercent(value.returnOnCost);
  elements.grossRevenue.textContent = integerFormatter.format(value.grossRevenue);
  elements.laborCost.textContent = integerFormatter.format(value.laborCost);
  elements.laborCaption.textContent = `${decimalFormatter.format(value.laborHours)} worker-hours × ${decimalFormatter.format(value.hourlyWage)}`;
  elements.marketFeeCost.textContent = integerFormatter.format(value.marketFeeCost);
  elements.marketFeeCaption.textContent = `${decimalFormatter.format(value.marketFee)}% of gross revenue`;
  elements.totalCost.textContent = integerFormatter.format(value.totalCost);
  elements.formulaDisplay.textContent = `${integerFormatter.format(value.grossRevenue)} revenue − ${integerFormatter.format(value.totalCost)} costs = ${integerFormatter.format(value.netProfit)} profit`;
}

function reset() {
  for (const [key, value] of Object.entries(defaults)) {
    elements[key].value = value;
  }
  render();
  elements.productName.focus();
}

async function copyBusinessSummary() {
  const value = readCalculation();
  const summary = [
    `VELARIS business estimate — ${value.productName}`,
    `${integerFormatter.format(value.units)} units × ${decimalFormatter.format(value.salePrice)} = ${decimalFormatter.format(value.grossRevenue)} revenue`,
    `Costs: ${decimalFormatter.format(value.materialCost)} materials + ${decimalFormatter.format(value.laborCost)} labor + ${decimalFormatter.format(value.marketFeeCost)} fees + ${decimalFormatter.format(value.otherCosts)} other = ${decimalFormatter.format(value.totalCost)}`,
    `Net profit: ${decimalFormatter.format(value.netProfit)} (${formatPercent(value.profitMargin)} margin)`,
    `Break-even price: ${decimalFormatter.format(value.breakEvenPrice)} per unit`,
  ].join("\n");

  try {
    await navigator.clipboard.writeText(summary);
    elements.copyLabel.textContent = "Copied to clipboard";
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = summary;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    elements.copyLabel.textContent = "Copied to clipboard";
  }

  window.setTimeout(() => {
    elements.copyLabel.textContent = "Copy business summary";
  }, 1800);
}

elements.form.addEventListener("input", render);
elements.form.addEventListener("submit", (event) => event.preventDefault());
elements.resetButton.addEventListener("click", reset);
elements.copyButton.addEventListener("click", copyBusinessSummary);

render();
