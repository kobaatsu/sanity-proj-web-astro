import {defineQuery} from 'groq'
import {sanityClient} from 'sanity:client'

export const NEWS_LIST_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)] | order(publishedAt desc){
    _id, title, slug, publishedAt, "category": category->{title, slug}, excerpt
  }`,
)

export const NEWS_BY_SLUG_QUERY = defineQuery(
  `*[_type == "news" && slug.current == $slug][0]{
    _id, title, publishedAt, "category": category->{title, slug}, mainImage,
    "body": body[]{..., _type == "bodyImage" => {"aspectRatio": asset->metadata.dimensions.aspectRatio}}
  }`,
)

export const NEWS_SLUGS_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)]{ "params": { "slug": slug.current } }`,
)

/**
 * お知らせの全文検索（ブラウザから Content Lake へ直接問い合わせる用）。
 * タイトル > 概要 > 本文の順に重み付けしてスコア順に返す。
 */
export const NEWS_SEARCH_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)
    && [title, excerpt, pt::text(body[_type == "richText"].content[])] match text::query($term)]
    | score(
      boost(title match text::query($term), 3),
      boost(excerpt match text::query($term), 2),
      body[].content[].children[].text match text::query($term)
    )
    | order(_score desc, publishedAt desc)[0...20]{
      _id, title, slug, excerpt
    }`,
)

export const COMPANY_INFO_QUERY = defineQuery(`*[_type == "companyInfo"][0]`)

export async function getNewsList() {
  return await sanityClient.fetch(NEWS_LIST_QUERY)
}

export async function getNewsBySlug(slug: string) {
  return await sanityClient.fetch(NEWS_BY_SLUG_QUERY, {slug})
}

export async function getCompanyInfo() {
  return await sanityClient.fetch(COMPANY_INFO_QUERY)
}

/** ブラウザから呼ぶ前提のため、CDN 経由・公開済みドキュメントのみで検索する */
export async function searchNews(term: string) {
  return await sanityClient
    .withConfig({useCdn: true, perspective: 'published'})
    .fetch(NEWS_SEARCH_QUERY, {term})
}
