import type { Portal } from './types';

export interface TimelineItem {
  id: string;
  portal: Portal;
  typeLabel: string;
  summary: string;
  detail?: string;
  authorId: string;
  at: string;
  restricted: boolean;
  isPatternFlag?: boolean;
  patternFlagId?: string;
  linkTo?: string;
}

export function sortTimeline(items: TimelineItem[]): TimelineItem[] {
  return [...items].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}
