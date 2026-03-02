export const chips = [
  'Clear timelines + milestone tracking',
  'BOQ-ready drawings & execution detailing',
  'Single-point ownership from concept to handover'
] as const;

export const processSteps = [
  { title: 'Brief', description: 'Program goals, budget band, and timeline alignment.' },
  { title: 'Concept', description: 'Design direction with spatial strategy and material intent.' },
  { title: 'Design', description: 'Refined layouts, technical coordination, and approval readiness.' },
  { title: 'Documentation', description: 'Construction drawings, BOQs, and issue-controlled revisions.' },
  { title: 'Execution', description: 'Site coordination, milestone checks, and quality validation.' },
  { title: 'Handover', description: 'Final snag closure and delivery sign-off with clarity.' }
] as const;

export const serviceOrder = [
  'Architecture Design',
  'Interior Design',
  'Office Fit-Outs',
  'Project Delivery',
  'Building Documentation',
  'Landscape Design'
] as const;

export const journalTopics = ['Architecture', 'Interior', 'Hospitality', 'Residential', 'Commercial'] as const;
