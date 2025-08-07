<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Migrate the Project Toward TypeScript](#migrate-the-project-toward-typescript)
  - [Enable TypeScript for existing JavaScript files by adjusting the compiler options](#enable-typescript-for-existing-javascript-files-by-adjusting-the-compiler-options)
  - [Expand ESLint for TypeScript support](#expand-eslint-for-typescript-support)
  - [Migrate a small component to TypeScript to validate the setup (e.g., ThemeToggle.jsx)](#migrate-a-small-component-to-typescript-to-validate-the-setup-eg-themetogglejsx)
  - [Convert utilities and constants to TypeScript](#convert-utilities-and-constants-to-typescript)
  - [Fix TypeScript type errors in config and utils](#fix-typescript-type-errors-in-config-and-utils)
  - [Introduce global type declarations and check script](#introduce-global-type-declarations-and-check-script)
  - [Add TypeScript index files and update exports](#add-typescript-index-files-and-update-exports)
  - [Add TypeScript index files and update exports](#add-typescript-index-files-and-update-exports-1)
  - [Migrate core services and models to TypeScript](#migrate-core-services-and-models-to-typescript)
  - [Migrate hooks to TypeScript](#migrate-hooks-to-typescript)
  - [Migrate data and content modules to TypeScript](#migrate-data-and-content-modules-to-typescript)
  - [Migrate the basic components under `src/components/ui` to `.tsx` and add types.](#migrate-the-basic-components-under-srccomponentsui-to-tsx-and-add-types)
  - [Migrate `src/components/layouts` and `src/components/providers` to `.tsx`.](#migrate-srccomponentslayouts-and-srccomponentsproviders-to-tsx)
  - [Convert forms to TypeScript .tsx files](#convert-forms-to-typescript-tsx-files)
  - [Rename .jsx files in chat component](#rename-jsx-files-in-chat-component)
  - [Migrate the sections and the remaining generic components to `.tsx`.](#migrate-the-sections-and-the-remaining-generic-components-to-tsx)
  - [Update tsconfig.json and validate types](#update-tsconfigjson-and-validate-types)
  - [Define request/response interfaces in apiClient](#define-requestresponse-interfaces-in-apiclient)
  - [Install dependencies and clean scripts](#install-dependencies-and-clean-scripts)
  - [Migrate scripts to TypeScript and remove JS](#migrate-scripts-to-typescript-and-remove-js)
  - [Update ESLint config to TypeScript](#update-eslint-config-to-typescript)
  - [Remove @ts-nocheck and fix type errors](#remove-ts-nocheck-and-fix-type-errors)
  - [Update 500 and 404 pages for multilingual support](#update-500-and-404-pages-for-multilingual-support)
  - [Check and remove ts-nocheck in generateIndex.ts](#check-and-remove-ts-nocheck-in-generateindexts)
  - [Enable strict type checking for TypeScript](#enable-strict-type-checking-for-typescript)
  - [Fix moderate severity vulnerabilities in dompurify](#fix-moderate-severity-vulnerabilities-in-dompurify)
  - [Update import statements to remove extensions](#update-import-statements-to-remove-extensions)
  - [Add AstroComponent import and BaseLayoutProps definitionAdd AstroComponent import and BaseLayoutProps definition](#add-astrocomponent-import-and-baselayoutprops-definitionadd-astrocomponent-import-and-baselayoutprops-definition)
  - [Replace Record<string, any> with Record<string, unknown>](#replace-recordstring-any-with-recordstring-unknown)
  - [Check TypeScript migration status](#check-typescript-migration-status)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Migrate the Project Toward TypeScript

- **作者**: 张人大 (Renda Zhang)
- **最后更新**: August 07, 2025, 19:10 (UTC+08:00)

---

## Enable TypeScript for existing JavaScript files by adjusting the compiler options
- Enabled TypeScript to include JavaScript files and perform type checks by adding allowJs, checkJs, and noEmit within the compiler options of the project's configuration

---

## Expand ESLint for TypeScript support
- Switched ESLint to the TypeScript parser and included the @typescript-eslint plugin with recommended rules, broadening file globs to cover JS, JSX, TS, TSX, and Astro files
- Added @typescript-eslint/eslint-plugin to dev dependencies for the new lint configuration.

---

## Migrate a small component to TypeScript to validate the setup (e.g., ThemeToggle.jsx)
- Migrated the ThemeToggle component to TypeScript, introducing an explicit ThemeToggleProps interface and adding strict typing for refs, event handlers, and callbacks
- Updated the inputs index to re-export the new ThemeToggle.tsx module instead of the old JSX file
- Replaced the JavaScript storage helper with a fully typed storage.ts, introducing a StorageLike interface, backend selection, and generic IndexedDB helpers for consistent get/set/remove operations
- Updated the theme provider to import the new storage module and expose a setTheme function that accepts a boolean, allowing the ThemeToggle component to index localized content safely and toggle themes programmatically
- Scoped TypeScript checking to TypeScript sources by excluding legacy JS directories and disabling checkJs, and refreshed documentation to reference storage.ts directly

---

## Convert utilities and constants to TypeScript
- Converted shared API constants to TypeScript, adding explicit typing for the base URL and endpoints while enforcing strict headers types
- Rewrote the environment utility in TypeScript with typed snapshots, key maps, and helper functions for accessing and refreshing configuration values
- Migrated path and settings definitions to TypeScript, exporting all object literals as as const for immutable, strongly typed references throughout the app
- Updated related utilities and components to import the new .ts modules, improving type safety across language helpers and chat features

---

## Fix TypeScript type errors in config and utils
- Added strong typing to the Vite proxy configuration in the Astro config, conditionally enabling the proxy and ensuring the rewrite callback is type-safe
- Refined language detection logic to use generics when reading from storage, guaranteeing the function always returns a string
- Introduced global environment declarations for Astro and Vite, enabling features like import.meta.glob and asset URL imports
- Extended the pre-commit configuration and index generator to build both index.ts and index.js files, while skipping declaration and minified script files to keep exports clean
- Updated README and pre-commit documentation to describe the new TypeScript index generation behavior and the exclusion of .d.ts files

---

## Introduce global type declarations and check script
- Introduced a new src/types/global.d.ts file with ambient module declarations for common asset types like images and PDFs to ensure TypeScript awareness across the project
-  Added a typecheck npm script in package.json to run the TypeScript compiler in no-emission mode, providing a dedicated way to verify type safety

---

## Add TypeScript index files and update exports
- Converted layout exports to TypeScript, exposing BaseLayout.astro through a new index while disabling type checks for the file
- Replaced the script re-export module with a TypeScript version that forwards bundled libraries and suppresses type check
- Updated central exports to reference the new TypeScript entry points for layouts and scripts, cleaning up remaining references in JS entry files

---

## Add TypeScript index files and update exports
- Updated the index-generation script to respect hand-written TypeScript indexes by skipping directories whose index.ts files are marked with @ts-nocheck
- Ensured JavaScript entry files export TypeScript counterparts when no JS index exists, improving cross-language compatibility
- Regenerated component indexes so the top-level components index now points to the layouts directory's JavaScript index file

---

## Migrate core services and models to TypeScript
- Migrated the API client to TypeScript and added explicit typing for requests and chat operations
- Converted chat service streaming logic to TypeScript with typed callbacks and return values
- Introduced a typed ChatSession model and updated associated barrel exports to use the new TypeScript implementations

---

## Migrate hooks to TypeScript
- Converted core hooks to TypeScript, providing explicit interfaces, typed state, and safe update helpers for chat history management
- Added generics to deliver strongly typed locale-specific content selection via useContent
- Implemented generic validation logic in useFormValidation, ensuring typed inputs and error handling throughout form workflows
- Introduced comprehensive typings and global declarations for Markdown rendering and enhancements, including Mermaid and syntax highlighting support
- Updated hook exports to reference the new TypeScript modules, eliminating .js extensions

---

## Migrate data and content modules to TypeScript
- Migrated hero image data to TypeScript and asserted its structure using as const for stronger typing
- Updated content module exports and index files to reference .ts sources, ensuring consistency across the project
- Revised auxiliary scripts and documentation to point at the new TypeScript file paths

---

## Migrate the basic components under `src/components/ui` to `.tsx` and add types.
- Migrated UI data-display components to TypeScript with typed props and state, such as AvatarIcon, CredlyBadge, LocalizedSection, and SocialIcons
- Converted input and media components like LanguageSelector and ResponsiveHero to TypeScript, adding explicit interfaces and generics for hooks
- Streamlined index exports by removing `.js`/`.jsx` suffixes, pointing to extensionless paths for TypeScript modules
- Eliminated the React warning by introducing a typed iframeProps object and using the lowercase allowtransparency attribute, ensuring the Credly badge iframe maintains its transparent background without invalid DOM props
- Enhanced the generate-index hook to emit extensionless re-exports for both nested directories and individual modules, replacing extension-specific paths with base names
- Revised pre-commit documentation to describe the new extensionless index output and clarify the hook’s behavior
- Regenerated project indices, so modules like the UI components now re-export subfolders without file extensions

---

## Migrate `src/components/layouts` and `src/components/providers` to `.tsx`.
- Migrated layout components from .jsx to .tsx, adding strict typings for state, refs, and localized navigation items in HamburgerMenu and ensuring typed imports in NavBar and NavBarWrapper
- Introduced TypeScript interfaces and context typings for both language and theme providers, giving explicit types for context values, provider props, and setters
- Updated index files to export the new .tsx modules, maintaining consistent module references across the component library

---

## Convert forms to TypeScript .tsx files
- Converted the contact form to TypeScript and introduced structured interfaces for fields, placeholders, and typed change/submit handlers, replacing the previous JSX version
- Refactored the login form with generic form-value types, password strength enumeration, and typed submit logic for stronger validation
- Added explicit value and placeholder types, password-strength handling, and a typed agreement checkbox in the registration form
- Updated each form directory’s index to export the new .tsx modules directly

---

## Rename .jsx files in chat component
- Migrated chat UI components from JSX to TypeScript, adding explicit prop types for things like rendered callbacks and localized text handling
- Introduced shared chat domain types, covering users, messages, callbacks, and localized text structures to standardize cross-component usage
- Updated feature-level exports to reference the new TSX modules, ensuring downstream code imports the TypeScript versions of the chat components
- Updated the index generation script to treat JavaScript and TypeScript files separately, only emitting index.js where real JavaScript sources exist and preserving directories that contain a standalone index.ts
- Centralized chat message typing by reusing shared types in ChatSession, eliminating the duplicate local interface and reducing export conflicts
- Revised useChatHistory to reference the shared chat message type, keeping hook state consistent with the model layer
- Clarified the generate-index pre-commit hook so it now creates index.ts or index.js only when matching source files exist, skips JavaScript output for TypeScript-only folders, and preserves standalone index files

---

##  Migrate the sections and the remaining generic components to `.tsx`.
- Migrated the Sentry-based error boundary to TypeScript, introducing proper PropsWithChildren typing for React’s children props and returning a typed ReactElement
- Converted the docs enhancement logic to TypeScript with explicit global declarations and typed helper utilities for script loading and DOM queries
- Replaced legacy JavaScript indexes by adding a TypeScript index that re-exports all section components for consistent typed imports across the app
- Updated layout code to reference the new ErrorBoundary module without a .jsx extension, aligning with the TSX migration

---

## Update tsconfig.json and validate types
- Enabled full TypeScript coverage by narrowing the exclusion list to only the build output and disallowing JavaScript sources in the compiler options
- Extended the global Window interface with an explicit mermaid.initialize declaration to satisfy type checks when libraries load dynamically
- Added stub declaration files for bundled minified scripts and Astro layout components to provide minimal typings for the TypeScript compiler

---

## Define request/response interfaces in apiClient
- Introduced explicit request and response interfaces for the chat service, replacing untyped generics and Promise<any> with strongly typed structures to improve reliability and developer experience
- Re-exported API-specific types from the central types index so downstream consumers gain proper type hints for service calls

---

## Install dependencies and clean scripts
- Replaced bundled script assets by installing highlight.js, mermaid, marked, and dompurify from npm and removed their local .min.js counterparts
- Simplified chat rendering to rely on built-in libraries with markdown enhancements enabled via constant librariesLoaded rather than runtime script loading
- Centralized markdown processing and documentation effects through direct imports of DOMPurify, Marked, highlight.js, and Mermaid in shared hooks and components
- Removed outdated script-path exports, ensuring docs pages no longer reference local script files and are configured only with necessary styles

---

## Migrate scripts to TypeScript and remove JS
- Migrated asset validation and index generation scripts to TypeScript, adding proper typing and Node ESM utilities to ensure file name verification and index creation run under tsx
- Rewrote the hero image processing script in TypeScript, generating responsive images and LQIP data with strict typing and format-specific handling
- Updated package.json to execute scripts via tsx and documented the new TypeScript script locations in the pre-commit guide

---

## Update ESLint config to TypeScript
- Migrated ESLint to a TypeScript flat config, bundling React, Astro and Prettier rules with explicit browser/node globals, and added the necessary @eslint/js and jiti dev dependencies
- Updated documentation to reference TypeScript filenames throughout: the Sentry guide now uses sentry.client.config.ts, while language and storage utilities, responsive image maintenance, upgrade steps, and component requirements all reflect .ts or .tsx modules

---

## Remove @ts-nocheck and fix type errors
- Updated the hero image generator to emit a constant assertion so that the generated file exports an immutable object
- Added an example of the new as const hero data structure to the responsive image maintenance guide

---

## Update 500 and 404 pages for multilingual support
- Refactored the error display into a React-based ErrorSection component that leverages LocalizedSection to serve English and Chinese content, enhancing reuse across pages
- Updated the 404 and 500 Astro pages to pass localized texts into the new component, ensuring multilingual support and consistent layout metadata
- Added global styling for the error section to maintain a cohesive appearance across error pages

---

## Check and remove ts-nocheck in generateIndex.ts
- Removed the @ts-nocheck guard so directories with an index.ts file are always processed during index generation
- Added explicit ignore comments in previously empty catch blocks to satisfy linting rules and clarify intentional error suppression

---

## Enable strict type checking for TypeScript
- Enabled stricter TypeScript checking by turning on “strict” mode, “noImplicitAny,” and the Astro TypeScript plugin in the project’s configuration
- Updated ESLint to ignore generated files and warn on explicit “any” types, disabling “no-undef” to defer to TypeScript for globals
- Added lint and format scripts, improved environment variable typing, and simplified the ThemeToggle component to remove unused props

---

## Fix moderate severity vulnerabilities in dompurify
- Bumped the project’s Mermaid dependency to v11.9.0, which includes DOMPurify 3.2.6 and removes the reported XSS vulnerability

---

## Update import statements to remove extensions
- Removed TypeScript extensions from import paths to rely on default module resolution, streamlining maintenance for utilities like language helpers
- Consolidated extensionless imports throughout forms and shared utilities, including registration logic and component references
- Updated layout and configuration imports to omit .tsx references, aligning with extensionless conventions across pages and component wrappers
- Simplified constants and re-export statements by dropping explicit .ts extensions

---

## Add AstroComponent import and BaseLayoutProps definitionAdd AstroComponent import and BaseLayoutProps definition
- Typed the BaseLayout .astro declaration by adding metadata interfaces for open graph and Twitter card settings, and exposing a strongly typed export via AstroComponent<BaseLayoutProps>
- Introduced a comprehensive BaseLayoutProps interface covering layout options such as language, titles, resource arrays, attribute maps, and social metadata overrides

---

## Replace Record<string, any> with Record<string, unknown>
- Strengthened the form validation hook by switching to Record<string, unknown>, adding type-safe validator mappings, and tightening validateAll to operate on well-typed entries
- Updated login form validation to work with the new unknown-based types, adding necessary casts for email and password checks
- Revised registration form validators to accept unknown inputs and cast to the expected types, ensuring correct handling of all fields

---

## Check TypeScript migration status
- Refactor LangTexts index signature type
- Add config to global Window interface
- Update README links for langUtils
- Remove JS_FILE_EXTS support from generateIndex
- Update file comments to use .ts .tsx
- Raised the ESLint configuration to treat explicit any usage as an error, ensuring new implicit typings are blocked during CI runs
- Tightened the RegisterForm API by replacing the any-typed texts prop with the REGISTER_CONTENT structure and centralizing error messages through a typed Record for validation feedback
- Introduced a structured ExperienceEntry type in AboutContent and swapped all any casts for typed experience arrays, covering optional summary and bullet data
- Simplified CredlyBadge’s iframe loading logic by reading contentDocument readiness instead of casting the element to any
- Broadened lint coverage so ESLint now scans the entire src directory along with key configuration files, ensuring a more comprehensive code quality check
- Expanded the formatting script to run Prettier on src, scripts, and root config files for consistent formatting across the project
- Updated TypeScript migration guidance to eliminate outdated .jsx references, aligning documentation with current .tsx usage
- Converted remaining JSX code snippets in troubleshooting and error-tracking guides to TSX for consistency with the codebase
- Revised pre-commit and README documentation to reference TSX and index.ts generation only, removing mentions of index.js
- Fix unused variable errors in components
- Update useFormValidation with generic typing
- Modify ContactFormFields interface
- Reimplement update_docs in TypeScript
- Add ImportMetaEnv interface in env.d.ts
- Re-implement sync_readme.py in TypeScript
- Update getWebStorage return type
- Typed the component’s property destructuring using BaseLayoutProps, removing the need for the external declaration file
- Add optional properties to ImportMetaEnv
- Update ChatMessage role type to ChatRole
