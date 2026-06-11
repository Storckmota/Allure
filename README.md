# Alluré — Dossiê Alluré (Awwwards Concept)

Conceito experimental de homepage para a **Alluré Branding** — independente do projeto estável
`allure-branding-site/` (que permanece intocado).

## Conceito

**Dark editorial noir.** Um dossiê de marca em fundo carvão, onde a tipografia Magiona Display
em escala monumental conduz a página. A pergunta *"Sua marca é realmente sua?"* é decomposta
em três atos tipográficos, com o *"sua?"* carmim gigante carimbado sobre o retrato em arco da
fundadora. Capítulos numerados (01 Essência, 02 Processo), uma transição manifesto que vira a
página do escuro para o creme, fechamento em chapa carmim e rodapé cortado por um "Alluré"
colossal em contorno.

## Stack

- Vite (dev server + build)
- GSAP + ScrollTrigger (entrada coreografada, manifesto pinado com scrub, reveals, cursor, botões magnéticos)
- Sem Three.js — nada no conceito exige 3D

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Conteúdo

Todo o copy, links, contatos, paleta, tipografia e imagens são reais, extraídos dos materiais
da marca (`allure-branding-site/` e `reference-materials/`). Nada foi inventado.

## Acessibilidade

- HTML semântico, navegação por teclado, `:focus-visible` visível
- `prefers-reduced-motion`: remove loader, cursor customizado e toda a coreografia — conteúdo integral permanece visível
- Animações em `transform`/`opacity`
