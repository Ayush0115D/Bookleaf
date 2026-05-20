const sections = {
  company: `BookLeaf Publishing is a self-publishing company operating in India and the US.
- Publishing packages: Standard Free (no upfront cost) and Bestseller Breakthrough (premium with marketing).
- Services: cover design, typesetting, ISBN assignment, printing, distribution, royalty management.
- In-house printing facility and warehouse in Delhi. Print partners: Repro India and Epitome Books.`,

  royalty: `ROYALTY POLICY:
- 80/20 royalty split: 80% net profit to author, 20% to BookLeaf.
- Net profit = MRP - printing cost - platform commission (Amazon/Flipkart) - shipping.
- Royalties calculated quarterly, paid within 45 days of quarter ending.
- Minimum payout threshold: Rs 1,000. Below this rolls over to next quarter.
- Payouts via bank transfer to linked account in author dashboard.
- Authors can view detailed royalty breakdown per platform in their dashboard.`,

  isbn: `ISBN POLICY:
- Every book gets a unique ISBN assigned by BookLeaf.
- ISBNs registered under BookLeaf's publisher imprint.
- Authors wanting ISBN under their own imprint must obtain it independently.
- ISBN errors (duplicate, wrong book linked) treated as high-priority, escalated to production team.`,

  printing: `PRINTING & QUALITY:
- In-house printing for most orders. Repro India or Epitome Books for overflow/special formats.
- Standard print turnaround: 5-7 business days from order confirmation.
- Quality issues (misprints, binding defects, color inconsistency): free reprint after verification.
- Author may need to share photos of defective copy.`,

  distribution: `DISTRIBUTION & AVAILABILITY:
- Books listed on Amazon India, Flipkart, Amazon US, Amazon UK, BookLeaf Store.
- New listings go live within 7-10 business days after publication.
- "Currently Unavailable" = stock sync issue. Team can trigger re-sync within 24-48 hours.`,

  production: `PRODUCTION STAGES:
- Manuscript Received > Editing (if opted) > Cover Design > Typesetting > Proofreading > ISBN Assignment > Printing > Distribution Setup > Published & Live.
- Authors updated at each stage via email.
- Delays typically at Cover Design (awaiting author approval) and Proofreading (revision rounds).`,

  tone: `COMMUNICATION TONE GUIDELINES:
- Always empathetic and professional. Authors are partners, not customers.
- Acknowledge concern before solutions. Be specific with numbers, dates, statuses.
- If BookLeaf's fault (delayed royalties, ISBN error), own it directly.
- For escalations, give clear timeline ("within 48 hours") not open-ended promises.
- End with clear next step for author and/or BookLeaf team.`,
};

const allSections = Object.values(sections).join('\n\n');

function getContextForCategory(category) {
  const relevant = [sections.company, sections.tone];

  switch (category) {
    case 'Royalty & Payments':
      relevant.push(sections.royalty);
      break;
    case 'ISBN & Metadata Issues':
      relevant.push(sections.isbn);
      break;
    case 'Printing & Quality':
      relevant.push(sections.printing);
      break;
    case 'Distribution & Availability':
      relevant.push(sections.distribution);
      break;
    case 'Book Status & Production Updates':
      relevant.push(sections.production);
      break;
    default:
      relevant.push(allSections);
  }

  return relevant.join('\n\n');
}

module.exports = { sections, getContextForCategory, allSections };
