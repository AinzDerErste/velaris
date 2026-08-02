import { policies } from "./policy-data.mjs";
import { filterAndSortPolicies, policyCategories, policyCategoryLabel, validatePolicies } from "./ledger-core.mjs";

const records = validatePolicies([...policies]);

const elements = {
  controls: document.querySelector("#ledger-controls"),
  search: document.querySelector("#policy-search"),
  status: document.querySelector("#policy-status"),
  category: document.querySelector("#policy-category"),
  sort: document.querySelector("#policy-sort"),
  reset: document.querySelector("#ledger-reset"),
  count: document.querySelector("#policy-count"),
  results: document.querySelector("#ledger-results"),
};

const statusLabels = {
  draft: "Draft",
  active: "Active",
  "under-review": "Under review",
  superseded: "Superseded",
  archived: "Archived",
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatDate(value) {
  if (!value) return "Not recorded";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function appendMetadata(list, label, value) {
  if (!value) return;
  const item = element("div", "");
  item.append(element("dt", "", label), element("dd", "", value));
  list.append(item);
}

function createPolicyRecord(policy) {
  const article = element("article", "policy-record");
  article.id = policy.id;

  const topline = element("div", "policy-record-topline");
  const idLink = element("a", "policy-id", policy.id);
  idLink.href = `#${policy.id}`;
  const status = element("span", `policy-status policy-status-${policy.status}`, statusLabels[policy.status] || policy.status);
  topline.append(idLink, status);

  const title = element("h3", "", policy.title);
  const summary = element("p", "policy-summary", policy.summary || "No summary provided.");
  const metadata = element("dl", "policy-metadata");
  appendMetadata(metadata, "Category", policyCategoryLabel(policy.category));
  appendMetadata(metadata, "Authority", policy.authority);
  appendMetadata(metadata, "Adopted", policy.adoptedOn ? formatDate(policy.adoptedOn) : "Not yet adopted");
  appendMetadata(metadata, "Effective", policy.effectiveOn ? formatDate(policy.effectiveOn) : "Not recorded");
  appendMetadata(metadata, "Review", policy.reviewOn ? formatDate(policy.reviewOn) : "");

  article.append(topline, title, summary, metadata);

  if (Array.isArray(policy.tags) && policy.tags.length) {
    const tags = element("ul", "policy-tags");
    for (const tag of policy.tags) {
      const item = element("li", "", tag);
      tags.append(item);
    }
    article.append(tags);
  }

  if (Array.isArray(policy.sections) && policy.sections.length) {
    const details = element("details", "policy-body");
    details.append(element("summary", "", "Read full policy"));
    const content = element("div", "policy-body-content");
    for (const section of policy.sections) {
      const sectionNode = element("section", "policy-section");
      sectionNode.append(element("h4", "", section.heading || "Policy text"));
      for (const paragraph of String(section.body || "").split(/\n{2,}/).filter(Boolean)) {
        sectionNode.append(element("p", "", paragraph));
      }
      content.append(sectionNode);
    }
    if (Array.isArray(policy.supersedes) && policy.supersedes.length) {
      content.append(element("p", "policy-supersedes", `Supersedes: ${policy.supersedes.join(", ")}`));
    }
    if (policy.sourceUrl) {
      const source = element("a", "text-link", "View source record ↗");
      source.href = policy.sourceUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      content.append(source);
    }
    details.append(content);
    article.append(details);
  }

  if (Array.isArray(policy.relatedLinks) && policy.relatedLinks.length) {
    const related = element("div", "policy-related-links");
    related.append(element("span", "", "Related resources"));
    for (const link of policy.relatedLinks) {
      const anchor = element("a", "text-link", `${link.label} ↗`);
      anchor.href = link.url;
      related.append(anchor);
    }
    article.append(related);
  }

  return article;
}

function currentState() {
  return {
    query: elements.search.value,
    status: elements.status.value,
    category: elements.category.value,
    sort: elements.sort.value,
  };
}

function updateUrl(state) {
  const url = new URL(window.location.href);
  const values = { q: state.query.trim(), status: state.status, category: state.category, sort: state.sort };
  const defaults = { q: "", status: "all", category: "all", sort: "newest" };

  for (const [key, value] of Object.entries(values)) {
    if (value && value !== defaults[key]) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function createEmptyState(hasFilters) {
  const empty = element("div", "ledger-empty");
  empty.append(
    element("span", "ledger-empty-mark", "V"),
    element("h3", "", hasFilters ? "No policies match these filters." : "The ledger is ready for its first record."),
    element("p", "", hasFilters
      ? "Try a broader search or clear the selected filters."
      : "Policies adopted outside SEED’s in-game systems will appear here with a stable ID, status, full text, and revision history."),
  );
  return empty;
}

function render() {
  const state = currentState();
  const visible = filterAndSortPolicies(records, state);
  elements.results.replaceChildren();
  elements.count.textContent = `${visible.length} ${visible.length === 1 ? "policy" : "policies"}`;

  const hasFilters = Boolean(state.query.trim()) || state.status !== "all" || state.category !== "all";
  if (!visible.length) elements.results.append(createEmptyState(hasFilters));
  else elements.results.append(...visible.map(createPolicyRecord));

  updateUrl(state);
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  elements.search.value = params.get("q") || "";
  elements.status.value = params.get("status") || "all";
  elements.category.value = params.get("category") || "all";
  elements.sort.value = params.get("sort") || "newest";
}

for (const category of policyCategories()) {
  const option = element("option", "", category.label);
  option.value = category.value;
  elements.category.append(option);
}

hydrateFromUrl();
elements.controls.addEventListener("input", render);
elements.controls.addEventListener("change", render);
elements.controls.addEventListener("submit", (event) => event.preventDefault());
elements.reset.addEventListener("click", () => {
  elements.controls.reset();
  render();
  elements.search.focus();
});

render();
