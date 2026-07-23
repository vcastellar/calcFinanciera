import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrOrgSite = repository.endsWith('.github.io');
const site = process.env.SITE_URL ?? (repository ? `https://${process.env.GITHUB_REPOSITORY?.split('/')[0]}.github.io` : 'https://example.com');
const base = process.env.BASE_PATH ?? (repository && !isUserOrOrgSite ? `/${repository}` : '/');

export default defineConfig({
  site,
  base,
});
