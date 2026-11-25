/** Approved external apps only. These are public URLs, not secrets. */
export const FREE_APPS = [
  { id: 'notes', name: 'Jha Nooks', description: 'A space for notes and ideas.', url: 'https://jhanooks.vercel.app' },
  { id: 'management', name: 'Jha Management', description: 'Attendance and payroll management.', url: 'https://jhamanagement.vercel.app' },
  { id: 'cadence', name: 'Cadence — Focus OS', description: 'A workspace for tasks and focus.', url: 'https://jhatasks.vercel.app' }
] as const;
export type FreeApp = (typeof FREE_APPS)[number];
