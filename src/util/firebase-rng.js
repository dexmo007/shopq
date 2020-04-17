export async function getRandomDocument(collectionRef) {
  const [op, order] = Math.random() < 0.5 ? ['<=', 'desc'] : ['>=', 'asc'];
  const snap = await collectionRef
    .where('rng', op, Math.random())
    .orderBy('rng', order)
    .limit(1)
    .get();
  return snap.docs[0];
}
