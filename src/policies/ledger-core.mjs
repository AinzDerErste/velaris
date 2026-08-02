export const POLICY_STATUSES = Object.freeze([
  "draft",
  "active",
  "under-review",
  "superseded",
  "archived",
]);

export const POLICY_CATEGORIES = Object.freeze([
  Object.freeze({ value: "executive-orders", label: "Executive Orders" }),
  Object.freeze({ value: "legislative", label: "Legislative" }),
  Object.freeze({ value: "urban-manager", label: "Urban Manager" }),
  Object.freeze({ value: "treasury", label: "Treasury" }),
]);

function clean(value) {
  return String(value ?? "").trim();
}

function normalizedDate(value) {
  const date = Date.parse(clean(value));
  return Number.isFinite(date) ? date : 0;
}

export function policyCategoryLabel(value) {
  const normalized = clean(value).toLocaleLowerCase();
  return POLICY_CATEGORIES.find((category) => category.value === normalized)?.label || clean(value);
}

export function policySearchText(policy) {
  const sections = Array.isArray(policy.sections)
    ? policy.sections.flatMap((section) => [section.heading, section.body])
    : [];
  const relatedLinks = Array.isArray(policy.relatedLinks)
    ? policy.relatedLinks.flatMap((link) => [link.label, link.url])
    : [];

  return [
    policy.id,
    policy.title,
    policy.summary,
    policy.status,
    policy.category,
    policyCategoryLabel(policy.category),
    policy.authority,
    ...(Array.isArray(policy.tags) ? policy.tags : []),
    ...(Array.isArray(policy.supersedes) ? policy.supersedes : []),
    ...relatedLinks,
    ...sections,
  ].map(clean).join(" ").toLocaleLowerCase();
}

export function validatePolicies(records) {
  const seenIds = new Set();

  return records.map((policy, index) => {
    const id = clean(policy.id);
    const title = clean(policy.title);
    const status = clean(policy.status).toLocaleLowerCase();
    const category = clean(policy.category).toLocaleLowerCase();

    if (!id || !title) throw new Error(`Policy at index ${index} requires an id and title.`);
    if (seenIds.has(id)) throw new Error(`Duplicate policy id: ${id}`);
    if (!POLICY_STATUSES.includes(status)) throw new Error(`Unsupported status for ${id}: ${status}`);
    if (!POLICY_CATEGORIES.some((option) => option.value === category)) {
      throw new Error(`Unsupported category for ${id}: ${category || "missing"}`);
    }
    if (policy.relatedLinks !== undefined && (!Array.isArray(policy.relatedLinks)
      || policy.relatedLinks.some((link) => !clean(link.label) || !clean(link.url)))) {
      throw new Error(`Invalid related link for ${id}.`);
    }
    seenIds.add(id);

    return { ...policy, id, title, status, category };
  });
}

export function filterAndSortPolicies(records, state = {}) {
  const query = clean(state.query).toLocaleLowerCase();
  const queryTerms = query.split(/\s+/).filter(Boolean);
  const status = clean(state.status || "all").toLocaleLowerCase();
  const category = clean(state.category || "all").toLocaleLowerCase();
  const sort = clean(state.sort || "newest").toLocaleLowerCase();

  const filtered = records.filter((policy) => {
    const searchText = policySearchText(policy);
    const matchesQuery = !queryTerms.length || queryTerms.every((term) => searchText.includes(term));
    const matchesStatus = status === "all" || clean(policy.status).toLocaleLowerCase() === status;
    const matchesCategory = category === "all" || clean(policy.category).toLocaleLowerCase() === category;
    return matchesQuery && matchesStatus && matchesCategory;
  });

  return filtered.sort((left, right) => {
    if (sort === "title") return clean(left.title).localeCompare(clean(right.title));

    const leftDate = normalizedDate(left.effectiveOn || left.adoptedOn);
    const rightDate = normalizedDate(right.effectiveOn || right.adoptedOn);
    return sort === "oldest" ? leftDate - rightDate : rightDate - leftDate;
  });
}

export function policyCategories() {
  return POLICY_CATEGORIES;
}
