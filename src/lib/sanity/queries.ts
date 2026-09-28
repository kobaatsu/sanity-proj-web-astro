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
    "body": select(
      // 旧形式（Portable Text 配列）のままのドキュメントは、ひとつのリッチテキストセクションとして扱う
      body[0]._type == "block" => [{"_type": "richText", "_key": "legacy", "content": body}],
      body[]{..., _type == "bodyImage" => {"aspectRatio": asset->metadata.dimensions.aspectRatio}}
    )
  }`,
)

export const NEWS_SLUGS_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)]{ "params": { "slug": slug.current } }`,
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
