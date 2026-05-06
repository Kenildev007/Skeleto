import { Window } from 'happy-dom';

const window = new Window();
globalThis.window = window as unknown as typeof globalThis.window;
globalThis.document = window.document as unknown as typeof globalThis.document;
globalThis.Node = window.Node as unknown as typeof globalThis.Node;

const document = window.document;

function buildFlatTree(leaves: number): HTMLElement {
  const root = document.createElement('div') as unknown as HTMLElement;
  for (let i = 0; i < leaves; i++) {
    const span = document.createElement('span');
    span.textContent = `leaf ${i}`;
    root.appendChild(span);
  }
  document.body.appendChild(root as unknown as Node);
  return root;
}

function buildCardTree(cards: number): HTMLElement {
  const root = document.createElement('div') as unknown as HTMLElement;
  for (let i = 0; i < cards; i++) {
    const card = document.createElement('div');
    const a = document.createElement('img');
    const b = document.createElement('span');
    b.textContent = `Name ${i}`;
    const c = document.createElement('p');
    c.textContent = `bio ${i}`;
    card.appendChild(a);
    card.appendChild(b);
    card.appendChild(c);
    root.appendChild(card);
  }
  document.body.appendChild(root as unknown as Node);
  return root;
}

function stubLayout(root: HTMLElement) {
  const all = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
  for (let i = 0; i < all.length; i++) {
    const y = i * 20;
    const rect = { x: 0, y, width: 200, height: 20, top: y, left: 0, right: 200, bottom: y + 20, toJSON: () => ({}) };
    (all[i] as HTMLElement).getBoundingClientRect = () => rect as DOMRect;
  }
}

function timeOnly<T>(label: string, fn: () => T, iters = 20): { ms: number; result: T } {
  let result!: T;
  const start = performance.now();
  for (let i = 0; i < iters; i++) result = fn();
  const ms = (performance.now() - start) / iters;
  return { ms, result };
}

async function main() {
  // Compare flat tree vs card tree at 1000 elements
  const { measureTree } = await import('@kenildev007/skeleto-web');

  console.log('# Profile: flat tree vs nested card tree\n');

  for (const N of [100, 500, 1000, 2000]) {
    document.body.innerHTML = '';
    const flat = buildFlatTree(N);
    stubLayout(flat);
    const flatRect = flat.getBoundingClientRect();
    // Warmup
    measureTree({ container: flat, rootRect: flatRect });
    const flatTiming = timeOnly('flat', () => measureTree({ container: flat, rootRect: flatRect }));
    console.log(`Flat ${N} leaves : ${flatTiming.ms.toFixed(3)}ms (${flatTiming.result.length} bones)`);
  }

  console.log('');
  for (const N of [100, 500, 1000]) {
    document.body.innerHTML = '';
    const cards = buildCardTree(N);
    stubLayout(cards);
    const cardsRect = cards.getBoundingClientRect();
    measureTree({ container: cards, rootRect: cardsRect });
    const t = timeOnly('cards', () => measureTree({ container: cards, rootRect: cardsRect }));
    console.log(`Cards ${N} cards (~${N * 3} leaves): ${t.ms.toFixed(3)}ms (${t.result.length} bones)`);
  }

  // Sub-op timing
  console.log('\n# Sub-operation cost on 1000-card tree (~3000 leaves)');
  document.body.innerHTML = '';
  const big = buildCardTree(1000);
  stubLayout(big);
  const all = [big, ...Array.from(big.querySelectorAll('*'))] as HTMLElement[];

  const t1 = timeOnly('getBoundingClientRect on all', () => {
    for (const el of all) el.getBoundingClientRect();
  });
  console.log(`  getBoundingClientRect x ${all.length}: ${t1.ms.toFixed(3)}ms`);

  const t2 = timeOnly('getComputedStyle on all', () => {
    for (const el of all) window.getComputedStyle(el as never);
  });
  console.log(`  getComputedStyle x ${all.length}: ${t2.ms.toFixed(3)}ms`);

  const t3 = timeOnly('textContent on all', () => {
    for (const el of all) {
      const _ = (el.textContent ?? '').trim();
    }
  });
  console.log(`  textContent.trim x ${all.length}: ${t3.ms.toFixed(3)}ms`);

  const t4 = timeOnly('Array.from(children) on all', () => {
    for (const el of all) Array.from(el.children);
  });
  console.log(`  Array.from(children) x ${all.length}: ${t4.ms.toFixed(3)}ms`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
