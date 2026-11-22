import { collection, documentId, getCountFromServer, getDocsFromServer, limit, orderBy, query, startAfter, type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';

import type { DirectoryClient } from './clientDirectoryFilter';
export interface ClientPage { clients: DirectoryClient[]; nextCursor: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }
export type ClientCursor = QueryDocumentSnapshot<DocumentData> | null;

/** Read only. Firestore rules, not this module or the UI, must authorize access. */
export async function fetchClientPage(pageSize: number, cursor: ClientCursor): Promise<ClientPage> {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new Error('Invalid page size');
  const ref = collection(db, 'users');
  const base = [orderBy(documentId()), ...(cursor ? [startAfter(cursor)] : []), limit(pageSize + 1)];
  const snap = await getDocsFromServer(query(ref, ...base));
  const docs = snap.docs.slice(0, pageSize);
  return {
    clients: docs.map(doc => {
      const d = doc.data();
      const text = (x: unknown) => typeof x === 'string' ? x : '';
      return { id: doc.id, name: text(d.name) || text(d.displayName) || 'Unnamed client', company: text(d.company), email: text(d.email), phone: text(d.phone), service: text(d.desiredService), updatedAt: text(d.updatedAt) };
    }),
    nextCursor: docs.at(-1) ?? null,
    hasMore: snap.docs.length > pageSize
  };
}

export async function fetchClientCount(): Promise<number> {
  return (await getCountFromServer(collection(db, 'users'))).data().count;
}

