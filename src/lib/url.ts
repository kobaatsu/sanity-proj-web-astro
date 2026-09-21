/**
 * サイトの base path (import.meta.env.BASE_URL) とパスを安全に連結する。
 * BASE_URL は末尾スラッシュの有無が環境によって異なる（"/" や "/sub" など）ため、
 * 素朴な文字列連結だと "//path" のような二重スラッシュが発生し得る。
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const trimmedPath = path.startsWith('/') ? path : `/${path}`
  return `${trimmedBase}${trimmedPath}`
}
