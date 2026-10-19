import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import type { Dirent } from 'node:fs';
import type { Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const PHOTO_EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const PHOTO_FOLDERS = [
  { folder: '2024-2025', grade: 'grade10', date: '2024 - 2025' },
  { folder: '2025-2026', grade: 'grade11', date: '2025 - 2026' },
  { folder: '2026-2027', grade: 'grade12', date: '2026 - 2027' },
] as const;

function photoManifestPlugin(): Plugin {
  const projectRoot = path.resolve(__dirname);
  const photosRoot = path.join(projectRoot, 'public', 'photos');
  const manifestPath = path.join(projectRoot, 'src', 'generated', 'photo-manifest.ts');

  const buildManifest = () => {
    const photos = PHOTO_FOLDERS.flatMap(({ folder, grade, date }) => {
      const folderPath = path.join(photosRoot, folder);
      let files: Dirent[] = [];
      try {
        files = readdirSync(folderPath, { withFileTypes: true });
      } catch {
        return [];
      }

      return files
        .filter((file) => file.isFile() && PHOTO_EXTENSIONS.test(file.name))
        .map((file) => {
          const stem = file.name.replace(PHOTO_EXTENSIONS, '');
          const numbered = stem.match(/^(.*)-(\d+)$/u);
          const order = numbered ? Number(numbered[2]) : Number.MAX_SAFE_INTEGER;
          const baseName = numbered ? numbered[1] : stem;
          const name = numbered && baseName.length === 0
            ? ''
            : baseName.replace(/[_-]+/g, ' ').trim();
          const url = `/photos/${folder}/${encodeURIComponent(file.name)}`;

          return {
            id: `${grade}-${order}-${file.name}`,
            url,
            name,
            date,
            grade,
            order,
            fileName: file.name,
          };
        })
        .sort((a, b) => a.order - b.order || a.fileName.localeCompare(b.fileName, 'vi'));
    });

    const manifest = photos.map(({ order: _order, fileName: _fileName, ...photo }) => photo);
    mkdirSync(path.dirname(manifestPath), { recursive: true });
    writeFileSync(
      manifestPath,
      `import type { PhotoItem } from "../components/Album3D";\n\nexport const PHOTO_MANIFEST: PhotoItem[] = ${JSON.stringify(manifest, null, 2)};\n`,
      'utf8',
    );
  };

  const isPhotoFile = (filePath: string) => filePath.startsWith(photosRoot) && PHOTO_EXTENSIONS.test(filePath);

  return {
    name: 'photo-folder-manifest',
    buildStart: buildManifest,
    configureServer(server) {
      server.watcher.add(photosRoot);
      const refresh = (filePath: string) => {
        if (!isPhotoFile(filePath)) return;
        buildManifest();
        server.ws.send({ type: 'full-reload', path: '*' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
      server.watcher.on('change', refresh);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [photoManifestPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
