# Alluré — Dossiê Alluré

Conceito experimental de homepage (estilo Awwwards) para a **Alluré Branding**, especialista em
registro de marcas no INPI. Editorial noir em fundo carvão, tipografia monumental e a pergunta
*"Sua marca é realmente sua?"* decomposta em três atos tipográficos sobre o retrato da fundadora,
com transição manifesto, depoimentos, programa de indicação e fechamento em chapa carmim.

## Stack

- **Vite 6** — dev server e build
- **GSAP + ScrollTrigger** — entrada coreografada, manifesto pinado com scrub, reveals, cursor e botões magnéticos
- HTML semântico + CSS puro (fontes próprias: Magiona Display e Plus Jakarta Sans)
- Suporte a `prefers-reduced-motion` (remove a coreografia, mantém todo o conteúdo visível)

## Comandos

```bash
npm install
npm run dev       # servidor local (http://localhost:5173)
npm run build     # build de produção → dist/
npm run preview   # serve o build de dist/ localmente
```

## Deploy (Vercel)

Projeto Vite padrão — a Vercel detecta o framework automaticamente. Nenhuma configuração extra
é necessária:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Status

Versão final aprovada, pronta para deploy.
