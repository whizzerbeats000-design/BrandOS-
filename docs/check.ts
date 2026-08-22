import * as ts from 'typescript';
import * as fs from 'fs';

const files = [
  'src/data/catalogue.ts',
  'src/data/homepage.ts',
  'src/data/collections.ts',
  'src/data/editorial.ts',
  'src/data/hero.ts',
  'src/components/product/ProductCard.tsx',
  'src/components/layout/DesktopSidebar.tsx',
  'src/components/hero/HeroCopy.tsx',
  'src/components/home/BrandStatement.tsx'
];

for (const file of files) {
  try {
    const src = fs.readFileSync(file, 'utf8');
    const result = ts.transpileModule(src, {
      compilerOptions: {
        jsx: ts.JsxEmit.React,
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext
      }
    });
        if ((result.diagnostics ?? []).length === 0) {
      console.log(`✅ ${file}: OK`);
    } else {
      console.log(`❌ ${file}: ${(result.diagnostics ?? []).length} errors`);
      (result.diagnostics ?? []).slice(0, 3).forEach(d => {
        console.log(`  - ${d.messageText}`);
      });
    }
  } catch (e: unknown) {
    console.log(`❌ ${file}: Exception - ${(e as Error).message}`);
  }
}
