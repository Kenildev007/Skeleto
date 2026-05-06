import type { RoleScore, RoleSignals, SkeletonRole } from './types';

const EMPTY_SCORE: RoleScore = { text: 0, image: 0, circle: 0, rect: 0, icon: 0 };

const EXPLICIT_OVERRIDE = 100;

export function inferRole(signals: RoleSignals): SkeletonRole {
  if (signals.explicitRole) return signals.explicitRole;

  const score: RoleScore = { ...EMPTY_SCORE };

  switch (signals.componentType) {
    case 'text':
      score.text += 10;
      break;
    case 'image':
      score.image += 10;
      break;
    case 'svg':
      score.icon += 10;
      break;
  }

  const { width, height, borderRadius } = signals;
  const minDim = Math.min(width, height);
  const aspect = width / Math.max(1, height);

  if (aspect > 0.85 && aspect < 1.15 && minDim < 64) {
    score.circle += 3;
    score.icon += 3;
  }

  if (borderRadius >= minDim / 2 - 1 && minDim > 0) {
    score.circle += 5;
  }

  if (signals.hasTextContent) {
    score.text += 8;
  }

  if (height > 0 && height < 24) {
    score.text += 2;
  }

  if (signals.hasBackgroundImage) {
    score.image += 8;
  }

  if (score.text + score.image + score.circle + score.icon === 0) {
    score.rect += 1;
  }

  let topRole: SkeletonRole = 'rect';
  let topValue = score.rect;
  (Object.keys(score) as Array<keyof RoleScore>).forEach((key) => {
    if (score[key] > topValue) {
      topValue = score[key];
      topRole = key;
    }
  });

  return topRole;
}

export const __EXPLICIT_OVERRIDE_WEIGHT = EXPLICIT_OVERRIDE;
