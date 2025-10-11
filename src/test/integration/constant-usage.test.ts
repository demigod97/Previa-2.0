import fs from 'node:fs';
import path from 'node:path';

// Simple "audit" to ensure magic numbers are not used directly in src/ except config
describe('Codebase audit for constant usage (integration)', () => {
  const SRC_DIR = path.resolve(__dirname, '../../');
  const EXCLUDE_DIRS = ['config', 'test'];

  const readAllFiles = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.includes(entry.name)) continue;
        files.push(...readAllFiles(path.join(dir, entry.name)));
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        files.push(path.join(dir, entry.name));
      }
    }
    return files;
  };

  const fileList = readAllFiles(SRC_DIR);

  it('does not use hardcoded 50*1024*1024 outside config', () => {
    const offenders = fileList.filter((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return /50\s*\*\s*1024\s*\*\s*1024/.test(content);
    });
    expect(offenders).toEqual([]);
  });

  it('does not use hardcoded OCR thresholds outside config', () => {
    const offenders = fileList.filter((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return /(\b0\.90\b|\b0\.95\b|\b0\.70\b)/.test(content);
    }).filter((f) => !/src\\config\\constants\.ts$/.test(f) && !/src\/config\/constants\.ts$/.test(f));

    expect(offenders).toEqual([]);
  });
});


