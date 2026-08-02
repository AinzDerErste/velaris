const defaults = {
  plotSize: 640,
  dailyWage: 104,
  resourcesPremium: 20,
  scarcityPremium: 50,
  wageDays: 168,
};

const elements = {
  form: document.querySelector("#calculator-form"),
  plotSize: document.querySelector("#plot-size"),
  dailyWage: document.querySelector("#daily-wage"),
  resourcesPremium: document.querySelector("#resources-premium"),
  scarcityPremium: document.querySelector("#scarcity-premium"),
  wageDays: document.querySelector("#wage-days"),
  landValue: document.querySelector("#land-value"),
  valueCaption: document.querySelector("#value-caption"),
  valuePerSqm: document.querySelector("#value-per-sqm"),
  combinedPremium: document.querySelector("#combined-premium"),
  formulaDisplay: document.querySelector("#formula-display"),
  baseValue: document.querySelector("#base-value"),
  resourceValue: document.querySelector("#resource-value"),
  scarcityValue: document.querySelector("#scarcity-value"),
  resourceFactorLabel: document.querySelector("#resource-factor-label"),
  scarcityFactorLabel: document.querySelector("#scarcity-factor-label"),
  resetButton: document.querySelector("#reset-button"),
  copyButton: document.querySelector("#copy-button"),
  copyLabel: document.querySelector("#copy-label"),
};

const integerFormatter = new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("de-CH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function numberFrom(input) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : 0;
}

function factorFrom(premium) {
  return Math.max(0, 1 + premium / 100);
}

function formatFactor(value) {
  return value.toFixed(2);
}

function readCalculation() {
  const plotSize = Math.max(0, numberFrom(elements.plotSize));
  const dailyWage = Math.max(0, numberFrom(elements.dailyWage));
  const resourcesPremium = Math.max(-100, numberFrom(elements.resourcesPremium));
  const scarcityPremium = Math.max(-100, numberFrom(elements.scarcityPremium));
  const wageDays = Math.max(0, numberFrom(elements.wageDays));
  const resourceFactor = factorFrom(resourcesPremium);
  const scarcityFactor = factorFrom(scarcityPremium);
  const baseValue = (plotSize / 100) * dailyWage * wageDays;
  const resourceValue = baseValue * resourceFactor;
  const totalValue = resourceValue * scarcityFactor;

  return {
    plotSize,
    dailyWage,
    resourcesPremium,
    scarcityPremium,
    wageDays,
    resourceFactor,
    scarcityFactor,
    baseValue,
    resourceValue,
    totalValue,
    valuePerSqm: plotSize > 0 ? totalValue / plotSize : 0,
    combinedPremium: baseValue > 0 ? (totalValue / baseValue - 1) * 100 : 0,
  };
}

function render() {
  const value = readCalculation();

  elements.landValue.textContent = integerFormatter.format(value.totalValue);
  elements.valueCaption.textContent = `for ${integerFormatter.format(value.plotSize)} m² of territory`;
  elements.valuePerSqm.textContent = decimalFormatter.format(value.valuePerSqm);
  elements.combinedPremium.textContent = `${value.combinedPremium >= 0 ? "+" : ""}${integerFormatter.format(value.combinedPremium)}%`;
  elements.baseValue.textContent = integerFormatter.format(value.baseValue);
  elements.resourceValue.textContent = integerFormatter.format(value.resourceValue);
  elements.scarcityValue.textContent = integerFormatter.format(value.totalValue);
  elements.resourceFactorLabel.textContent = `Base value × ${formatFactor(value.resourceFactor)}`;
  elements.scarcityFactorLabel.textContent = `Resource value × ${formatFactor(value.scarcityFactor)}`;
  elements.formulaDisplay.textContent = `(${value.plotSize} ÷ 100) × ${value.dailyWage} × ${value.wageDays} × ${formatFactor(value.resourceFactor)} × ${formatFactor(value.scarcityFactor)}`;
}

function reset() {
  for (const [key, value] of Object.entries(defaults)) {
    elements[key].value = value;
  }
  render();
  elements.plotSize.focus();
}

async function copyCalculation() {
  const value = readCalculation();
  const calculation = `(${value.plotSize} / 100) × ${value.dailyWage} × ${value.wageDays} × ${formatFactor(value.resourceFactor)} × ${formatFactor(value.scarcityFactor)} = ${decimalFormatter.format(value.totalValue)}`;

  try {
    await navigator.clipboard.writeText(calculation);
    elements.copyLabel.textContent = "Copied to clipboard";
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = calculation;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    elements.copyLabel.textContent = "Copied to clipboard";
  }

  window.setTimeout(() => {
    elements.copyLabel.textContent = "Copy calculation";
  }, 1800);
}

elements.form.addEventListener("input", render);
elements.form.addEventListener("submit", (event) => event.preventDefault());
elements.resetButton.addEventListener("click", reset);
elements.copyButton.addEventListener("click", copyCalculation);

render();
