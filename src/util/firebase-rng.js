export async function getRandomDocument(collectionRef, rejectFn) {
  const [op, order] = Math.random() < 0.5 ? ['<=', 'desc'] : ['>=', 'asc'];
  const snap = await collectionRef
    .where('rng', op, Math.random())
    .orderBy('rng', order)
    .limit(1)
    .get();
  const [doc] = snap.docs;
  if (rejectFn && rejectFn(doc.data(), doc)) {
    return getRandomDocument(collectionRef, rejectFn);
  }
  return doc;
}
