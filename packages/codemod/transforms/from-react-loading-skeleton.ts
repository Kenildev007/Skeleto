import type { API, FileInfo, Options, JSCodeshift, Collection } from 'jscodeshift';

/**
 * Migrates `react-loading-skeleton` -> `skeleton-auto`.
 *
 * - Rewrites the package import.
 * - Removes Skeleton placeholder JSX trees inside ternaries:
 *     `{loading ? <SkeletonTree /> : <RealContent />}`
 *   becomes
 *     `<AutoSkeleton loading={loading}><RealContent /></AutoSkeleton>`
 *
 * It does NOT attempt to convert standalone <Skeleton> usages outside the
 * common `loading ? skeleton : content` pattern — those need a manual review.
 */
export default function transform(file: FileInfo, api: API, _options: Options): string | null {
  const j: JSCodeshift = api.jscodeshift;
  const root: Collection = j(file.source);
  let changed = false;

  // 1. Rewrite imports
  root
    .find(j.ImportDeclaration, { source: { value: 'react-loading-skeleton' } })
    .forEach((path) => {
      path.node.source = j.literal('skeleton-auto');
      // Replace default import `Skeleton` with named `AutoSkeleton`
      const specs = path.node.specifiers ?? [];
      const newSpecs = specs.map((s) => {
        if (s.type === 'ImportDefaultSpecifier') {
          return j.importSpecifier(j.identifier('AutoSkeleton'));
        }
        return s;
      });
      path.node.specifiers = newSpecs;
      changed = true;
    });

  // Drop any `import 'react-loading-skeleton/dist/skeleton.css'`
  root
    .find(j.ImportDeclaration, { source: { value: 'react-loading-skeleton/dist/skeleton.css' } })
    .forEach((path) => {
      j(path).replaceWith(
        j.importDeclaration([], j.literal('skeleton-auto/styles.css')),
      );
      changed = true;
    });

  // 2. Convert `loading ? <SkeletonStuff/> : <Real/>` to AutoSkeleton wrapper
  root.find(j.ConditionalExpression).forEach((path) => {
    const node = path.node;
    if (!isSkeletonyTree(j, node.consequent)) return;
    if (!j.JSXElement.check(node.alternate) && !j.JSXFragment.check(node.alternate)) return;

    const wrapped = j.jsxElement(
      j.jsxOpeningElement(
        j.jsxIdentifier('AutoSkeleton'),
        [
          j.jsxAttribute(
            j.jsxIdentifier('loading'),
            j.jsxExpressionContainer(node.test as never),
          ),
        ],
        false,
      ),
      j.jsxClosingElement(j.jsxIdentifier('AutoSkeleton')),
      [node.alternate as never],
    );
    j(path).replaceWith(wrapped);
    changed = true;
  });

  return changed ? root.toSource() : null;
}

function isSkeletonyTree(j: JSCodeshift, expr: unknown): boolean {
  // Recognize either a single <Skeleton .../> or a tree containing one
  if (j.JSXElement.check(expr)) {
    const name = expr.openingElement.name;
    if (name.type === 'JSXIdentifier' && name.name === 'Skeleton') return true;
    return expr.children?.some((c) => isSkeletonyTree(j, c)) ?? false;
  }
  if (j.JSXFragment.check(expr)) {
    return expr.children?.some((c) => isSkeletonyTree(j, c)) ?? false;
  }
  return false;
}

export const parser = 'tsx';
