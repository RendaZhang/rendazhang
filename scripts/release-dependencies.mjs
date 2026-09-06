// Runner-only graph extraction using the already pinned TypeScript parser, never on the server.
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2]);
const graph = {};
function visitDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Linked source file');
    if (entry.isDirectory()) visitDirectory(filename);
    else if (/\.(m?js)$/.test(entry.name)) {
      const relative = path.relative(root, filename).split(path.sep).join('/');
      const source = ts.createSourceFile(
        relative,
        fs.readFileSync(filename, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.JS
      );
      if (source.parseDiagnostics.length) throw new Error('Invalid JavaScript source');
      const refs = new Set();
      const literal = (node) =>
        ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
      const isUrl = (node) =>
        ts.isNewExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'URL' &&
        node.arguments?.length === 2;
      function literalUrl(node) {
        if (!isUrl(node) || !literal(node.arguments[0])) return null;
        const base =
          node.arguments[1].getText(source) === 'import.meta.url'
            ? new URL('/' + relative, 'https://fixture.invalid')
            : literalUrl(node.arguments[1]);
        return base ? new URL(node.arguments[0].text, base) : null;
      }
      function add(value, buildRoot = false) {
        if (/^(?:[a-z]+:|\/\/|#)/i.test(value)) return;
        // Bare specifiers cannot occur in this static browser bundle.
        if (!buildRoot && !value.startsWith('.') && !value.startsWith('/')) {
          throw new Error('Unresolved bare module specifier');
        }
        const base = buildRoot ? '/' : '/' + relative;
        const resolved = decodeURIComponent(
          new URL(value, 'https://fixture.invalid' + base).pathname
        ).slice(1);
        if (resolved.split('/').includes('..')) throw new Error('Escaping module reference');
        refs.add(resolved);
      }
      function walk(node) {
        if (
          (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
          node.moduleSpecifier &&
          literal(node.moduleSpecifier)
        )
          add(node.moduleSpecifier.text);
        if (
          ts.isCallExpression(node) &&
          node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments.length === 1 &&
          literal(node.arguments[0])
        )
          add(node.arguments[0].text);
        // A nested second argument is a resolution base, not a fetched resource.
        if (isUrl(node) && !(isUrl(node.parent) && node.parent.arguments[1] === node)) {
          const url = literalUrl(node);
          if (url?.origin === 'https://fixture.invalid') add(url.pathname);
        }
        if (ts.isVariableDeclaration(node) && node.name.getText(source) === '__vite__mapDeps') {
          function dependencies(child) {
            if (ts.isArrayLiteralExpression(child) && child.elements.every(literal)) {
              for (const element of child.elements) add(element.text, true);
            }
            ts.forEachChild(child, dependencies);
          }
          dependencies(node);
        }
        ts.forEachChild(node, walk);
      }
      walk(source);
      graph[relative] = [...refs].sort();
    }
  }
}
visitDirectory(root);
process.stdout.write(JSON.stringify(graph));
