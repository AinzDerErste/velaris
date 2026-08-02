/**
 * Public policy record schema.
 *
 * Add adopted community policies to the array below. Every record uses:
 * {
 *   id: "VEL-POL-001",                 // Stable, unique public identifier
 *   title: "Policy title",
 *   summary: "Short plain-language summary",
 *   status: "active",                 // draft | active | under-review | superseded | archived
 *   category: "executive-orders",     // executive-orders | legislative | urban-manager | treasury
 *   authority: "Council or responsible body",
 *   adoptedOn: "2026-08-02",          // ISO date or an empty string
 *   effectiveOn: "2026-08-02",        // ISO date or an empty string
 *   reviewOn: "",                     // Optional ISO review date
 *   tags: ["tag", "search term"],
 *   supersedes: [],                    // Earlier stable policy IDs
 *   sourceUrl: "",                    // Optional public discussion or vote record
 *   relatedLinks: [                    // Optional calculators, forms, or supporting resources
 *     { label: "Open related tool", url: "../land/" }
 *   ],
 *   sections: [
 *     { heading: "Purpose", body: "Full policy text." }
 *   ]
 * }
 */
export const policies = Object.freeze([
  {
    id: "VEL-POL-001",
    title: "Commercial Property Buyback & Industrial Expansion Policy",
    summary: "Allows eligible owners to transfer commercial property to Velaris in exchange for a certified valuation credit toward an approved industrial claim, helping productive enterprises expand without leaving valuable land behind.",
    status: "active",
    category: "urban-manager",
    authority: "Urban Manager, with Treasury certification",
    adoptedOn: "2026-08-02",
    effectiveOn: "2026-08-02",
    reviewOn: "",
    tags: [
      "land buyback",
      "commercial property",
      "industrial expansion",
      "industry",
      "claim credit",
      "property value",
      "land valuation",
    ],
    supersedes: [],
    sourceUrl: "",
    relatedLinks: [
      { label: "Open the Velaris Land Calculator", url: "../land/" },
    ],
    sections: [
      {
        heading: "Purpose",
        body: "Velaris shall maintain a voluntary, government-sponsored land buyback program that helps productive enterprises move from commercial property into appropriately zoned industrial claims. The program converts established property value into expansion capacity while returning surrendered land to the public portfolio for resale, reassignment, or future civic use.\n\nThe purpose of this policy is to make growth easier without rewarding waste: businesses gain a practical path to expand, the government recovers land that can serve another member, and industrial development is directed to locations suited for it.",
      },
      {
        heading: "Eligibility",
        body: "An applicant must control the commercial property being offered, disclose any lease, dispute, lien, unpaid public obligation, or other claim affecting it, and present a credible plan for industrial expansion. The replacement claim must be intended for production, extraction, logistics, storage, utilities, or another activity the Urban Manager recognizes as a legitimate industrial use.\n\nParticipation is voluntary and approval is not automatic. Velaris may decline an exchange when the proposed claim conflicts with land planning, infrastructure capacity, public need, or responsible Treasury management.",
      },
      {
        heading: "Valuation Standard",
        body: "The surrendered commercial property and the proposed industrial claim shall each be assessed using the current Velaris Land Calculator. The calculator provides the common valuation baseline using area, wages, resources, and scarcity.\n\nTreasury shall certify the final figures, and the Urban Manager shall verify zoning, usable area, access, infrastructure, resource conditions, and any material feature not fully represented by the calculator. The calculator inputs, output, and any approved adjustment must be attached to the public decision record so every exchange can be understood and reviewed.",
      },
      {
        heading: "Exchange Credit",
        body: "Once approved, the owner transfers the commercial property to the Velaris government. Its certified buyback value becomes a non-transferable claim credit applied directly toward the certified value of the approved industrial claim.\n\nWhen the industrial claim is valued above the credit, the applicant must pay the difference before transfer. When the credit exceeds the claim value, Treasury may apply the remainder to approved site preparation, infrastructure, or other documented industrial-expansion costs, or settle the remainder under written terms included in the public record. No private or unrecorded settlement is permitted.",
      },
      {
        heading: "Review and Approval",
        body: "The applicant shall submit the commercial property, the requested industrial claim, an expansion plan, and a calculator valuation for each property. The Urban Manager reviews land use and site suitability; Treasury reviews valuation, funding, and outstanding obligations. Both offices must approve the exchange before either property changes hands.\n\nAn approval shall identify the properties, certified values, credit applied, balance paid or retained, approved industrial purpose, and any conditions or deadlines. A denial should state the reason and may invite a revised application.",
      },
      {
        heading: "Public Accountability and Anti-Speculation",
        body: "Every completed buyback shall be entered in the public policy or transaction record with enough information for members to understand the public cost and benefit. Officials with a personal interest in an application must disclose that interest and take no part in its approval.\n\nVelaris may reject or unwind applications involving misrepresentation, artificial value inflation, coordinated self-dealing, or property acquired primarily to exploit the buyback program. The program exists to support genuine industrial growth and the productive reuse of land.",
      },
    ],
  },
]);
