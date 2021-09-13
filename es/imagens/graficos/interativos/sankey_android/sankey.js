async function draw() {

  const dimensions = {
    width: 900,
    height: 1150,
    margin: {
      top: 50,
      right: 150,
      bottom: 50,
      left: 120
    },
    nodeWidth: 10
  }
  dimensions.wrapperWidth = dimensions.width + dimensions.margin.left + dimensions.margin.right;
  dimensions.wrapperHeight = dimensions.height + dimensions.margin.top + dimensions.margin.top;
  const offOpacity = 0.1;
  const onOpacity = 0.8;

  const links = await d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vQq4GCKf_GrJ8Uv6ndvPDj4cxDU2WAKXGmnAei4aXBtSBXapdCdPwv6QWmivMpzRLCQr5BXkimBcrT-/pub?gid=112930168&single=true&output=csv");
  links.map(l => {
    l.value = +l.value;
    l.count = +l.count;
  });
  const ufs = Array.from(d3.group(links.filter(d => d.uf != ""), d => d.uf).keys());
  const products = Array.from(d3.group(links.filter(d => d.funcao != ""), d => d.funcao).keys());
  ufs.sort((a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  });
  products.sort((a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  });
  const nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target])),
    name => ({
      name,
      category: name.replace(/ .*/, "")
    }));
  nodes.map(d => Object.assign({}, d));
  const data = {
    nodes,
    links,
    units: "qtd"
  }

  const sankey = d3.sankey()
    .nodeId(d => d.name)
    .nodeAlign(d3.sankeyJustify)
    .nodeWidth(dimensions.nodeWidth)
    .nodePadding(6)
    .nodeSort(null)
    .extent([[1, 2], [dimensions.width - 1, dimensions.height - 5]]);

  const sankeyData = sankey(data);
  const colorMunicipio = d3.scaleOrdinal()
    .domain([
      "acesso total à rede",
      "alterar conect rede",
      "alterar config áudio",
      "API ref GooglePlay",
      "controlar flash",
      "controlar vibração",
      "encontrar contas no disp",
      "exec na inicialização",
      "executar na inicialização",
      "executar serviço 1º plano",
      "fazer fotos e vídeos",
      "fazer ligações",
      "gravar áudio",
      "impedir inatividade do tel",
      "ler armaz compart",
      "ler config serviço Google",
      "ler notif de distintivo",
      "local aprox 1º plano",
      "local em 2º plano",
      "local precisa 1º plano",
      "mod armaz compart",
      "outros",
      "parear Bluetooth",
      "receber dados da internet",
      "recon de atividade",
      "recuperar apps em exec",
      "sobrepor a outros apps",
      "status-id do tel",
      "usar hardware biometria",
      "usar hardware imp digital",
      "ver conexões de Wi-Fi",
      "ver conexões rede",
      "verif licença do Google Play"
    ]).range([
      "#f7faaf",
      "#9fe79f",
      "#5dc8ea",
      "#3d60d9",
      "#8553a4"
    ]);
  const colorFuncao = d3.scaleOrdinal()
    .domain([
      "Aglomerações",
      "Alô Saúde Floripa",
      "Atende em Casa",
      "AVISU",
      "Ceará App",
      "Colab",
      "Combate Coronavírus",
      "Coronavírus - SUS",
      "Covid Monitor",
      "CovidPR",
      "Dados do Bem",
      "Distanciamento Controlado RS",
      "Dycovid - Dynamic Contact Tracing",
      "e-Saúde SP",
      "ISUS",
      "KeyApp",
      "Mais Saúde Cidadão",
      "Meu Info Sáude",
      "Minha Saúde",
      "Monitora Covid-19",
      "Pronto Mobile",
      "Santa Isabel Contra o Coronavírus",
      "SASI",
      "Saúde Aparecida",
      "Saúde Digital MG - Covid-19",
      "Saúde Online PR",
      "Saúde Santo André",
      "Simot",
      "Telemedicina Paraná"
    ]).range([
      "#f73848",
      "#de4d4a",
      "#f57f4e",
      "#fed382",
      "#fee1d4",
      "#edd391",
      "#f5a034",
      "#edfdb6",
      "#ffffff"
    ]);

  const wrapper = d3.select("#chart-sankey")
    .append("svg")
    .attr("viewBox", "0 0 " + dimensions.wrapperWidth + " " + dimensions.wrapperHeight)
    .attr("width", "100%");

  const bounds = wrapper.append("g")
    .attr("transform", "translate(" + dimensions.margin.left + ", " + dimensions.margin.top + ")");

  bounds.append("g")
    .attr("stroke", "none")
    .selectAll("rect")
    .data(sankeyData.nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => (d.x0 > 10 && d.x0 < dimensions.width - 20) ? "none" : "rgba(255, 255, 255, 0.3)")
    .on("mouseover", () => {
      tooltip.style("display", null);
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    })
    .on("mousemove", (event, d) => {
      const xy = d3.pointer(event);
      tooltipBody.html(d.name);
      tooltip.attr("transform", `translate(${xy[0]}, ${xy[1]})`);
    });
    // .append("title")
    // .text(d => `${d.name}\n${d.value}`)

  const link = bounds.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", offOpacity)
    .selectAll("g")
    .data(sankeyData.links)
    .join("g");



  link.append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => {
      if (d.tipo === "app") {
        return colorMunicipio(d.regiao);
      } else {
        return colorFuncao(d.funcao);
      }
    })
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("id", d => "link" + d.index)
    .attr("class", d => {
      if (d.tipo === 'app') {
        return `sankey-link link-regiao link-${removeBlank(d.uf)} link-${removeBlank(d.funcao)}`;
      } else {
        return `sankey-link link-funcao link-${removeBlank(d.funcao)}`;
      }
    })
    .on("mouseover", (event, element) => {
      d3.select("#link" + element.index).attr("stroke-opacity", 1);
    })
    .on("mouseout", (event, element) => {
      const uf = d3.select("#filter-uf").property("value");
      const product = d3.select("#filter-product").property("value");
      if (checkFilterApplied(uf, product)) {
        if (element.uf === uf || element.funcao === product) {
          d3.select("#link" + element.index).attr("stroke-opacity", onOpacity);
        } else {
          d3.select("#link" + element.index).attr("stroke-opacity", offOpacity);
        }
      } else {
        d3.select("#link" + element.index).attr("stroke-opacity", offOpacity);
      }
    })
    ;



  // .on("mouseover", (event, element) => {
  //   d3.select("#link" + element.index).attr("stroke-opacity", 1);
  // })
  // .on("mouseout", (event, element) => {
  //   const uf = d3.select("#filter-uf").property("value");
  //   const product = d3.select("#filter-product").property("value");
  //   if (checkFilterApplied(uf, product)) {
  //     if (checkDoubleFilterApplied(uf, product)) {
  //       if (element.uf === uf && element.funcao === product) {
  //         d3.select("#link" + element.index).attr("stroke-opacity", onOpacity);
  //       } else {
  //         d3.select("#link" + element.index).attr("stroke-opacity", offOpacity);
  //       }
  //     } else if (element.uf === uf || element.funcao === product) {
  //       d3.select("#link" + element.index).attr("stroke-opacity", onOpacity);
  //     } else {
  //       d3.select("#link" + element.index).attr("stroke-opacity", offOpacity);
  //     }
  //   } else {
  //     d3.select("#link" + element.index).attr("stroke-opacity", onOpacity);
  //   }
  // });

  // add the rectangles for the nodes
   //bounds.append("rect")
       //.attr("height", "10")
       //.attr("width", "2")
      // .style("fill", "#fff");


  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`);

  bounds.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("text")
    .data(sankeyData.nodes)
    .join("text")
    .attr("x", d => d.x0 < dimensions.width / 2 ? d.x1 - dimensions.nodeWidth - 2 : d.x0 + dimensions.nodeWidth + 2)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < dimensions.width / 2 ? "end" : "start")
    .attr("fill", "#ffffff")
    .text(d => d.name);


  d3.select("#filter-uf")
    .selectAll("option")
    .data(ufs)
    .enter()
    .append("option")
    .attr("value", d => d)
    .html(d => d);

  d3.select("#filter-product")
    .selectAll("option")
    .data(products)
    .enter()
    .append("option")
    .attr("value", d => d)
    .html(d => d);

  d3.select("#filter-uf").on("change", (e) => {
    const uf = d3.select("#filter-uf").property("value");
    const product = d3.select("#filter-product").property("value");
    applyFilter(uf, product);
  });

  d3.select("#filter-product").on("change", (e) => {
    const uf = d3.select("#filter-uf").property("value");
    const product = d3.select("#filter-product").property("value");
    applyFilter(uf, product);
  });

  d3.select("#filter-clear").on("click", (e) => {
    d3.select("#filter-uf").property("value", "--");
    d3.select("#filter-product").property("value", "--");
    d3.selectAll(".sankey-link").attr("stroke-opacity", offOpacity);
  });

  const tooltip = bounds.append("foreignObject")
    .attr("class", "chart-tooltip")
    .attr("x", 10)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 100)
    .style("display", "none");
  const tooltipContent = tooltip.append("xhtml:div")
    .attr("class", "chart-tooltip-content");
  const tooltipBody = tooltipContent.append("div")
    .attr("class", "chart-tooltip-body")
    .style("background-color", "#cccccc")
    .style("border", "solid 1px #000000")
    .style("float", "left")
    .style("padding", "0.5rem");

  function removeBlank(p) {
    return p.replace(/ /g, "-");
  }

  function checkFilterApplied(uf, product) {
    return (uf !== '--' || product !== '--');
  }

  function checkDoubleFilterApplied(uf, product) {
    return (uf !== '--' && product !== '--');
  }

  function applyFilter(uf, product) {
    d3.selectAll(".sankey-link").attr("stroke-opacity", offOpacity);
    if (checkDoubleFilterApplied(uf, product)) {
      d3.selectAll(`.link-${removeBlank(uf)}`).filter(`.link-${removeBlank(product)}`).attr("stroke-opacity", onOpacity);
      d3.selectAll(`.link-funcao`).filter(`.link-${removeBlank(product)}`).attr("stroke-opacity", onOpacity);
    } else {
      d3.selectAll(`.link-${removeBlank(uf)}`).attr("stroke-opacity", onOpacity);
      d3.selectAll(`.link-${removeBlank(product)}`).attr("stroke-opacity", onOpacity);
    }
  }

}
draw();
