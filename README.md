# Milano — kataloq saytı

Next.js 16 (App Router) ilə tam statik (SSG) sayt. Backend yoxdur — sifarişlər WhatsApp vasitəsilə göndərilir.

## İşə salmaq

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statik nəticə: out/ qovluğu
```

`out/` qovluğunu istənilən statik hostinqə (Vercel, Netlify, Cloudflare Pages, nginx və s.) yükləmək kifayətdir.

## Dillər

- `az` — standart, kök ünvanlarda (`/`, `/mehsullar/...`)
- `en` — `/en/...`
- `ru` — `/ru/...`

## Məlumatları dəyişmək

| Nə | Fayl |
| --- | --- |
| Telefon, e-poçt, WhatsApp, menecer | `src/lib/site.ts` |
| Məhsullar, qiymətlər, endirimlər | `src/lib/data.ts` |
| Məhsul tərcümələri (EN/RU) | `src/lib/i18n/content.en.json`, `content.ru.json` |
| İnterfeys mətnləri (AZ/EN/RU) | `src/lib/i18n/dict.ts` |
| FAQ | `src/lib/faq.ts` (+ tərcümələr JSON fayllarında) |

Qiymət sahəsi `price` bazar qiymətidir, `discount` faizdir — son qiymət avtomatik hesablanır.
