import type { AstroComponent } from 'astro';

export interface OpenGraphProps {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
  image?: string;
  site_name?: string;
  imageWidth?: number | string;
  imageHeight?: number | string;
  imageAlt?: string;
  imageType?: string;
  secureImageUrl?: string;
}

export interface TwitterCardProps {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  site?: string;
  creator?: string;
  url?: string;
  domain?: string;
}

export interface BaseLayoutProps {
  lang?: string;
  title?: string;
  titleZh?: string;
  titleEn?: string;
  description?: string;
  viewport?: string;
  canonical?: string;
  personSchemaJson?: string;
  extraStyles?: Array<string | URL | null | undefined>;
  preloadStyles?: Array<string | URL | null | undefined>;
  extraScripts?: Array<string | null | undefined>;
  showNav?: boolean;
  showFooter?: boolean;
  bodyClass?: string;
  mainClass?: string;
  bodyAttrs?: Record<string, unknown>;
  mainAttrs?: Record<string, unknown>;
  og?: OpenGraphProps;
  twitter?: TwitterCardProps;
  includeGeo?: boolean;
  metaRobots?: string;
  metaLanguage?: string;
  metaAuthor?: string;
}

declare const Component: AstroComponent<BaseLayoutProps>;
export default Component;
