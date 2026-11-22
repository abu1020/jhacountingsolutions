export interface DirectoryClient {
  id: string; name: string; company: string; email: string; phone: string;
  service: string; updatedAt: string;
}
/** Local filtering is deliberately limited to the fetched page, not the database. */
export function filterClientPage(clients: DirectoryClient[], search: string): DirectoryClient[] {
  const term = search.trim().toLocaleLowerCase();
  if (!term) return clients;
  return clients.filter(c => [c.id, c.name, c.company, c.email, c.phone].some(v => v.toLocaleLowerCase().includes(term)));
}
