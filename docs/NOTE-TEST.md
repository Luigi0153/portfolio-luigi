# Note sui test Playwright

Da leggere solo quando scrivi o modifichi i test in `scripts/`. I test girano sulla build di
preview (regola 7 di `CLAUDE.md`), mai sul dev server.

- **Scroll animato.** Lo scroll del sito è animato: prima di uno screenshot o di uno scroll
  aggiungi `page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" })`, altrimenti
  la pagina è ancora in movimento quando la fotografi.
- **Screenshot di un elemento.** Include la nav sticky, che gli finisce sopra. Per guardare una
  sezione com'è davvero, scorri fino a lei e fai lo screenshot della pagina.
- **Trascinamento col dito.** `page.touchscreen.tap` fa solo un tocco. Per trascinare usa eventi
  touch veri via CDP: `context.newCDPSession(page)` e `Input.dispatchTouchEvent` con `touchStart`,
  più `touchMove`, poi `touchEnd`. Il contesto va aperto con `hasTouch` e `isMobile`, altrimenti a
  390px `(hover: hover)` risponde comunque vero.
- **Animazioni CSS.** Non chiamare `play()`, `pause()` o `currentTime` sull'animazione che poi
  vuoi controllare dal CSS (per esempio la pausa all'hover): dopo la chiamata l'API scavalca il
  CSS e i controlli successivi risultano falsi. Se serve, fallo in una pagina a parte.
- **Elementi clonati con `transition:name`.** Due elementi con lo stesso `view-transition-name`
  fanno saltare la transizione. Chi clona un nodo (come le copie del carosello) deve togliere
  `data-astro-transition-scope` dalla copia.
- **Pausa al focus.** Usa `:has(:focus-visible)`, non `:focus-within`: un clic col mouse su un
  link darebbe il focus e lascerebbe l'elemento in pausa per sempre.
- **Pagine senza JavaScript.** Con `javaScriptEnabled: false`, `page.addStyleTag` manda la pagina in crash ("Target crashed"). Per fermare lo scroll animato usa `reducedMotion: "reduce"` nel contesto. I moduli di `/contatti` si provano così (`scripts/test-contatti.mjs`), con Formspree intercettato da `context.route`: il POST nativo arriva urlencoded, quello di `fetch` multipart.
