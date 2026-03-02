export type SceneType = 'intro' | 'blueprint' | 'transition' | 'gallery' | 'cta';

export type WalkthroughScene = {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  type: SceneType;
  renderImage?: string;
  bullets?: string[];
};

export const sceneData: WalkthroughScene[] = [
  {
    id: 0,
    key: 'intro',
    type: 'intro',
    title: 'Architectural Walkthrough',
    subtitle: 'A scene-based narrative from concept lines to built reality.',
    renderImage: 'https://wanderlustarchitects.com/wp-content/uploads/2023/05/Enscape_2023-08-24-17-53-19-scaled.jpg'
  },
  {
    id: 1,
    key: 'blueprint',
    type: 'blueprint',
    title: 'Blueprint',
    subtitle: 'Concept / Plan / Circulation',
    bullets: ['Grid logic', 'Spatial zoning', 'Flow hierarchy']
  },
  {
    id: 2,
    key: 'transition',
    type: 'transition',
    title: 'Blueprint to Render',
    subtitle: 'Material, lighting, and spatial intent emerge.',
    renderImage: 'https://wanderlustarchitects.com/wp-content/uploads/2024/11/PENTHOUSE-JAIPUR9.jpg',
    bullets: ['Material palette', 'Lighting hierarchy', 'Spatial intent']
  },
  {
    id: 3,
    key: 'gallery',
    type: 'gallery',
    title: 'Living Gallery',
    subtitle: 'Navigate projects through a central spine and supporting grid.'
  },
  {
    id: 4,
    key: 'cta',
    type: 'cta',
    title: 'Start Your Walkthrough',
    subtitle: 'Move from ideas to execution with one coordinated team.'
  }
];

