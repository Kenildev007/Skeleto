export type SkeletonRole = 'text' | 'image' | 'circle' | 'rect' | 'icon' | 'ignore';

export type AnimationType = 'shimmer' | 'pulse' | 'wave' | 'none';

export type Direction = 'ltr' | 'rtl';

export interface MeasuredNode {
  id: string;
  role: SkeletonRole;
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface RoleScore {
  text: number;
  image: number;
  circle: number;
  rect: number;
  icon: number;
}

export interface SkeletonTheme {
  baseColor: string;
  highlightColor: string;
  darkMode?: {
    baseColor: string;
    highlightColor: string;
  };
}

export interface AutoSkeletonProps {
  loading: boolean;
  children: React.ReactNode;

  animation?: AnimationType;
  speed?: number;
  direction?: Direction;

  baseColor?: string;
  highlightColor?: string;
  borderRadius?: number | 'inherit';
  opacity?: number;

  transition?: number;
  staggerChildren?: number;
  minDuration?: number;

  preserveLayout?: boolean;
  maxDepth?: number;
  onMeasure?: (nodes: MeasuredNode[]) => void;

  // Accessibility
  loadingLabel?: string;            // default 'Loading content'
  trapFocus?: boolean;              // default true — block tab into invisible content
}

export interface RoleSignals {
  componentType?: 'text' | 'image' | 'svg' | 'view';
  hasTextContent: boolean;
  width: number;
  height: number;
  borderRadius: number;
  hasBackgroundImage: boolean;
  explicitRole?: SkeletonRole;
}
