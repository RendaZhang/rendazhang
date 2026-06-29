import { describe, expect, it } from 'vitest';

import {
  AWS_SAA_CREDENTIAL_SCHEMA_ID,
  CERTIFICATIONS_PAGE_SCHEMA_ID,
  DOCS_PAGE_SCHEMA_ID,
  HOME_PROFILE_PAGE_SCHEMA_ID,
  PERSON_SCHEMA_ID,
  WEBSITE_SCHEMA_ID,
  buildCertificationsStructuredDataJson,
  buildDocsStructuredDataJson,
  buildHomeStructuredDataJson
} from '../constants/meta';

type StructuredDataGraph = {
  '@context': string;
  '@graph': Array<Record<string, unknown>>;
};

function parseGraph(json: string): StructuredDataGraph {
  const parsed = JSON.parse(json) as StructuredDataGraph;
  expect(parsed['@context']).toBe('https://schema.org');
  expect(Array.isArray(parsed['@graph'])).toBe(true);
  return parsed;
}

function findNode(graph: StructuredDataGraph, id: string): Record<string, unknown> {
  const node = graph['@graph'].find((entry) => entry['@id'] === id);
  expect(node, `expected graph node ${id}`).toBeDefined();
  return node as Record<string, unknown>;
}

describe('structured data builders', () => {
  it('builds a public-safe homepage ProfilePage graph', () => {
    const graph = parseGraph(buildHomeStructuredDataJson());
    const serialized = JSON.stringify(graph);

    expect(serialized).toContain('Renda Zhang');
    expect(serialized).toContain('张人大');
    expect(serialized).toContain('Java');
    expect(serialized).toContain('Kubernetes');
    expect(serialized).toContain('OneConnect Financial Technology');
    expect(serialized).toContain('Senior Backend Engineer / Team Lead');
    expect(serialized).toContain('Insurance platforms');
    expect(serialized).toContain('Incoming employer');
    expect(serialized).not.toContain('@qq.com');
    expect(serialized).not.toContain('+86-139');
    expect(serialized).not.toContain('139250');
    expect(serialized).not.toContain('salary');
    expect(serialized).not.toContain('薪资');
    expect(serialized).not.toContain('报到地点');

    const person = findNode(graph, PERSON_SCHEMA_ID);
    expect(person['@type']).toBe('Person');
    expect(person['worksFor']).toBeUndefined();
    expect(person['affiliation']).toEqual(
      expect.objectContaining({
        '@type': 'Organization',
        name: 'OneConnect Financial Technology'
      })
    );
    expect(findNode(graph, WEBSITE_SCHEMA_ID)['@type']).toBe('WebSite');
    expect(findNode(graph, AWS_SAA_CREDENTIAL_SCHEMA_ID)['@type']).toBe(
      'EducationalOccupationalCredential'
    );

    const profilePage = findNode(graph, HOME_PROFILE_PAGE_SCHEMA_ID);
    expect(profilePage['@type']).toBe('ProfilePage');
    expect(profilePage['mainEntity']).toEqual({ '@id': PERSON_SCHEMA_ID });
  });

  it('builds a docs WebPage graph with bilingual documentation signals', () => {
    const graph = parseGraph(buildDocsStructuredDataJson());
    const docsPage = findNode(graph, DOCS_PAGE_SCHEMA_ID);

    expect(docsPage['@type']).toBe('WebPage');
    expect(docsPage['name']).toBe('Technical Documentation · Renda Zhang');
    expect(docsPage['alternateName']).toBe('技术文档 · 张人大');
    expect(JSON.stringify(docsPage)).toContain('SEO');
    expect(JSON.stringify(docsPage)).toContain('Java');
    expect(JSON.stringify(docsPage)).toContain('Spring');
  });

  it('builds a certifications CollectionPage graph with credential list metadata', () => {
    const graph = parseGraph(buildCertificationsStructuredDataJson());
    const certificationsPage = findNode(graph, CERTIFICATIONS_PAGE_SCHEMA_ID);
    const credential = findNode(graph, AWS_SAA_CREDENTIAL_SCHEMA_ID);

    expect(certificationsPage['@type']).toBe('CollectionPage');
    expect(certificationsPage['mainEntity']).toEqual({
      '@id': 'https://www.rendazhang.com/certifications/#credential-list'
    });
    expect(credential['name']).toBe('AWS Certified Solutions Architect - Associate (SAA-C03)');
    expect(credential['dateIssued']).toBe('2025-06-16');
    expect(credential['expires']).toBe('2028-06-16');
    expect(JSON.stringify(graph)).toContain('Amazon Web Services');
  });
});
