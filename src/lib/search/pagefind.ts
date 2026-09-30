import {withBase} from '../url'
import type {NewsSearchHit} from './types'

/** Pagefind のブラウザ向けAPIのうち、本サイトで使う部分のみの型 */
type PagefindResultData = {
  url: string
  excerpt: string
  meta: {title?: string}
}

type PagefindApi = {
  options: (options: {baseUrl?: string}) => Promise<void>
  search: (term: string) => Promise<{results: {data: () => Promise<PagefindResultData>}[]}>
}

function isPagefindApi(value: unknown): value is PagefindApi {
  return (
    typeof value === 'object' &&
    value !== null &&
    'options' in value &&
    typeof value.options === 'function' &&
    'search' in value &&
    typeof value.search === 'function'
  )
}

const MAX_RESULTS = 20

let pagefindPromise: Promise<PagefindApi> | undefined

/**
 * ビルド時に `pagefind --site dist` で生成される pagefind.js を読み込む。
 * dev サーバーでは生成物が存在しないため失敗する（build + preview で確認する）。
 */
function loadPagefind(): Promise<PagefindApi> {
  pagefindPromise ??= (async () => {
    const module: unknown = await import(/* @vite-ignore */ withBase('/pagefind/pagefind.js'))
    if (!isPagefindApi(module)) throw new Error('pagefind.js の形式が想定と異なります')
    // 検索結果の URL に GitHub Pages のサブパスを付与する
    await module.options({baseUrl: import.meta.env.BASE_URL})
    return module
  })()
  // 読み込み失敗時は次回リトライできるようキャッシュを破棄する
  pagefindPromise.catch(() => {
    pagefindPromise = undefined
  })
  return pagefindPromise
}

/** Pagefind（ビルド時に生成した静的インデックス）で検索する */
export async function searchByPagefind(term: string): Promise<NewsSearchHit[]> {
  const pagefind = await loadPagefind()
  const search = await pagefind.search(term)

  const data = await Promise.all(search.results.slice(0, MAX_RESULTS).map((r) => r.data()))
  return data.map((d) => ({
    url: d.url,
    title: d.meta.title ?? d.url,
    excerpt: d.excerpt,
    excerptIsHtml: true,
  }))
}
