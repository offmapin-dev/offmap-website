export const EXPERIENCE_ICONS = {
  trekking:   '/icons/hiking.png',
  hiking:     '/icons/hiking.png',
  camping:    '/icons/camping.png',
  cultural:   '/icons/cultural.png',
  culture:    '/icons/cultural.png',
  wildlife:   '/icons/wildlife.png',
  adventure:  '/icons/adventure.png',
  stays:      '/icons/stays.png',
  homestay:   '/icons/stays.png',
  activities: '/icons/activities.png',
  learning:   '/icons/learning.png',
} as const

export function getExperienceIcon(type: string): string {
  const key = type.toLowerCase() as keyof typeof EXPERIENCE_ICONS
  return EXPERIENCE_ICONS[key] ?? '/icons/activities.png'
}
