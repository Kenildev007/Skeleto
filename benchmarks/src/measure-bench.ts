import { Window } from 'happy-dom';
import { measureTree } from '@skeleto/web';

const SIZES = [10, 50, 100, 250, 500, 1000];
const ITERATIONS = 50;

function buildTree(window: Window, leaves: number): HTMLElement {
  const document = window.document;
  const root = document.createElement('div') as unknown as HTMLElement;
  for (let i = 0; i < leaves; i++) {
    const card = document.createElement('div');
    const avatar = document.createElement('img');
    const name = document.createElement('span');
    name.textContent = `Name ${i}`;
    const bio = document.createElement('p');
    bio.textContent = `bio ${i}`;
    card.appendChild(avatar);
    card.appendChild(name);
    card.appendChild(bio);
    root.appendChild(card);
  }
  document.body.appendChild(root as unknown as Node);
  return root;
}

function stubLayout(root: HTMLElement) {
  const all = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
  let y = 0;
  for (const el of all) {
    const rect = { x: 0, y, width: 200, height: 20, top: y, left: 0, right: 200, bottom: y + 20, toJSON: () => ({}) };
    el.getBoundingClientRect = () => rect as DOMRect;
    y += 20;
  }
}

function bench(name: string, fn: () => void): { name: string; mean: number; p95: number; min: number; max: number } {
  const samples: number[] = [];
  // Warmup
  for (let i = 0; i < 5; i++) fn();
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    fn();
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  const mean = samples.reduce((s, x) => s + x, 0) / samples.length;
  const p95 = samples[Math.floor(samples.length * 0.95)] ?? samples[samples.length - 1]!;
  return { name, mean, p95, min: samples[0]!, max: samples[samples.length - 1]! };
}

async function main() {
  const window = new Window();
  // Make happy-dom globals available where measureTree expects them
  globalThis.window = window as unknown as typeof globalThis.window;
  globalThis.document = window.document as unknown as typeof globalThis.document;
  globalThis.Node = window.Node as unknown as typeof globalThis.Node;

  console.log('# Skeleto measurement benchmark');
  console.log(`# ${ITERATIONS} iterations per size, after 5-iteration warmup`);
  console.log('');
  console.log('| Leaves | mean (ms) | p95 (ms) | min (ms) | max (ms) |');
  console.log('|--------|-----------|----------|----------|----------|');

  const results: Array<{ leaves: number; mean: number; p95: number; min: number; max: number }> = [];

  for (const leaves of SIZES) {
    const root = buildTree(window, leaves);
    stubLayout(root);
    const r = bench(`${leaves} leaves`, () => {
      measureTree({ container: root, rootRect: root.getBoundingClientRect() });
    });
    console.log(
      `| ${String(leaves).padStart(6)} | ${r.mean.toFixed(3).padStart(9)} | ${r.p95.toFixed(3).padStart(8)} | ${r.min.toFixed(3).padStart(8)} | ${r.max.toFixed(3).padStart(8)} |`,
    );
    results.push({ leaves, ...r });
    // Reset DOM for next size
    root.remove();
  }

  console.log('');
  console.log('## Targets');
  const target100 = results.find((r) => r.leaves === 100);
  if (target100) {
    const status = target100.mean < 4 ? '✓ PASS' : '✗ FAIL';
    console.log(`- <4ms initial measure for ≤100 leaves: ${target100.mean.toFixed(3)}ms ${status}`);
  }
  const target1000 = results.find((r) => r.leaves === 1000);
  if (target1000) {
    const ratio = target1000.mean / target100!.mean;
    console.log(`- 1000 vs 100 leaves: ${ratio.toFixed(1)}x slower (linear is ideal: 10x)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
