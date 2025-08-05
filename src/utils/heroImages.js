// Glob import hero images and export their paths
const heroImageModules = import.meta.glob('../assets/heroes/*.{webp,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default'
});

export const HERO_IMAGE_PATHS = {};
for (const [path, url] of Object.entries(heroImageModules)) {
  const name = path.split('/').pop();
  HERO_IMAGE_PATHS[name] = url;
}
