import type { Core } from '@strapi/strapi';

/**
 * Strapi's `populate=*` only resolves one level of components. Several schemas here
 * nest a component inside another component (e.g. homepage.hero.primaryCta,
 * about-page.mission.heading) — those inner fields come back as `undefined` under
 * the default shallow populate, which crashes frontend code that reads them directly
 * (e.g. `hero.primaryCta.href`). This walks the schema and builds a populate object
 * that recurses through every component/dynamiczone field, so nested components are
 * always fully resolved regardless of what the client requests.
 */
function buildPopulate(strapi: Core.Strapi, uid: string, seen: Set<string>): true | Record<string, unknown> {
  if (seen.has(uid)) return true;
  const nextSeen = new Set(seen).add(uid);

  const schema = strapi.getModel(uid as Parameters<typeof strapi.getModel>[0]);
  const attributes = schema?.attributes as Record<string, any> | undefined;
  if (!attributes) return true;

  const populate: Record<string, unknown> = {};

  for (const [key, attr] of Object.entries(attributes)) {
    // createdBy/updatedBy are admin-user relations Strapi adds to every schema;
    // the public API rejects populating them ("Invalid key createdBy").
    if (attr.type === 'relation' && (key === 'createdBy' || key === 'updatedBy' || attr.target === 'admin::user')) {
      continue;
    }

    if (attr.type === 'component') {
      populate[key] = { populate: buildPopulate(strapi, attr.component, nextSeen) };
    } else if (attr.type === 'dynamiczone') {
      populate[key] = {
        on: Object.fromEntries(
          attr.components.map((component: string) => [
            component,
            { populate: buildPopulate(strapi, component, nextSeen) },
          ])
        ),
      };
    } else if (attr.type === 'media' || attr.type === 'relation') {
      populate[key] = true;
    }
  }

  return populate;
}

export function deepPopulate(strapi: Core.Strapi, uid: string) {
  return buildPopulate(strapi, uid, new Set());
}
