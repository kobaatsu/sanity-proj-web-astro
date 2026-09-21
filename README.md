# Astro with Tailwind

```sh
pnpm create astro@latest -- --template with-tailwindcss
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/with-tailwindcss)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/with-tailwindcss)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/with-tailwindcss/devcontainer.json)

Astro comes with [Tailwind](https://tailwindcss.com) support out of the box. This example showcases how to style your Astro project with Tailwind.

For complete setup instructions, please see our [Tailwind Styling Guide](https://docs.astro.build/en/guides/styling/#tailwind).

## Deploy (GitHub Pages)

This site is deployed as a static site to GitHub Pages via `.github/workflows/deploy.yml`.

- Push (or merge) to `main` triggers a build and deploy automatically.
- Manual runs are also possible from the Actions tab (`workflow_dispatch`).
- Published URL: https://kobaatsu.github.io/sanity-proj-web-astro/

### One-time repository setup

1. Repository **Settings > Pages > Build and deployment > Source** を `GitHub Actions` に変更する。
2. Repository **Settings > Secrets and variables > Actions > Variables** に以下を登録する（Secrets ではなく Variables でよい。値は公開されても問題のない Sanity project ID / dataset 名のため）。
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET`

### base path について

GitHub Pages (Project Pages) はリポジトリ名がURLのサブパスになる（例: `/sanity-proj-web-astro/`）。
`astro.config.mjs` では `CI=true`（GitHub Actions 上で自動的に設定される）の場合のみ `base` を付与し、ローカルの `pnpm dev` / `pnpm build` / `pnpm preview` は従来通りルート (`/`) のまま動作する。

サイト内リンクは `src/lib/url.ts` の `withBase()` を通して組み立てており、base の有無に関わらず正しいパスになる。リポジトリ名を変更する場合は `astro.config.mjs` の `base` の値も合わせて変更すること。
