---
layout: grafico_escuro
title: "Informações acessadas por apps em sistemas Android"
descricao: "O gráfico permite visualizar as permissões de uso solicitadas pelos aplicativos mapeados."
iframe: '<iframe class="d-desk" src="imagens/graficos/interativos/sankey_android/index.html" onload="loadIframe()" scrolling="no" width="100%" height="1450px" frameborder="no" seamless allowfullscreen style="max-width:100%;margin:0 auto"> </iframe>'
iframe_mobile: '<iframe class="d-mob" src="imagens/graficos/interativos/sankey_android_mobile/index.html" onload="loadIframe()" scrolling="no" width="90%" height="2350px" frameborder="no" seamless allowfullscreen style="max-width:100%;margin:0 auto"> </iframe>'
sankey: sim
filetype: svg
ordem: 1000
tipo: dados
#nota_mobile: "Gráfico com informações reduzidas no celular para facilitar visualização"
---

<div class="accordion">
    <div class="option">
      <input type="checkbox" id="toggle{{page.ordem}}" class="toggle" />
      <label class="titleaco" for="toggle{{page.ordem}}">SAIBA MAIS&nbsp;
      </label>
      <div class="contentaco">
        <p>Para consultar o grau de risco associado a cada tipo de permissão, consultar<a href="https://docs.google.com/spreadsheets/d/1GXqRZFBWWTMqJF9x1exhJT0VJQVkBeJAENW2oStNrzM/edit?usp=sharing" target="_blank">esta tabela (Google Sheets)</a> </p>
      </div>
    </div>
  </div>
