/** お知らせ検索の結果1件（検索エンジンの違いを吸収した共通形） */
export type NewsSearchHit = {
  url: string
  title: string
  /** 抜粋テキスト。Pagefind の場合は一致箇所が <mark> で囲まれた HTML */
  excerpt: string
  excerptIsHtml: boolean
}

export type NewsSearchEngine = 'pagefind' | 'sanity'

export function isNewsSearchEngine(value: unknown): value is NewsSearchEngine {
  return value === 'pagefind' || value === 'sanity'
}
