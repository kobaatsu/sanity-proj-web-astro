import {searchNews} from '../sanity/queries'
import {withBase} from '../url'
import type {NewsSearchHit} from './types'

/** Sanity Content Lake へ GROQ で直接問い合わせて検索する */
export async function searchBySanity(term: string): Promise<NewsSearchHit[]> {
  const results = await searchNews(term)
  return results.flatMap((item) =>
    item.slug?.current
      ? [
          {
            url: withBase(`/news/${item.slug.current}`),
            title: item.title ?? '（無題）',
            excerpt: item.excerpt ?? '',
            excerptIsHtml: false,
          },
        ]
      : [],
  )
}
