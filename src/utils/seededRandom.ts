let sequence = 0;

function xmur3(value: string): () => number {
  let hash = 1779033703 ^ value.length;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function mulberry32(seed: number): () => number {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandom(seed: string): () => number {
  const hash = xmur3(seed);
  return mulberry32(hash());
}

export function createSeed(): string {
  sequence += 1;
  const source = `${Date.now()}-${sequence}`;
  const first = xmur3(source)().toString(36).toUpperCase().padStart(7, '0');
  const second = xmur3(`${source}-seed`)().toString(36).toUpperCase().padStart(7, '0');
  const hash = `${first}${second}`;
  return `${hash.slice(0, 3)}-${hash.slice(3, 6)}-${hash.slice(6, 8)}`;
}

export function createId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`;
}
