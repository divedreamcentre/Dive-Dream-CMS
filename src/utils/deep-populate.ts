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
  // Strapi auto-adds these relations to every schema (createdBy/updatedBy point at
  // admin::user, localizations is added even without the i18n plugin enabled); the
  // public API rejects populating any of them ("Invalid key <name>").
  const reservedRelations = new Set(['createdBy', 'updatedBy', 'localizations']);

  for (const [key, attr] of Object.entries(attributes)) {
    if (attr.type === 'relation' && (reservedRelations.has(key) || attr.configurable === false || attr.target === 'admin::user')) {
      continue;
    }

    if (attr.type === 'component') {
      const inner = buildPopulate(strapi, attr.component, nextSeen);
      populate[key] = inner === true ? true : { populate: inner };
    } else if (attr.type === 'dynamiczone') {
      populate[key] = {
        on: Object.fromEntries(
          attr.components.map((component: string) => {
            const inner = buildPopulate(strapi, component, nextSeen);
            return [component, inner === true ? true : { populate: inner }];
          })
        ),
      };
    } else if (attr.type === 'media' || attr.type === 'relation') {
      populate[key] = true;
    }
  }

  // A component with no media/relation/component fields of its own (e.g.
  // shared.section-heading, shared.cta-button) produces an empty populate object here.
  // Strapi silently drops the entire branch — including parent fields — when it
  // receives `{ populate: {} }`, so fall back to `true` for these leaf components.
  return Object.keys(populate).length > 0 ? populate : true;
}

export function deepPopulate(strapi: Core.Strapi, uid: string) {
  return buildPopulate(strapi, uid, new Set());
}
