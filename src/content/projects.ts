export type ProjectCategory = 'Architecture' | 'Interior' | 'Landscape' | 'Building Documentation';

export type ProjectEntry = {
  imageName: string;
  title: string;
  slug: string;
  projectType: string;
  category: ProjectCategory;
  location: string;
  shortDescription: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  overview: string;
  designBrief: string;
  architecturalConcept: string;
  spatialPlanning: string;
  materialPalette: string;
  lightingStrategy: string;
  userExperience: string;
  executionConsiderations: string;
  projectOutcome: string;
  conclusion: string;
  seoKeywords: string[];
  internalLinks: string[];
  heroImageAlt: string;
  cardImageAlt: string;
  coverImage: string;
  year?: number | null;
  outcome?: string;
  updatedAt: string;
};

type ProjectSeed = {
  imageName: string;
  title: string;
  projectType: string;
  category: ProjectCategory;
  location: string;
  programFocus: string;
  contextFocus: string;
  materialsFocus: string;
  lightingFocus: string;
  experienceFocus: string;
};

const projectSeeds: ProjectSeed[] = [
  {
    imageName: 'Plush Banquet Venue by Wanderlust Architects',
    title: 'Plush Banquet Venue, Ranthambore',
    projectType: 'Hospitality Banquet Venue',
    category: 'Architecture',
    location: 'Ranthambore, Rajasthan',
    programFocus: 'large-format celebrations, ceremonial arrival, and seamless event turnover',
    contextFocus: 'climatic comfort, desert-edge heat response, and clear guest-to-service separation',
    materialsFocus: 'stone textures, muted plaster, and robust finish systems suitable for heavy use',
    lightingFocus: 'arrival drama, layered mood settings, and adaptable event scenes',
    experienceFocus: 'premium first impression, intuitive wayfinding, and uninterrupted social flow'
  },
  {
    imageName: 'The Luxury Resort Rajasthan By Wanderlust Architects',
    title: 'The Baagh Luxury Resort',
    projectType: 'Luxury Resort Architecture',
    category: 'Architecture',
    location: 'Rajasthan',
    programFocus: 'high-comfort hospitality planning with private and social retreat zones',
    contextFocus: 'regional climate, destination character, and resilient long-stay usability',
    materialsFocus: 'earth-toned natural finishes, tactile stone, and weather-ready detailing',
    lightingFocus: 'soft night-time ambience, daylight framing, and destination storytelling',
    experienceFocus: 'slow-luxury pacing, privacy, and clear movement from arrival to suite zones'
  },
  {
    imageName: 'The Luxury Office by Wanderlust Architects',
    title: 'The Luxury Office',
    projectType: 'Corporate Office Interior',
    category: 'Interior',
    location: 'Jaipur, Rajasthan',
    programFocus: 'executive identity, collaboration balance, and high-focus work settings',
    contextFocus: 'brand expression with efficient daily operations and client-ready presentation',
    materialsFocus: 'fine veneer, metal accents, acoustic layers, and durable joinery',
    lightingFocus: 'task precision, executive atmosphere, and camera-ready meeting scenes',
    experienceFocus: 'confidence-driven arrival, ergonomic comfort, and low-friction movement'
  },
  {
    imageName: 'Rani Sati Temple Renovation by Wanderlust Architects',
    title: 'Rani Sati Temple Renovation',
    projectType: 'Heritage Architecture Documentation',
    category: 'Building Documentation',
    location: 'Rajasthan',
    programFocus: 'measured recording, restoration intent, and long-term maintenance clarity',
    contextFocus: 'heritage sensitivity, ritual continuity, and modern safety compliance',
    materialsFocus: 'context-matched finishes, reversible interventions, and conservation-first choices',
    lightingFocus: 'respectful illumination, ritual visibility, and controlled focal emphasis',
    experienceFocus: 'clear pilgrim circulation, preserved sanctity, and legible heritage narrative'
  },
  {
    imageName: 'Lohia Residence by Wanderlust Architects',
    title: 'Lohia Residence',
    projectType: 'Luxury Residence Design',
    category: 'Interior',
    location: 'Jaipur, Rajasthan',
    programFocus: 'family living, private retreat, and entertaining with spatial continuity',
    contextFocus: 'everyday convenience with an elevated residential identity',
    materialsFocus: 'warm natural textures, refined stone, and long-life interior surfaces',
    lightingFocus: 'layered domestic comfort with evening depth and daylight control',
    experienceFocus: 'calm transitions, intuitive zoning, and effortless daily usability'
  },
  {
    imageName: 'Neo Classiscal Salon by Wanderlust Architects',
    title: 'Neo Classical Salon',
    projectType: 'Salon Interior Design',
    category: 'Interior',
    location: 'Jaipur, Rajasthan',
    programFocus: 'service efficiency, client comfort, and premium brand positioning',
    contextFocus: 'high footfall operation with polished ambience and repeatable workflow',
    materialsFocus: 'easy-maintenance luxury surfaces, mirrored accents, and tactile highlights',
    lightingFocus: 'face-accurate service lighting with flattering ambient layers',
    experienceFocus: 'smooth queue movement, private treatment comfort, and signature visual recall'
  },
  {
    imageName: 'The Luxury Penthouse by Wanderlust Architects',
    title: 'The Luxury Penthouse',
    projectType: 'Penthouse Interior Design',
    category: 'Interior',
    location: 'Jaipur',
    programFocus: 'elevated urban living, guest entertainment, and private family zones',
    contextFocus: 'city-view orientation, acoustic comfort, and premium vertical living',
    materialsFocus: 'natural stone, crafted timber, and low-gloss metallic detailing',
    lightingFocus: 'horizon framing, evening layering, and atmosphere-by-zone control',
    experienceFocus: 'seamless host-to-private transitions with calm, composed interiors'
  },
  {
    imageName: 'Luxury Office for Pharmaceutical Company by Wanderlust Architects',
    title: 'Luxury Office for Pharmaceutical Company',
    projectType: 'Corporate Office Interior',
    category: 'Interior',
    location: 'India',
    programFocus: 'compliance-ready office planning, leadership zones, and collaborative workbands',
    contextFocus: 'regulated industry demands with high-trust client engagement spaces',
    materialsFocus: 'hygienic durable surfaces, acoustic control layers, and executive-grade finishes',
    lightingFocus: 'clarity-led task illumination with balanced ambient warmth',
    experienceFocus: 'professional confidence, focused teams, and smooth stakeholder movement'
  },
  {
    imageName: 'Ambrosia by Wanderlust Architects',
    title: 'Ambrosia Restaurant',
    projectType: 'Restaurant Interior Design',
    category: 'Interior',
    location: 'India',
    programFocus: 'front-of-house theatre, back-of-house efficiency, and table turnover quality',
    contextFocus: 'hospitality identity with repeat-visit ambience and operational discipline',
    materialsFocus: 'stain-resilient luxury finishes, textured walls, and handcrafted accents',
    lightingFocus: 'table-focused warmth, brand drama, and balanced visual comfort',
    experienceFocus: 'memorable dining flow from entry, seating, service, and exit'
  },
  {
    imageName: 'Anjuna Villa by Wanderlust Architects',
    title: 'Anjuna Villa',
    projectType: 'Luxury Villa Architecture',
    category: 'Architecture',
    location: 'Goa',
    programFocus: 'indoor-outdoor living, privacy layering, and coastal luxury lifestyle',
    contextFocus: 'humidity response, landscape integration, and holiday-home adaptability',
    materialsFocus: 'weather-resistant finishes, natural textures, and low-maintenance detailing',
    lightingFocus: 'sun-path alignment, evening poolside mood, and facade depth',
    experienceFocus: 'relaxed circulation, social openness, and deeply private retreat pockets'
  },
  {
    imageName: 'Maharaja Garden by Wanderlust Architects',
    title: 'Maharaja Garden',
    projectType: 'Wedding Garden and Hospitality Landscape',
    category: 'Landscape',
    location: 'India',
    programFocus: 'event lawns, processional sequences, and service-ready venue planning',
    contextFocus: 'outdoor climatic resilience and high-capacity celebration logistics',
    materialsFocus: 'hardscape durability, softscape balance, and festive-ready ground systems',
    lightingFocus: 'night-event legibility, stage framing, and ambience zoning',
    experienceFocus: 'grand arrival, intuitive flow, and high-energy event comfort'
  },
  {
    imageName: 'Manpura Farmhouse by Wanderlust Architects',
    title: 'Manpura Farmhouse',
    projectType: 'Farmhouse Architecture',
    category: 'Architecture',
    location: 'Rajasthan',
    programFocus: 'weekend retreat planning, agriculture-edge lifestyle, and family gatherings',
    contextFocus: 'rural climate adaptation with contemporary spatial standards',
    materialsFocus: 'rugged natural finishes, breathable envelopes, and easy maintenance',
    lightingFocus: 'daylight harvesting, evening porch warmth, and landscape-linked ambience',
    experienceFocus: 'slow-paced movement, communal comfort, and quiet private corners'
  },
  {
    imageName: 'Spacious Outhouse in Jaipur by Wanderlust Architects',
    title: 'Spacious Outhouse, Jaipur',
    projectType: 'Residential Outhouse Design',
    category: 'Architecture',
    location: 'Jaipur',
    programFocus: 'secondary residence use, guest hosting, and multi-purpose family events',
    contextFocus: 'compact plot efficiency with premium usability and privacy',
    materialsFocus: 'clean-lined plaster, stone accents, and practical long-life finishes',
    lightingFocus: 'controlled glare, layered ambience, and event-mode flexibility',
    experienceFocus: 'easy access, social openness, and comfortable overnight use'
  },
  {
    imageName: 'A Tiny Luxury Office Propex by Wanderlust Architects',
    title: 'A Tiny Luxury Office, Propex',
    projectType: 'Small Office Interior Design',
    category: 'Interior',
    location: 'India',
    programFocus: 'high-efficiency planning for compact teams with premium client presence',
    contextFocus: 'space optimization without compromising brand confidence',
    materialsFocus: 'space-amplifying finishes, slimline joinery, and acoustic control surfaces',
    lightingFocus: 'focused work illumination with visual depth in a compact footprint',
    experienceFocus: 'clear circulation, clutter-free work zones, and polished client meetings'
  },
  {
    imageName: 'Pratima Showroom by Wanderlust Architects',
    title: 'Pratima Showroom',
    projectType: 'Retail Showroom Interior',
    category: 'Interior',
    location: 'India',
    programFocus: 'merchandise visibility, conversion-focused circulation, and premium retail identity',
    contextFocus: 'high interaction retail environment with strong display hierarchy',
    materialsFocus: 'durable display finishes, refined backdrops, and flexible merchandising systems',
    lightingFocus: 'product-focused contrast, shelf clarity, and experiential spotlighting',
    experienceFocus: 'guided browsing, stronger dwell time, and confident purchase flow'
  },
  {
    imageName: 'Hozetel Jollygrant by Wanderlust Architects',
    title: 'Hozetel Jollygrant',
    projectType: 'Hostel Architecture',
    category: 'Architecture',
    location: 'Uttarakhand',
    programFocus: 'traveller-centric hospitality planning with social and private balance',
    contextFocus: 'gateway location strategy, budget-sensitive robustness, and operational ease',
    materialsFocus: 'hard-wearing finishes, modular furniture logic, and efficient maintenance',
    lightingFocus: 'safe movement lighting with warm social pockets',
    experienceFocus: 'easy check-in flow, shared community culture, and restful private stays'
  },
  {
    imageName: 'A Backpacker Jaipur Hoztel by Wanderlust Architects',
    title: 'A Backpacker Jaipur Hoztel',
    projectType: 'Hostel Interior and Architecture',
    category: 'Architecture',
    location: 'Jaipur',
    programFocus: 'backpacker lifestyle planning, social anchors, and efficient room modules',
    contextFocus: 'urban travel behavior, affordability, and identity-rich hospitality experience',
    materialsFocus: 'resilient surfaces, graphic accents, and modular serviceability',
    lightingFocus: 'community warmth with practical dorm and corridor visibility',
    experienceFocus: 'easy orientation, sociable interaction, and secure overnight comfort'
  },
  {
    imageName: 'A Outstay in Woods by Wanderlust Architects',
    title: 'A Outstay in Woods',
    projectType: 'Eco Retreat Architecture',
    category: 'Landscape',
    location: 'India',
    programFocus: 'low-impact retreat living, nature immersion, and wellness-led hospitality',
    contextFocus: 'ecological sensitivity, minimal footprint planning, and long-term resilience',
    materialsFocus: 'natural-weathering materials, lightweight construction logic, and reversible detailing',
    lightingFocus: 'night-sky sensitivity, low-glare pathways, and mood-led ambient glow',
    experienceFocus: 'quiet immersion, slow circulation, and restorative guest rhythm'
  },
  {
    imageName: 'Serene Cottages by Wanderlust Architects',
    title: 'Serene Cottages',
    projectType: 'Resort Cottage Architecture',
    category: 'Architecture',
    location: 'India',
    programFocus: 'distributed hospitality units, privacy gradients, and service-ready operations',
    contextFocus: 'resort cohesion with cottage-level individuality and comfort',
    materialsFocus: 'soft natural palettes, weather-resistant envelopes, and tactile interiors',
    lightingFocus: 'pathway guidance, intimate room ambience, and landscape-linked glow',
    experienceFocus: 'calm arrival, personal retreat quality, and effortless resort movement'
  }
];

const categoryLens: Record<ProjectCategory, { serviceLabel: string; deliveryLabel: string; semanticSet: string[] }> = {
  Architecture: {
    serviceLabel: 'luxury architecture design',
    deliveryLabel: 'site-ready architectural coordination',
    semanticSet: ['massing strategy', 'facade articulation', 'structural planning', 'buildability clarity']
  },
  Interior: {
    serviceLabel: 'luxury interior design',
    deliveryLabel: 'execution-ready interior detailing',
    semanticSet: ['material curation', 'joinery detailing', 'lighting composition', 'workspace and lifestyle planning']
  },
  Landscape: {
    serviceLabel: 'landscape design',
    deliveryLabel: 'outdoor execution documentation',
    semanticSet: ['hardscape planning', 'softscape zoning', 'event circulation', 'climate-responsive outdoor design']
  },
  'Building Documentation': {
    serviceLabel: 'building documentation',
    deliveryLabel: 'measured drawings and construction documentation',
    semanticSet: ['as-built surveying', 'technical drawing packages', 'coordination sheets', 'restoration documentation']
  }
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toProjectImagePath(imageName: string) {
  const encoded = encodeURIComponent(imageName);
  return `/projects/${encoded}/${encoded}.jpg`;
}

function smoothSentence(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function buildProjectEntry(seed: ProjectSeed, index: number): ProjectEntry {
  const slug = slugify(seed.title);
  const lens = categoryLens[seed.category];
  const primaryKeyword = `${seed.projectType} in ${seed.location}`;
  const semanticKeyword = lens.semanticSet.join(', ');

  const overview = smoothSentence(
    `For clients seeking ${primaryKeyword.toLowerCase()}, ${seed.title} demonstrates how Wanderlust Architects converts ambition into a buildable spatial system.
    This case study starts with one clear objective: deliver a premium outcome that performs on site, not just in renders. The project strategy aligned ${seed.programFocus},
    while also responding to ${seed.contextFocus}. From the first concept workshop, the team treated architecture, interiors, and coordination as one integrated workflow.
    That decision reduced late-stage redesign cycles, improved consultant clarity, and kept every design move accountable to user experience and execution quality.
    The result is a project language that feels composed and confident, while remaining practical for day-to-day operation and long-term upkeep.
    For the client, this means fewer execution surprises, stronger control over decision timing, and a built environment that protects value across both immediate use and future repositioning cycles.`
  );

  const designBrief = smoothSentence(
    `The design brief for ${seed.title} asked for a space that could represent brand intent, improve usability, and maintain premium standards over time.
    Instead of isolating aesthetics from operations, Wanderlust Architects structured the brief around deliverables: planning logic, material strategy, technical clarity, and timeline control.
    Each design checkpoint was tied to real decisions, including furniture footprints, service circulation, consultant coordination, and finish performance.
    This approach ensured that every drawing package translated to site with fewer assumptions. The client team received a clearly prioritized roadmap,
    balancing immediate milestones with long-term adaptability. In practice, that meant a disciplined blend of ${lens.serviceLabel}, measurable functionality, and clear communication across all stakeholders.
    The brief therefore acted as a live project charter, aligning design choices with procurement intent, technical feasibility, and timeline governance before site complexity could create unnecessary drift.`
  );

  const architecturalConcept = smoothSentence(
    `The architectural concept is built on proportion, rhythm, and controlled contrast. In ${seed.title}, form is not decorative; it is organizational.
    Spatial hierarchy, facade depth, and volume sequencing were used to create legibility from entry to core activity zones.
    Wanderlust Architects used ${semanticKeyword} to maintain coherence between macro planning and micro detailing.
    Instead of overloading the project with visual noise, the concept focuses on disciplined lines, edited material transitions, and carefully framed focal points.
    This keeps the project contemporary while protecting long-term relevance. The concept also supports phased execution, allowing contractors and consultants to read intent quickly and implement with higher confidence.`
  );

  const spatialPlanning = smoothSentence(
    `Spatial planning in ${seed.title} prioritizes operational logic before stylistic overlay. The plan separates public, semi-private, and service functions with clear transitions,
    reducing circulation conflict and improving user comfort. Activity clusters were positioned to minimize dead corners and maximize sightline continuity.
    For high-use periods, the layout supports faster movement and easier supervision; during quieter periods, it still feels composed and intimate.
    Wanderlust Architects refined adjacency rules so each zone supports the next, whether the project is handling guests, teams, or mixed-use interactions.
    The planning strategy also anticipates change: furniture flexibility, service access, and maintenance routes were embedded early so future modifications can happen without disrupting the design identity.`
  );

  const materialPalette = smoothSentence(
    `The material palette combines visual depth with maintenance intelligence. For ${seed.title}, selections were made through performance criteria first,
    then refined through tactile and tonal composition. The palette emphasizes ${seed.materialsFocus}, producing an atmosphere that feels premium without appearing fragile.
    Surfaces that face heavy contact were specified for durability, while focal elements were reserved for moments of brand expression and spatial warmth.
    Joinery interfaces, edge conditions, and transition joints were detailed to reduce on-site interpretation errors. This disciplined palette strategy ensures consistency across execution packages,
    helps procurement stay aligned with intent, and protects the finished experience from premature wear. The end result is a space that retains character under real operating conditions.`
  );

  const lightingStrategy = smoothSentence(
    `Lighting was treated as an architectural layer, not a post-design accessory. In ${seed.title}, the scheme balances daylight behavior with artificial layering to support both utility and atmosphere.
    The strategy focuses on ${seed.lightingFocus}, ensuring that tasks remain comfortable while signature moments still read with depth.
    Ambient lighting establishes base calm, accent lighting shapes hierarchy, and task lighting improves precision where performance matters most.
    Control logic was designed for real use scenarios, allowing the space to shift between operational, social, and presentation settings with minimal friction.
    By integrating fixture positioning with ceiling geometry and material reflectance, Wanderlust Architects avoided glare hotspots and visual fatigue while sustaining a premium experiential tone.`
  );

  const userExperience = smoothSentence(
    `User experience in ${seed.title} is defined by movement quality, sensory comfort, and decision-free navigation. The journey begins with a clear threshold and then unfolds through intuitive wayfinding cues,
    consistent sightlines, and proportionally scaled transitions. This structure supports ${seed.experienceFocus}, so visitors and operators can use the space confidently from day one.
    Acoustic considerations, waiting moments, and pause points were calibrated to reduce cognitive load during busy periods.
    Wanderlust Architects also mapped likely user paths against operational paths to prevent overlap friction.
    The result is a spatial experience that feels calm and premium even when occupancy rises, because the underlying planning logic is engineered for usability rather than appearance alone.`
  );

  const executionConsiderations = smoothSentence(
    `Execution planning for ${seed.title} was developed as a parallel design stream. Drawing packages included dimension discipline, interface details, and coordination notes that support ${lens.deliveryLabel}.
    This reduced ambiguity between architecture, interiors, MEP, and vendor scopes. Material lead times and sequencing dependencies were assessed early,
    allowing milestone planning to stay realistic. Site queries were anticipated through section-heavy documentation and explicit tolerance notes.
    Where site constraints could affect intent, alternates were pre-qualified to protect quality and schedule. The execution framework emphasizes accountability:
    every detail links back to design intent, every revision has a traceable reason, and every stage supports informed decisions instead of reactive corrections.
    This delivery discipline is what converts design ambition into predictable handover quality, especially when multiple agencies, phased procurement, and real-time site decisions must stay aligned to one coherent outcome.`
  );

  const projectOutcome = smoothSentence(
    `The completed outcome of ${seed.title} proves that premium design is strongest when concept clarity and execution rigor move together.
    The project now performs as a coherent environment that supports business goals, everyday usability, and long-term brand value.
    Stakeholders experience smoother operations, reduced friction during high-use periods, and stronger perception quality across key touchpoints.
    The built result reflects disciplined detailing, controlled material expression, and planning that remains legible after handover.
    For Wanderlust Architects, this project reinforces a consistent methodology: combine ${lens.serviceLabel}, technical precision, and site-aware coordination to deliver spaces that feel refined and function reliably under real-world conditions.
    Beyond immediate occupancy value, the project establishes a stronger lifecycle baseline through durable detailing, clearer maintenance pathways, and documentation quality that supports future upgrades without compromising the original design intent.`
  );

  const conclusion = smoothSentence(
    `${seed.title} extends the Wanderlust Architects portfolio with a case study grounded in strategy, restraint, and delivery clarity.
    It demonstrates how contemporary architecture and interior practice can stay elegant without sacrificing practicality.
    By integrating concept development, planning discipline, material intelligence, and execution oversight, the project achieves a resilient premium identity.
    For future clients, this case study offers a clear signal of studio capability: thoughtful design, technically coherent documentation, and outcomes that remain strong from first impression to daily operation.
    It also reinforces a practical promise that defines Wanderlust Architects: every aesthetic move is backed by delivery logic, and every technical package is written to support confident construction decisions at pace.`
  );

  const categoryQuery = encodeURIComponent(seed.category.toLowerCase());
  const seoKeywords = [
    seed.title.toLowerCase(),
    primaryKeyword.toLowerCase(),
    'wanderlust architects projects',
    'luxury architecture and interior design',
    `${seed.location.toLowerCase()} architecture studio`,
    lens.serviceLabel,
    lens.deliveryLabel,
    `${seed.category.toLowerCase()} case study`
  ];

  const internalLinks = [
    '/projects',
    '/about',
    '/contact',
    '/#services',
    `/projects?category=${categoryQuery}`
  ];

  return {
    imageName: seed.imageName,
    title: seed.title,
    slug,
    projectType: seed.projectType,
    category: seed.category,
    location: seed.location,
    shortDescription: smoothSentence(
      `${seed.title} is a ${seed.projectType.toLowerCase()} in ${seed.location} where Wanderlust Architects aligns concept, detailing, and execution planning to deliver premium spatial outcomes.`
    ),
    seoTitle: `${seed.title} | ${seed.projectType} in ${seed.location} | Wanderlust Architects`,
    metaDescription: smoothSentence(
      `Explore ${seed.title}, a ${seed.projectType.toLowerCase()} in ${seed.location} by Wanderlust Architects. Discover planning strategy, material direction, and execution-ready design delivery.`
    ),
    h1: `${seed.title}: ${primaryKeyword}`,
    overview,
    designBrief,
    architecturalConcept,
    spatialPlanning,
    materialPalette,
    lightingStrategy,
    userExperience,
    executionConsiderations,
    projectOutcome,
    conclusion,
    seoKeywords,
    internalLinks,
    heroImageAlt: `${seed.title} by Wanderlust Architects in ${seed.location}`,
    cardImageAlt: `${seed.title} project thumbnail by Wanderlust Architects`,
    coverImage: toProjectImagePath(seed.imageName),
    year: null,
    outcome: 'Delivered with execution clarity and premium spatial discipline.',
    updatedAt: `2026-02-${String(19 - index).padStart(2, '0')}`
  };
}

const baseEntries = projectSeeds.map((seed, index) => buildProjectEntry(seed, index));

export const projectEntries: ProjectEntry[] = baseEntries.map((entry) => {
  const relatedLinks = baseEntries
    .filter((candidate) => candidate.slug !== entry.slug && candidate.category === entry.category)
    .slice(0, 2)
    .map((candidate) => `/projects/${candidate.slug}`);

  return {
    ...entry,
    internalLinks: [...entry.internalLinks, ...relatedLinks]
  };
});

export function getProjectEntries() {
  return projectEntries;
}

export function getProjectEntryBySlug(slug: string) {
  return projectEntries.find((entry) => entry.slug === slug);
}
