// Shared head/JSON-LD setup for SEO landing pages (LandingPage + CustomPuzzlePage).
import type { Landing } from '@/data/landings'
import { absUrl, setMeta, setCanonical, setJsonLd, removeJsonLd, resetHead, SITE } from '@/lib/seo'

const LD_ID = 'ld-landing'

function landingGraph(l: Landing) {
  const path = `/${l.key}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
          { '@type': 'ListItem', position: 2, name: l.h1, item: absUrl(path) },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': absUrl(`${path}#webpage`),
        url: absUrl(path),
        name: l.h1,
        description: l.description,
        isPartOf: { '@id': absUrl('/#website') },
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        mainEntity: l.faq.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  }
}

/** Apply a landing page's title/description/canonical + JSON-LD; returns a cleanup fn. */
export function applyLandingHead(l: Landing): () => void {
  document.title = l.title.includes(SITE) ? l.title : `${l.title} | ${SITE}`
  setMeta('description', l.description)
  setCanonical(`/${l.key}`)
  setJsonLd(LD_ID, landingGraph(l))
  return () => {
    resetHead()
    removeJsonLd(LD_ID)
  }
}
