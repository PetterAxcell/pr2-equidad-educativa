const state = {
  subject: "matematicas",
  region: "Todos",
  country: "ESP",
};

const regionOptions = [
  { key: "Todos", label: "Todos" },
  { key: "Europa", label: "Europa" },
  { key: "América", label: "América" },
  { key: "Asia-Pacífico", label: "Asia-Pacífico" },
  { key: "Oriente Medio", label: "Oriente Medio" },
  { key: "España", label: "España" },
];

const tooltip = d3.select("#tooltip");
const colors = {
  training: "#0f766e",
  need: "#d1495b",
  digital: "#00798c",
  neutral: "#6b7280",
};

let story;
let countryByCode;

fetch("assets/data/story_data.json?v=20260605e")
  .then((response) => response.json())
  .then((data) => {
    story = data;
    countryByCode = new Map(story.countries.map((country) => [country.code, country]));
    initControls();
    renderAll();
    window.addEventListener("resize", debounce(renderAll, 180));
  });

function initControls() {
  d3.select("#subject-controls")
    .selectAll("button")
    .data(story.subjects)
    .join("button")
    .attr("type", "button")
    .attr("aria-pressed", (d) => String(d.key === state.subject))
    .text((d) => d.label)
    .on("click", (_, d) => {
      state.subject = d.key;
      updateControlStates();
      renderAll();
    });

  d3.select("#region-controls")
    .selectAll("button")
    .data(regionOptions)
    .join("button")
    .attr("type", "button")
    .attr("aria-pressed", (d) => String(d.key === state.region))
    .text((d) => d.label)
    .on("click", (_, d) => {
      state.region = d.key;
      updateControlStates();
      renderAll();
    });

  d3.select("#country-select")
    .selectAll("option")
    .data(story.countries)
    .join("option")
    .attr("value", (d) => d.code)
    .text((d) => d.name);

  d3.select("#country-select")
    .property("value", state.country)
    .on("change", (event) => {
      state.country = event.target.value;
      renderPerceptionChart();
    });
}

function updateControlStates() {
  d3.select("#subject-controls")
    .selectAll("button")
    .attr("aria-pressed", (d) => String(d.key === state.subject));

  d3.select("#region-controls")
    .selectAll("button")
    .attr("aria-pressed", (d) => String(d.key === state.region));
}

function renderAll() {
  renderKpis();
  renderAdoptionChart();
  renderTrainingChart();
  renderReadinessChart();
  renderPisaChart();
  renderPerceptionChart();
  renderSummaryTable();
}

function country(code) {
  return countryByCode.get(code);
}

function activeSubject() {
  return story.subjects.find((subject) => subject.key === state.subject);
}

function isFocused(d) {
  if (state.region === "Todos") return true;
  if (state.region === "España") return d.country_code === "ESP" || d.code === "ESP";
  return d.region === state.region;
}

function aiUseFor(code) {
  return story.ai_use.find((row) => row.country_code === code);
}

function trainingFor(code) {
  return story.ai_training.find((row) => row.country_code === code);
}

function pisaFor(code, subject, year = 2022) {
  return story.pisa_scores.find(
    (row) => row.country_code === code && row.subject === subject && row.year === year
  );
}

function digitalValuesFor(code) {
  return story.digital.filter((row) => row.country_code === code && row.value !== null);
}

function digitalAverage(code) {
  const values = digitalValuesFor(code).map((row) => row.value);
  return values.length ? d3.mean(values) : null;
}

function fmt(value, digits = 1) {
  if (typeof digits !== "number") digits = 1;
  if (value === null || value === undefined || Number.isNaN(value)) return "n/d";
  return d3.format(`.${digits}f`)(value).replace(".", ",");
}

function fmtPct(value, digits = 1) {
  if (typeof digits !== "number") digits = 1;
  return value === null || value === undefined ? "n/d" : `${fmt(value, digits)}%`;
}

function fmtPp(value, digits = 1) {
  if (typeof digits !== "number") digits = 1;
  if (value === null || value === undefined) return "n/d";
  return `${value > 0 ? "+" : ""}${fmt(value, digits)} pp`;
}

function fmtScore(value) {
  return value === null || value === undefined ? "n/d" : fmt(value, 1);
}

function showTooltip(event, html) {
  tooltip
    .html(html)
    .style("left", `${event.clientX}px`)
    .style("top", `${event.clientY}px`)
    .attr("aria-hidden", "false")
    .style("opacity", 1);
}

function showTooltipAtElement(element, html) {
  const rect = element.getBoundingClientRect();
  tooltip
    .html(html)
    .style("left", `${rect.left + rect.width / 2}px`)
    .style("top", `${rect.top}px`)
    .attr("aria-hidden", "false")
    .style("opacity", 1);
}

function hideTooltip() {
  tooltip.attr("aria-hidden", "true").style("opacity", 0);
}

function tooltipText(html) {
  return html
    .replace(/<br\s*\/?>/gi, ". ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function addTooltip(selection, htmlForDatum) {
  return selection
    .attr("tabindex", 0)
    .attr("focusable", "true")
    .attr("aria-label", (d) => tooltipText(htmlForDatum(d)))
    .on("mousemove", (event, d) => showTooltip(event, htmlForDatum(d)))
    .on("focus", function (_, d) {
      showTooltipAtElement(this, htmlForDatum(d));
    })
    .on("mouseleave", hideTooltip)
    .on("blur", hideTooltip);
}

function chartFrame(
  selector,
  height = 430,
  margin = { top: 28, right: 32, bottom: 52, left: 168 }
) {
  const root = d3.select(selector);
  root.selectAll("*").remove();
  const width = Math.max(root.node().clientWidth, 320);
  const svg = root.append("svg").attr("viewBox", `0 0 ${width} ${height}`);
  return {
    root,
    svg,
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
    plot: svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`),
  };
}

function renderAccessibleTable(selector, columns, rows) {
  const container = d3.select(selector);
  container.selectAll("*").remove();
  const table = container.append("table").attr("class", "compact-data-table");
  table
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(columns)
    .join("th")
    .text((column) => column.label);

  const tbody = table.append("tbody");
  const tr = tbody.selectAll("tr").data(rows).join("tr");
  columns.forEach((column) => {
    tr.append("td").text((row) => column.format(row[column.key], row));
  });
}

function setInsight(selector, text) {
  d3.select(selector).text(text);
}

function renderKpis() {
  const spainUse = aiUseFor("ESP")?.ai_use_pct;
  const talisAverage = story.metadata.ai_averages.talis_average;
  const top = story.ai_use.slice().sort((a, b) => b.ai_use_pct - a.ai_use_pct)[0];
  const spainTraining = trainingFor("ESP");

  const items = [
    {
      label: "España usa IA",
      value: fmtPct(spainUse),
      detail: "Docentes de secundaria, TALIS 2024",
    },
    {
      label: "Media TALIS",
      value: fmtPct(talisAverage),
      detail: "Promedio de 49 sistemas",
    },
    {
      label: "Mayor adopción",
      value: `${top.country} · ${fmtPct(top.ai_use_pct)}`,
      detail: "Uso docente declarado",
    },
    {
      label: "Brecha formativa España",
      value: fmtPp(spainTraining?.need_training_gap),
      detail: "Necesidad alta menos formación recibida",
    },
  ];

  d3.select("#kpi-strip")
    .selectAll(".kpi")
    .data(items)
    .join("div")
    .attr("class", "kpi")
    .html((d) => `<span>${d.label}</span><strong>${d.value}</strong><small>${d.detail}</small>`);
}

function renderAdoptionChart() {
  const rows = story.ai_use.slice().sort((a, b) => b.ai_use_pct - a.ai_use_pct);
  const spain = rows.find((row) => row.country_code === "ESP");
  const leaders = rows.slice(0, 2).map((row) => `${row.country} (${fmtPct(row.ai_use_pct)})`);
  setInsight(
    "#adoption-insight",
    `España se sitúa en ${fmtPct(spain.ai_use_pct)}, por debajo de la media TALIS (${fmtPct(
      story.metadata.ai_averages.talis_average
    )}). Los valores más altos aparecen en ${leaders.join(" y ")}.`
  );

  const frame = chartFrame("#adoption-chart", 470);
  const x = d3.scaleLinear().domain([0, 80]).range([0, frame.innerWidth]);
  const y = d3
    .scaleBand()
    .domain(rows.map((row) => row.country))
    .range([0, frame.innerHeight])
    .padding(0.22);

  frame.plot
    .append("g")
    .attr("class", "grid")
    .call(d3.axisBottom(x).ticks(5).tickSize(frame.innerHeight).tickFormat(""));

  frame.plot
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${frame.innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${d}%`));

  frame.plot.append("g").attr("class", "axis").call(d3.axisLeft(y));

  const average = story.metadata.ai_averages.talis_average;
  frame.plot
    .append("line")
    .attr("class", "average-line")
    .attr("x1", x(average))
    .attr("x2", x(average))
    .attr("y1", 0)
    .attr("y2", frame.innerHeight);

  frame.plot
    .append("text")
    .attr("class", "average-label")
    .attr("x", x(average) + 6)
    .attr("y", 12)
    .text("media TALIS");

  addTooltip(
    frame.plot
      .selectAll(".adoption-bar")
      .data(rows)
      .join("rect")
      .attr("class", "bar adoption-bar")
      .attr("x", 0)
      .attr("y", (d) => y(d.country))
      .attr("width", (d) => x(d.ai_use_pct))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => country(d.country_code).color)
      .attr("opacity", (d) => (isFocused(d) ? 1 : 0.32)),
    (d) =>
      `<strong>${d.country}</strong><br>Uso docente de IA: ${fmtPct(
        d.ai_use_pct
      )}<br>Error estándar: ${fmt(d.standard_error, 2)}`
  );

  frame.plot
    .selectAll(".bar-value")
    .data(rows)
    .join("text")
    .attr("class", "label")
    .attr("x", (d) => x(d.ai_use_pct) + 7)
    .attr("y", (d) => y(d.country) + y.bandwidth() / 2 + 4)
    .text((d) => fmtPct(d.ai_use_pct));

  renderAccessibleTable(
    "#adoption-data",
    [
      { key: "country", label: "País", format: (value) => value },
      { key: "region", label: "Región", format: (value) => value },
      { key: "ai_use_pct", label: "Uso de IA", format: fmtPct },
      { key: "standard_error", label: "Error estándar", format: (value) => fmt(value, 2) },
    ],
    rows
  );
}

function renderTrainingChart() {
  const rows = story.ai_training
    .slice()
    .sort((a, b) => b.need_training_gap - a.need_training_gap);
  const spain = rows.find((row) => row.country_code === "ESP");
  const unmet = rows[0];
  const ahead = rows[rows.length - 1];
  setInsight(
    "#training-insight",
    `En España, la formación recibida sobre IA alcanza el ${fmtPct(
      spain.training_ai_pct
    )}, mientras la necesidad alta declarada llega al ${fmtPct(
      spain.high_need_ai_pct
    )}. La mayor brecha pendiente aparece en ${unmet.country} (${fmtPp(
      unmet.need_training_gap
    )}); ${ahead.country} muestra el mayor colchón de formación.`
  );

  const frame = chartFrame("#training-chart", 470);
  const x = d3.scaleLinear().domain([0, 80]).range([0, frame.innerWidth]);
  const y = d3
    .scaleBand()
    .domain(rows.map((row) => row.country))
    .range([0, frame.innerHeight])
    .padding(0.28);

  frame.plot
    .append("g")
    .attr("class", "grid")
    .call(d3.axisBottom(x).ticks(5).tickSize(frame.innerHeight).tickFormat(""));

  frame.plot
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${frame.innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${d}%`));

  frame.plot.append("g").attr("class", "axis").call(d3.axisLeft(y));

  frame.plot
    .selectAll(".dual-line")
    .data(rows)
    .join("line")
    .attr("class", "dual-line")
    .attr("x1", (d) => x(d.training_ai_pct))
    .attr("x2", (d) => x(d.high_need_ai_pct))
    .attr("y1", (d) => y(d.country) + y.bandwidth() / 2)
    .attr("y2", (d) => y(d.country) + y.bandwidth() / 2)
    .attr("opacity", (d) => (isFocused(d) ? 1 : 0.28));

  addTooltip(
    frame.plot
      .selectAll(".training-dot")
      .data(rows)
      .join("circle")
      .attr("class", "metric-dot training-dot")
      .attr("cx", (d) => x(d.training_ai_pct))
      .attr("cy", (d) => y(d.country) + y.bandwidth() / 2)
      .attr("r", 6)
      .attr("fill", colors.training)
      .attr("opacity", (d) => (isFocused(d) ? 1 : 0.35)),
    (d) =>
      `<strong>${d.country}</strong><br>Formación sobre IA: ${fmtPct(
        d.training_ai_pct
      )}<br>Necesidad alta: ${fmtPct(d.high_need_ai_pct)}`
  );

  addTooltip(
    frame.plot
      .selectAll(".need-dot")
      .data(rows)
      .join("circle")
      .attr("class", "metric-dot need-dot")
      .attr("cx", (d) => x(d.high_need_ai_pct))
      .attr("cy", (d) => y(d.country) + y.bandwidth() / 2)
      .attr("r", 6)
      .attr("fill", colors.need)
      .attr("opacity", (d) => (isFocused(d) ? 1 : 0.35)),
    (d) =>
      `<strong>${d.country}</strong><br>Necesidad alta: ${fmtPct(
        d.high_need_ai_pct
      )}<br>Brecha necesidad-formación: ${fmtPp(d.need_training_gap)}`
  );

  addLegend(frame.svg, frame.margin.left, 14, [
    { label: "Formación recibida", color: colors.training },
    { label: "Necesidad alta", color: colors.need },
  ]);

  renderAccessibleTable(
    "#training-data",
    [
      { key: "country", label: "País", format: (value) => value },
      { key: "training_ai_pct", label: "Formación IA", format: fmtPct },
      { key: "high_need_ai_pct", label: "Necesidad alta", format: fmtPct },
      { key: "need_training_gap", label: "Brecha", format: fmtPp },
    ],
    rows
  );
}

function readinessRows() {
  return story.countries
    .map((item) => {
      const use = aiUseFor(item.code);
      const digital = digitalAverage(item.code);
      if (!use || digital === null) return null;
      return {
        ...item,
        country_code: item.code,
        ai_use_pct: use.ai_use_pct,
        digital_readiness: digital,
        internet: story.digital.find(
          (row) => row.country_code === item.code && row.indicator === "internet_secundaria"
        )?.value,
        computers: story.digital.find(
          (row) => row.country_code === item.code && row.indicator === "ordenadores_secundaria"
        )?.value,
      };
    })
    .filter(Boolean);
}

function renderReadinessChart() {
  const rows = readinessRows();
  const lowAdoptionHighDigital = rows
    .filter((row) => row.digital_readiness >= 95)
    .sort((a, b) => a.ai_use_pct - b.ai_use_pct)[0];
  const lowDigital = rows.slice().sort((a, b) => a.digital_readiness - b.digital_readiness)[0];
  setInsight(
    "#readiness-insight",
    `${lowAdoptionHighDigital.name} muestra que una infraestructura casi universal no implica adopción alta de IA (${fmtPct(
      lowAdoptionHighDigital.ai_use_pct
    )}). ${lowDigital.name} tiene la menor preparación digital del grupo (${fmtPct(
      lowDigital.digital_readiness
    )}) y aun así supera la media TALIS en uso de IA.`
  );

  const frame = chartFrame("#readiness-chart", 430, {
    top: 28,
    right: 96,
    bottom: 58,
    left: 64,
  });
  const x = d3.scaleLinear().domain([50, 101]).range([0, frame.innerWidth]);
  const y = d3.scaleLinear().domain([0, 82]).range([frame.innerHeight, 0]);

  drawScatterAxes(frame, x, y, "Preparación digital escolar (%)", "Uso docente de IA (%)");

  addTooltip(
    frame.plot
      .selectAll(".readiness-point")
      .data(rows)
      .join("circle")
      .attr("class", "scatter-point")
      .attr("cx", (d) => x(d.digital_readiness))
      .attr("cy", (d) => y(d.ai_use_pct))
      .attr("r", (d) => (d.code === "ESP" ? 9 : 7))
      .attr("fill", (d) => d.color)
      .attr("opacity", (d) => (isFocused(d) ? 1 : 0.32)),
    (d) =>
      `<strong>${d.name}</strong><br>Preparación digital: ${fmtPct(
        d.digital_readiness
      )}<br>Uso docente de IA: ${fmtPct(d.ai_use_pct)}<br>Internet: ${fmtPct(
        d.internet
      )}<br>Ordenadores: ${fmtPct(d.computers)}`
  );

  drawScatterLabels(frame, rows, x, y, "digital_readiness", "ai_use_pct");

  renderAccessibleTable(
    "#readiness-data",
    [
      { key: "name", label: "País", format: (value) => value },
      { key: "digital_readiness", label: "Preparación digital", format: fmtPct },
      { key: "internet", label: "Internet", format: fmtPct },
      { key: "computers", label: "Ordenadores", format: fmtPct },
      { key: "ai_use_pct", label: "Uso IA", format: fmtPct },
    ],
    rows
  );
}

function renderPisaChart() {
  const subject = activeSubject();
  d3.select("#pisa-title").text(`IA y rendimiento en ${subject.label.toLowerCase()} · PISA 2022`);
  const rows = story.countries
    .map((item) => {
      const use = aiUseFor(item.code);
      const pisa = pisaFor(item.code, state.subject);
      if (!use || !pisa || pisa.score === null) return null;
      return {
        ...item,
        country_code: item.code,
        ai_use_pct: use.ai_use_pct,
        score: pisa.score,
      };
    })
    .filter(Boolean);

  const singapore = rows.find((row) => row.code === "SGP");
  const uae = rows.find((row) => row.code === "ARE");
  const japan = rows.find((row) => row.code === "JPN");
  setInsight(
    "#pisa-insight",
    `La nube no sostiene una lectura causal simple: ${singapore.name} combina alta adopción y alto rendimiento, ${uae.name} tiene una adopción similar con menor puntuación, y ${japan.name} obtiene alto rendimiento con poco uso docente de IA.`
  );

  const frame = chartFrame("#pisa-chart", 430, {
    top: 28,
    right: 96,
    bottom: 58,
    left: 64,
  });
  const x = d3.scaleLinear().domain([0, 80]).range([0, frame.innerWidth]);
  const yExtent = d3.extent(rows, (d) => d.score);
  const y = d3
    .scaleLinear()
    .domain([Math.floor(yExtent[0] - 18), Math.ceil(yExtent[1] + 18)])
    .nice()
    .range([frame.innerHeight, 0]);

  drawScatterAxes(frame, x, y, "Uso docente de IA (%)", `PISA ${subject.label} 2022`);

  addTooltip(
    frame.plot
      .selectAll(".pisa-point")
      .data(rows)
      .join("circle")
      .attr("class", "scatter-point")
      .attr("cx", (d) => x(d.ai_use_pct))
      .attr("cy", (d) => y(d.score))
      .attr("r", (d) => (d.code === "ESP" ? 9 : 7))
      .attr("fill", (d) => d.color)
      .attr("opacity", (d) => (isFocused(d) ? 1 : 0.32)),
    (d) =>
      `<strong>${d.name}</strong><br>Uso docente de IA: ${fmtPct(
        d.ai_use_pct
      )}<br>${subject.label}: ${fmtScore(d.score)} puntos`
  );

  drawScatterLabels(frame, rows, x, y, "ai_use_pct", "score");

  renderAccessibleTable(
    "#pisa-data",
    [
      { key: "name", label: "País", format: (value) => value },
      { key: "ai_use_pct", label: "Uso IA", format: fmtPct },
      { key: "score", label: subject.label, format: fmtScore },
    ],
    rows
  );
}

function drawScatterAxes(frame, x, y, xTitle, yTitle) {
  frame.plot
    .append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).ticks(5).tickSize(-frame.innerWidth).tickFormat(""));

  frame.plot
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${frame.innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${d}%`));

  frame.plot.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5));

  frame.plot
    .append("text")
    .attr("x", frame.innerWidth / 2)
    .attr("y", frame.innerHeight + 46)
    .attr("text-anchor", "middle")
    .attr("class", "axis-title")
    .text(xTitle);

  frame.plot
    .append("text")
    .attr("x", -frame.innerHeight / 2)
    .attr("y", -46)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("class", "axis-title")
    .text(yTitle);
}

function drawScatterLabels(frame, rows, x, y, xKey, yKey) {
  const pisaOffsets = {
    ESP: { dx: 10, dy: -10, anchor: "start" },
    FRA: { dx: 10, dy: 16, anchor: "start" },
    JPN: { dx: 10, dy: -8, anchor: "start" },
    SGP: { dx: 10, dy: -8, anchor: "start" },
    ARE: { dx: 10, dy: 12, anchor: "start" },
    BRA: { dx: 10, dy: 14, anchor: "start" },
    COL: { dx: 10, dy: 18, anchor: "start" },
    CHL: { dx: 10, dy: -8, anchor: "start" },
    AUS: { dx: 10, dy: -10, anchor: "start" },
    USA: { dx: 10, dy: -8, anchor: "start" },
    KOR: { dx: 10, dy: 14, anchor: "start" },
    EST: { dx: 10, dy: 14, anchor: "start" },
    FIN: { dx: 10, dy: -8, anchor: "start" },
    PRT: { dx: 10, dy: 16, anchor: "start" },
  };
  const readinessOffsets = {
    SGP: { dx: 10, dy: -8, anchor: "start" },
    ARE: { dx: 10, dy: 8, anchor: "start" },
    AUS: { dx: 10, dy: 24, anchor: "start" },
    CHL: { dx: 10, dy: -8, anchor: "start" },
    BRA: { dx: 10, dy: 12, anchor: "start" },
    COL: { dx: 10, dy: 18, anchor: "start" },
    USA: { dx: 10, dy: -10, anchor: "start" },
    KOR: { dx: 10, dy: 8, anchor: "start" },
    ESP: { dx: 10, dy: 22, anchor: "start" },
    EST: { dx: 10, dy: 36, anchor: "start" },
    FIN: { dx: 10, dy: 50, anchor: "start" },
    PRT: { dx: 10, dy: 64, anchor: "start" },
    JPN: { dx: 10, dy: 2, anchor: "start" },
    FRA: { dx: 10, dy: 16, anchor: "start" },
  };
  const offsets = xKey === "digital_readiness" ? readinessOffsets : pisaOffsets;

  const labelRows =
    xKey === "digital_readiness"
      ? rows.filter((d) =>
          ["SGP", "ARE", "AUS", "BRA", "CHL", "COL", "USA", "ESP", "JPN", "FRA"].includes(
            d.code
          )
        )
      : rows;

  frame.plot
    .selectAll(".scatter-label")
    .data(labelRows)
    .join("text")
    .attr("class", "label scatter-label")
    .attr("x", (d) => x(d[xKey]) + (offsets[d.code]?.dx ?? 10))
    .attr("y", (d) =>
      Math.max(
        10,
        Math.min(frame.innerHeight - 4, y(d[yKey]) + (offsets[d.code]?.dy ?? 0))
      )
    )
    .attr("text-anchor", (d) => offsets[d.code]?.anchor ?? "start")
    .attr("opacity", (d) => (isFocused(d) ? 1 : 0.36))
    .text((d) => d.name);
}

function renderPerceptionChart() {
  const selected = country(state.country);
  const rows = story.ai_perceptions.filter((row) => row.country_code === state.country);
  const groupConfig = [
    { key: "practice", title: "Usos actuales", color: "#00798c" },
    { key: "benefit", title: "Beneficios percibidos", color: "#0f766e" },
    { key: "challenge", title: "Riesgos percibidos", color: "#d1495b" },
    { key: "barrier", title: "Barreras", color: "#b45309" },
  ];

  d3.select("#perception-title").text(`Percepciones sobre la IA · ${selected.name}`);
  const topPractice = topMetric(rows, "practice");
  const topChallenge = topMetric(rows, "challenge");
  const topBarrier = topMetric(rows, "barrier");
  setInsight(
    "#perception-insight",
    `En ${selected.name}, el uso más común es "${topPractice.metric_label}" (${fmtPct(
      topPractice.value
    )}). El riesgo más compartido es "${topChallenge.metric_label}" (${fmtPct(
      topChallenge.value
    )}) y la principal barrera es "${topBarrier.metric_label}" (${fmtPct(topBarrier.value)}).`
  );

  const root = d3.select("#perception-chart");
  root.selectAll("*").remove();
  const groups = root
    .selectAll(".metric-group")
    .data(groupConfig)
    .join("section")
    .attr("class", "metric-group");

  groups.append("h4").text((group) => group.title);

  const metricRows = groups
    .selectAll(".metric-row")
    .data((group) =>
      rows
        .filter((row) => row.metric_type === group.key && row.value !== null)
        .sort((a, b) => b.value - a.value)
        .map((row) => ({ ...row, color: group.color }))
    )
    .join("div")
    .attr("class", "metric-row");

  metricRows.append("span").attr("class", "metric-label").text((d) => d.metric_label);

  const track = metricRows.append("div").attr("class", "metric-track");
  track
    .append("span")
    .attr("class", "metric-fill")
    .style("width", (d) => `${Math.max(0, Math.min(100, d.value))}%`)
    .style("background", (d) => d.color);
  track.append("strong").text((d) => fmtPct(d.value));

  renderAccessibleTable(
    "#perception-data",
    [
      { key: "metric_type", label: "Tipo", format: labelMetricType },
      { key: "metric_label", label: "Indicador", format: (value) => value },
      { key: "value", label: "Valor", format: fmtPct },
    ],
    rows
  );
}

function topMetric(rows, type) {
  return rows
    .filter((row) => row.metric_type === type && row.value !== null)
    .sort((a, b) => b.value - a.value)[0];
}

function labelMetricType(value) {
  return (
    {
      practice: "Uso",
      benefit: "Beneficio",
      challenge: "Riesgo",
      barrier: "Barrera",
    }[value] || value
  );
}

function renderSummaryTable() {
  const subject = activeSubject();
  d3.select("#summary-subtitle").text(
    `Valores principales por país o sistema. PISA seleccionado: ${subject.label}.`
  );
  const rows = story.countries
    .map((item) => {
      const use = aiUseFor(item.code);
      const training = trainingFor(item.code);
      const pisa = pisaFor(item.code, state.subject);
      return {
        ...item,
        country_code: item.code,
        ai_use_pct: use?.ai_use_pct,
        training_ai_pct: training?.training_ai_pct,
        high_need_ai_pct: training?.high_need_ai_pct,
        digital_readiness: digitalAverage(item.code),
        pisa_score: pisa?.score,
      };
    })
    .sort((a, b) => (b.ai_use_pct ?? -Infinity) - (a.ai_use_pct ?? -Infinity));

  const spain = rows.find((row) => row.code === "ESP");
  setInsight(
    "#summary-insight",
    `España combina ${fmtPct(spain.ai_use_pct)} de uso docente de IA, ${fmtPct(
      spain.training_ai_pct
    )} de formación específica, ${fmtPct(
      spain.digital_readiness
    )} de preparación digital escolar y ${fmtScore(spain.pisa_score)} puntos en ${
      subject.label
    }.`
  );

  const table = d3.select("#summary-table");
  table.selectAll("*").remove();

  table
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data([
      "País",
      "Región",
      "Uso IA",
      "Formación IA",
      "Necesidad alta",
      "Preparación digital",
      `PISA ${subject.label}`,
    ])
    .join("th")
    .text((d) => d);

  const tbody = table.append("tbody");
  const tr = tbody
    .selectAll("tr")
    .data(rows)
    .join("tr")
    .attr("class", (d) => (d.code === "ESP" ? "summary-focus" : null));

  tr.append("td").html(
    (d) =>
      `<span class="country-pill"><span class="country-dot" style="background:${d.color}"></span>${d.name}</span>`
  );
  tr.append("td").text((d) => d.region);
  tr.append("td").text((d) => fmtPct(d.ai_use_pct));
  tr.append("td").text((d) => fmtPct(d.training_ai_pct));
  tr.append("td").text((d) => fmtPct(d.high_need_ai_pct));
  tr.append("td").text((d) => fmtPct(d.digital_readiness));
  tr.append("td").text((d) => fmtScore(d.pisa_score));
}

function addLegend(svg, x, y, items) {
  const legend = svg.append("g").attr("class", "legend").attr("transform", `translate(${x},${y})`);
  const groups = legend
    .selectAll("g")
    .data(items)
    .join("g")
    .attr("transform", (_, index) => `translate(${index * 170},0)`);

  groups.append("circle").attr("r", 5).attr("cx", 5).attr("cy", 5).attr("fill", (d) => d.color);
  groups.append("text").attr("x", 16).attr("y", 9).text((d) => d.label);
}

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(null, args), wait);
  };
}
