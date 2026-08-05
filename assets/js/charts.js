/* ============================================================================
   charts.js — графики на чистом SVG
   ----------------------------------------------------------------------------
   Никаких внешних библиотек: на машине нет Node.js и сборщика, а GitHub Pages
   отдаёт статику. Всё рисуется руками.

   Спецификации марок взяты из методички dataviz и не обсуждаются:
     · столбец   — не толще 24px, скругление 4px ТОЛЬКО на конце-значении,
                   у базовой линии угол прямой;
     · линия     — 2px, круглые стыки и концы;
     · точка     — не меньше 8px в диаметре, кольцо 2px цветом поверхности;
     · заливка области — тон серии на ~10% непрозрачности;
     · сетка и оси — волосяные (1px), СПЛОШНЫЕ, никогда не пунктир;
     · зазор 2px цветом поверхности между соседними и стопочными марками;
     · подписи значений — текстовыми токенами, никогда цветом серии;
     · подписи выборочные — не число над каждой точкой.

   Цвета передаются как var(--series-N): SVG понимает CSS-переменные, поэтому
   переключение темы перекрашивает графики само, без перерисовки.
   ========================================================================= */

(function (global) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  var SERIES_VARS = [
    "var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)",
    "var(--series-5)", "var(--series-6)", "var(--series-7)", "var(--series-8)"
  ];

  /* ---- Мелкие помощники -------------------------------------------------- */

  function svgEl(name, attrs) {
    var node = document.createElementNS(NS, name);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) {
          node.setAttribute(k, String(attrs[k]));
        }
      }
    }
    return node;
  }

  function htmlEl(name, className, text) {
    var node = document.createElement(name);
    if (className) node.className = className;
    /* textContent, а не innerHTML: названия товаров и витрин приходят из
       API Amazon и являются недоверенными данными. */
    if (text != null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function seriesColor(index, explicit) {
    if (explicit) return explicit;
    /* Цвета назначаются по фиксированному порядку слотов и НЕ перебираются
       по кругу: девятая серия должна складываться в «Прочее», а не получать
       выдуманный тон. */
    return SERIES_VARS[Math.min(index, SERIES_VARS.length - 1)];
  }

  /* Круглые числа для оси: 0 / 500 / 1 000 / 2 000, а не 1 337 */
  function niceTicks(min, max, target) {
    if (!isFinite(min) || !isFinite(max)) return [0];
    if (min === max) {
      if (min === 0) return [0, 1];
      min = Math.min(0, min);
      max = Math.max(0, max);
    }
    var span = max - min;
    if (span <= 0) span = Math.abs(max) || 1;
    var raw = span / Math.max(1, target || 4);
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / mag;
    var step = mag * (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1);
    var start = Math.floor(min / step) * step;
    var end = Math.ceil(max / step) * step;
    var out = [];
    for (var v = start; v <= end + step * 0.5; v += step) {
      out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    }
    return out;
  }

  /* Путь столбца: скругление только на конце-значения.
     dir: 'up' | 'right' — куда растёт столбец от базовой линии. */
  function barPath(x, y, w, h, r, dir) {
    if (w <= 0 || h <= 0) return "";
    var rad = Math.max(0, Math.min(r, dir === "right" ? w : h, (dir === "right" ? h : w) / 2));
    if (rad <= 0.5) return "M" + x + "," + y + "h" + w + "v" + h + "h" + -w + "Z";

    if (dir === "right") {
      /* Растёт вправо: скругляем правые углы */
      return (
        "M" + x + "," + y +
        "h" + (w - rad) +
        "a" + rad + "," + rad + " 0 0 1 " + rad + "," + rad +
        "v" + (h - rad * 2) +
        "a" + rad + "," + rad + " 0 0 1 " + -rad + "," + rad +
        "h" + -(w - rad) + "Z"
      );
    }
    /* Растёт вверх: скругляем верхние углы */
    return (
      "M" + x + "," + (y + h) +
      "v" + -(h - rad) +
      "a" + rad + "," + rad + " 0 0 1 " + rad + "," + -rad +
      "h" + (w - rad * 2) +
      "a" + rad + "," + rad + " 0 0 1 " + rad + "," + rad +
      "v" + (h - rad) + "Z"
    );
  }

  /* ---- Общая подсказка --------------------------------------------------- */

  var tipNode = null;

  function tooltip() {
    if (!tipNode) {
      tipNode = htmlEl("div", "tooltip");
      tipNode.setAttribute("role", "status");
      tipNode.hidden = true;
      document.body.appendChild(tipNode);
    }
    return tipNode;
  }

  /* rows: [{name, value, color}] — значение крупным, имя серии вторичным */
  function showTip(title, rows, clientX, clientY) {
    var node = tooltip();
    clear(node);
    if (title) node.appendChild(htmlEl("div", "tooltip__title", title));
    rows.forEach(function (row) {
      var line = htmlEl("div", "tooltip__row");
      if (row.color) {
        var key = htmlEl("span", "tooltip__key");
        key.style.background = row.color;
        line.appendChild(key);
      }
      line.appendChild(htmlEl("span", "tooltip__name", row.name));
      line.appendChild(htmlEl("span", "tooltip__value", row.value));
      node.appendChild(line);
    });
    node.hidden = false;

    /* Держим подсказку в пределах окна */
    var pad = 12;
    var rect = node.getBoundingClientRect();
    var x = clientX + 16;
    var y = clientY + 16;
    if (x + rect.width + pad > global.innerWidth) x = clientX - rect.width - 16;
    if (y + rect.height + pad > global.innerHeight) y = clientY - rect.height - 16;
    node.style.left = Math.max(pad, x) + "px";
    node.style.top = Math.max(pad, y) + "px";
  }

  function hideTip() {
    if (tipNode) tipNode.hidden = true;
  }

  document.addEventListener("scroll", hideTip, true);

  /* ---- Пересборка при изменении ширины -----------------------------------
     Высота от перерисовки меняется, ширина — нет, поэтому следим только за
     шириной: иначе ResizeObserver зациклится. */

  var widths = new WeakMap();
  var observer = null;

  function observe(container) {
    if (typeof global.ResizeObserver !== "function") return;
    if (!observer) {
      observer = new global.ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          var node = entry.target;
          var w = Math.round(node.clientWidth);
          if (widths.get(node) === w) return;
          widths.set(node, w);
          if (typeof node.__render === "function") node.__render();
        });
      });
    }
    observer.observe(container);
  }

  function mount(container, render) {
    container.__render = render;
    widths.set(container, Math.round(container.clientWidth));
    render();
    observe(container);
  }

  function widthOf(container, fallback) {
    var w = container.clientWidth;
    return w > 40 ? w : fallback || 640;
  }

  /* ========================================================================
     Спарклайн — 12 точек в плитке показателя. Без осей, без подсказки:
     это украшение тренда, значение читается из самой плитки.
     ===================================================================== */

  function sparkline(container, opts) {
    mount(container, function () {
      var points = opts.points || [];
      var w = widthOf(container, 120);
      var h = opts.height || 34;
      clear(container);
      if (points.length < 2) return;

      var pad = 3;
      var min = Math.min.apply(null, points);
      var max = Math.max.apply(null, points);
      var span = max - min || 1;
      var stepX = (w - pad * 2) / (points.length - 1);

      var d = points
        .map(function (v, i) {
          var x = pad + i * stepX;
          var y = pad + (h - pad * 2) * (1 - (v - min) / span);
          return (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
        })
        .join(" ");

      var svg = svgEl("svg", {
        width: w, height: h, viewBox: "0 0 " + w + " " + h,
        role: "presentation", "aria-hidden": "true", focusable: "false"
      });
      /* Линия тренда приглушена, последняя точка — акцентом */
      svg.appendChild(svgEl("path", {
        d: d, class: "line-mark", stroke: opts.color || "var(--series-other)"
      }));
      var lastX = pad + (points.length - 1) * stepX;
      var lastY = pad + (h - pad * 2) * (1 - (points[points.length - 1] - min) / span);
      svg.appendChild(svgEl("circle", {
        cx: lastX.toFixed(2), cy: lastY.toFixed(2), r: 4,
        fill: opts.accent || "var(--series-1)", class: "dot-mark"
      }));
      container.appendChild(svg);
    });
  }

  /* ========================================================================
     Линейный график
     Перекрестие ищет X: вертикальная волосяная линия липнет к ближайшей дате,
     подсказка показывает ВСЕ серии сразу — целиться в конкретную линию не надо.
     ===================================================================== */

  function line(container, opts) {
    var series = opts.series || [];
    var fmtY = opts.formatY || function (v) { return String(v); };
    var fmtX = opts.formatX || function (v) { return String(v); };
    var active = null; // индекс подсвеченной точки

    mount(container, function () {
      clear(container);
      var labels = opts.labels || [];
      if (!series.length || !labels.length) return;

      var w = widthOf(container, 640);
      var plotH = opts.height || 240;

      /* Шкала Y всегда включает ноль: линия выручки без нуля врёт */
      var all = [];
      series.forEach(function (s) {
        s.values.forEach(function (v) { if (typeof v === "number") all.push(v); });
      });
      if (!all.length) return;
      var dataMin = Math.min.apply(null, all);
      var dataMax = Math.max.apply(null, all);
      var ticks = niceTicks(Math.min(0, dataMin), dataMax, 4);
      var yMin = ticks[0];
      var yMax = ticks[ticks.length - 1];
      var ySpan = yMax - yMin || 1;

      /* Левое поле подгоняется под самую длинную подпись оси, а не берётся
         константой: «6 тыс. €» и «140» требуют разного места, и на узком
         экране фиксированные 52px выталкивали подпись за край. */
      var widestTick = 0;
      ticks.forEach(function (t) {
        widestTick = Math.max(widestTick, String(fmtY(t, true)).length);
      });
      var m = {
        top: 12,
        right: 16,
        bottom: 26,
        left: Math.min(84, Math.max(28, widestTick * 6.2 + 12))
      };
      var innerW = Math.max(10, w - m.left - m.right);
      var innerH = plotH;
      var h = innerH + m.top + m.bottom;

      function xAt(i) {
        return labels.length === 1
          ? m.left + innerW / 2
          : m.left + (innerW * i) / (labels.length - 1);
      }
      function yAt(v) {
        return m.top + innerH * (1 - (v - yMin) / ySpan);
      }

      var svg = svgEl("svg", {
        width: w, height: h, viewBox: "0 0 " + w + " " + h,
        role: "img", "aria-label": opts.ariaLabel || "", focusable: "false"
      });

      /* --- Сетка: только горизонтальная, волосяная, сплошная --- */
      ticks.forEach(function (t) {
        var y = yAt(t);
        svg.appendChild(svgEl("line", {
          class: "grid-line", x1: m.left, x2: m.left + innerW, y1: y.toFixed(1), y2: y.toFixed(1)
        }));
        var text = svgEl("text", {
          class: "tick-text", x: m.left - 8, y: y.toFixed(1),
          "text-anchor": "end", "dominant-baseline": "middle"
        });
        text.textContent = fmtY(t, true);
        svg.appendChild(text);
      });

      /* --- Подписи оси X: столько, сколько влезает без наложения --- */
      var maxLabels = Math.max(2, Math.floor(innerW / 78));
      var stride = Math.ceil(labels.length / maxLabels);
      labels.forEach(function (lab, i) {
        if (i % stride !== 0 && i !== labels.length - 1) return;
        if (i !== labels.length - 1 && labels.length - 1 - i < stride * 0.6) return;
        var text = svgEl("text", {
          class: "tick-text", x: xAt(i).toFixed(1), y: m.top + innerH + 16,
          "text-anchor": i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"
        });
        text.textContent = fmtX(lab);
        svg.appendChild(text);
      });

      /* --- Базовая линия --- */
      svg.appendChild(svgEl("line", {
        class: "axis-line", x1: m.left, x2: m.left + innerW,
        y1: yAt(Math.max(yMin, 0)).toFixed(1), y2: yAt(Math.max(yMin, 0)).toFixed(1)
      }));

      /* --- Сами серии --- */
      series.forEach(function (s, si) {
        var color = seriesColor(si, s.color);
        var pts = s.values.map(function (v, i) {
          return typeof v === "number" ? [xAt(i), yAt(v)] : null;
        }).filter(Boolean);
        if (!pts.length) return;

        /* Заливка области — только когда серия одна; на нескольких сериях
           перекрытие заливок нечитаемо */
        if (series.length === 1 && opts.area !== false) {
          var areaD = pts.map(function (p, i) {
            return (i === 0 ? "M" : "L") + p[0].toFixed(2) + "," + p[1].toFixed(2);
          }).join(" ") +
            " L" + pts[pts.length - 1][0].toFixed(2) + "," + yAt(Math.max(yMin, 0)).toFixed(2) +
            " L" + pts[0][0].toFixed(2) + "," + yAt(Math.max(yMin, 0)).toFixed(2) + " Z";
          svg.appendChild(svgEl("path", { d: areaD, fill: color, class: "area-fill" }));
        }

        svg.appendChild(svgEl("path", {
          d: pts.map(function (p, i) {
            return (i === 0 ? "M" : "L") + p[0].toFixed(2) + "," + p[1].toFixed(2);
          }).join(" "),
          class: "line-mark",
          stroke: color
        }));

        /* Точка на конце + выборочная прямая подпись последнего значения.
           Число над каждой точкой — это хаос, его не читают. */
        var last = pts[pts.length - 1];
        svg.appendChild(svgEl("circle", {
          cx: last[0].toFixed(2), cy: last[1].toFixed(2), r: 4,
          fill: color, class: "dot-mark"
        }));
      });

      /* --- Слой наведения: перекрестие + точки на всех сериях --- */
      var hover = svgEl("g", { "pointer-events": "none" });
      var cross = svgEl("line", {
        class: "crosshair", y1: m.top, y2: m.top + innerH, x1: 0, x2: 0
      });
      cross.style.display = "none";
      hover.appendChild(cross);
      var hoverDots = series.map(function (s, si) {
        var dot = svgEl("circle", {
          r: 4.5, fill: seriesColor(si, s.color), class: "dot-mark"
        });
        dot.style.display = "none";
        hover.appendChild(dot);
        return dot;
      });
      svg.appendChild(hover);

      function nearestIndex(clientX) {
        var box = svg.getBoundingClientRect();
        var rel = clientX - box.left - m.left;
        var ratio = innerW > 0 ? rel / innerW : 0;
        var idx = Math.round(ratio * (labels.length - 1));
        return Math.max(0, Math.min(labels.length - 1, idx));
      }

      function paint(idx, clientX, clientY) {
        active = idx;
        var x = xAt(idx);
        cross.setAttribute("x1", x.toFixed(2));
        cross.setAttribute("x2", x.toFixed(2));
        cross.style.display = "";
        var rows = [];
        series.forEach(function (s, si) {
          var v = s.values[idx];
          var dot = hoverDots[si];
          if (typeof v !== "number") { dot.style.display = "none"; return; }
          dot.setAttribute("cx", x.toFixed(2));
          dot.setAttribute("cy", yAt(v).toFixed(2));
          dot.style.display = "";
          rows.push({ name: s.name, value: fmtY(v), color: seriesColor(si, s.color) });
        });
        var box = svg.getBoundingClientRect();
        showTip(
          fmtX(labels[idx], true),
          rows,
          clientX != null ? clientX : box.left + x,
          clientY != null ? clientY : box.top + m.top + innerH / 2
        );
      }

      function reset() {
        active = null;
        cross.style.display = "none";
        hoverDots.forEach(function (d) { d.style.display = "none"; });
        hideTip();
      }

      var capture = svgEl("rect", {
        x: m.left, y: m.top, width: innerW, height: innerH, class: "hit-area"
      });
      capture.addEventListener("pointermove", function (e) {
        paint(nearestIndex(e.clientX), e.clientX, e.clientY);
      });
      capture.addEventListener("pointerleave", reset);
      svg.appendChild(capture);

      /* Клавиатура даёт ровно то же, что наведение мышью */
      svg.setAttribute("tabindex", "0");
      svg.addEventListener("focus", function () {
        paint(active == null ? labels.length - 1 : active);
      });
      svg.addEventListener("blur", reset);
      svg.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var next = (active == null ? labels.length - 1 : active) +
            (e.key === "ArrowRight" ? 1 : -1);
          paint(Math.max(0, Math.min(labels.length - 1, next)));
        } else if (e.key === "Escape") {
          reset();
        }
      });

      container.appendChild(svg);
    });
  }

  /* ========================================================================
     Горизонтальные столбцы — для длинных названий товаров.
     Одна серия ⇒ ОДИН цвет на все столбцы. Красить «чем больше, тем темнее»
     нельзя: это второй раз кодирует ту же длину и сжигает канал цвета.
     ===================================================================== */

  function barsH(container, opts) {
    var items = opts.items || [];
    var fmtV = opts.formatValue || function (v) { return String(v); };

    mount(container, function () {
      clear(container);
      if (!items.length) return;

      var w = widthOf(container, 640);
      var rowH = 30;             // шаг ряда
      var barThickness = 18;     // не толще 24px по спецификации
      var m = { top: 4, right: 8, bottom: 4, left: Math.min(190, Math.max(110, w * 0.32)) };
      var innerW = Math.max(40, w - m.left - m.right);
      var h = items.length * rowH + m.top + m.bottom;

      var max = Math.max.apply(null, items.map(function (d) { return d.value || 0; }));
      if (!(max > 0)) max = 1;

      /* Место под подпись значения справа от столбца */
      var valuePad = 8;
      var reserve = 0;
      items.forEach(function (d) {
        reserve = Math.max(reserve, fmtV(d.value).length * 6.6);
      });
      var barMax = Math.max(20, innerW - reserve - valuePad);

      var svg = svgEl("svg", {
        width: w, height: h, viewBox: "0 0 " + w + " " + h,
        role: "img", "aria-label": opts.ariaLabel || "", focusable: "false"
      });

      var color = opts.color || "var(--series-1)";
      var bars = [];

      items.forEach(function (d, i) {
        var y = m.top + i * rowH + (rowH - barThickness) / 2;
        var len = Math.max(2, (d.value / max) * barMax);

        var group = svgEl("g", {});

        /* Название слева, текстовым токеном. Обрезается по фактически
           доступному месту, а не по фиксированному числу символов:
           на узком экране длинное имя уезжало за левый край графика. */
        var label = svgEl("text", {
          class: "label-text", x: m.left - 10, y: y + barThickness / 2,
          "text-anchor": "end", "dominant-baseline": "middle"
        });
        var maxChars = Math.max(6, Math.floor((m.left - 14) / 6.1));
        label.textContent = d.label.length > maxChars
          ? d.label.slice(0, maxChars - 1) + "…"
          : d.label;
        var full = svgEl("title");
        full.textContent = d.label;   // полное имя во всплывающем title
        label.appendChild(full);
        group.appendChild(label);

        var bar = svgEl("path", {
          d: barPath(m.left, y, len, barThickness, 4, "right"),
          fill: color, class: "bar-mark"
        });
        group.appendChild(bar);
        bars.push(bar);

        /* Значение у кончика столбца, снаружи — внутрь не кладём,
           там оно обрежется на коротких столбцах */
        var value = svgEl("text", {
          class: "value-label", x: m.left + len + valuePad, y: y + barThickness / 2,
          "dominant-baseline": "middle"
        });
        value.textContent = fmtV(d.value);
        group.appendChild(value);

        /* Зона наведения шире марки: 30px против 18px самой полосы */
        var hit = svgEl("rect", {
          x: 0, y: m.top + i * rowH, width: w, height: rowH, class: "hit-area"
        });
        hit.addEventListener("pointermove", function (e) {
          bars.forEach(function (b, bi) {
            b.classList.toggle("bar-mark--dim", bi !== i);
          });
          showTip(d.label, [{ name: opts.valueName || "", value: fmtV(d.value), color: color }],
            e.clientX, e.clientY);
        });
        hit.addEventListener("pointerleave", function () {
          bars.forEach(function (b) { b.classList.remove("bar-mark--dim"); });
          hideTip();
        });
        group.appendChild(hit);

        svg.appendChild(group);
      });

      container.appendChild(svg);
    });
  }

  /* ========================================================================
     Стопочная полоса «часть-целое» — доли витрин в выручке.
     Сегменты разделяются зазором 2px цветом поверхности, а НЕ обводкой:
     обводка добавляет чернил, которые не являются данными.
     Подписи внутрь сегментов не ставим — их несут легенда и подсказка.
     ===================================================================== */

  function stackedBar(container, opts) {
    var segments = opts.segments || [];
    var fmtV = opts.formatValue || function (v) { return String(v); };

    mount(container, function () {
      clear(container);
      var total = segments.reduce(function (a, s) { return a + (s.value || 0); }, 0);
      if (!(total > 0)) return;

      var w = widthOf(container, 640);
      var barH = 34;
      var gap = 2; // зазор поверхности
      var svg = svgEl("svg", {
        width: w, height: barH, viewBox: "0 0 " + w + " " + barH,
        role: "img", "aria-label": opts.ariaLabel || "", focusable: "false"
      });

      var usable = w - gap * Math.max(0, segments.length - 1);
      var x = 0;
      segments.forEach(function (s, i) {
        var len = Math.max(2, (s.value / total) * usable);
        var color = seriesColor(i, s.color);
        var isFirst = i === 0;
        var isLast = i === segments.length - 1;

        /* Скругляем только внешние концы всей полосы */
        var d;
        if (isFirst || isLast) {
          var r = 4;
          d = isFirst && isLast
            ? barPath(x, 0, len, barH, r, "right")
            : isFirst
              ? "M" + (x + r) + ",0 h" + (len - r) + " v" + barH + " h" + -(len - r) +
                " a" + r + "," + r + " 0 0 1 " + -r + "," + -r +
                " v" + -(barH - r * 2) + " a" + r + "," + r + " 0 0 1 " + r + "," + -r + "Z"
              : barPath(x, 0, len, barH, r, "right");
        } else {
          d = "M" + x + ",0 h" + len + " v" + barH + " h" + -len + "Z";
        }

        var seg = svgEl("path", { d: d, fill: color, class: "bar-mark" });
        svg.appendChild(seg);

        var hit = svgEl("rect", { x: x, y: 0, width: len, height: barH, class: "hit-area" });
        (function (segment, share, col) {
          hit.addEventListener("pointermove", function (e) {
            showTip(segment.label, [
              { name: opts.valueName || "", value: fmtV(segment.value), color: col },
              { name: opts.shareName || "%", value: (share * 100).toFixed(1) + "%" }
            ], e.clientX, e.clientY);
          });
          hit.addEventListener("pointerleave", hideTip);
        })(s, s.value / total, color);
        svg.appendChild(hit);

        x += len + gap;
      });

      container.appendChild(svg);
    });
  }

  /* ========================================================================
     Легенда — обязательна при двух и более сериях.
     При одной серии её нет: заголовок карточки уже говорит, что нарисовано.
     ===================================================================== */

  function legend(container, entries, kind) {
    clear(container);
    if (!entries || entries.length < 2) return;
    var list = htmlEl("ul", "legend");
    entries.forEach(function (e, i) {
      var li = htmlEl("li");
      var item = htmlEl("span", "legend__item");
      var swatch = htmlEl("span",
        "legend__swatch" + (kind === "line" ? " legend__swatch--line" : ""));
      swatch.style.background = seriesColor(i, e.color);
      item.appendChild(swatch);
      item.appendChild(htmlEl("span", null, e.label));
      li.appendChild(item);
      list.appendChild(li);
    });
    container.appendChild(list);
  }

  /* ========================================================================
     Табличный двойник — есть у каждого графика.
     Это не «дополнительно», а обязательный доступный эквивалент: значение,
     которое показывает только подсказка, недоступно с клавиатуры и скринридера.
     ===================================================================== */

  function table(container, opts) {
    clear(container);
    var wrap = htmlEl("div", "table-wrap");
    var tbl = htmlEl("table", "data");
    if (opts.caption) {
      var cap = htmlEl("caption", "sr-only", opts.caption);
      tbl.appendChild(cap);
    }

    var thead = htmlEl("thead");
    var htr = htmlEl("tr");
    (opts.columns || []).forEach(function (col) {
      var th = htmlEl("th", col.numeric ? "num" : null, col.label);
      th.setAttribute("scope", "col");
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    tbl.appendChild(thead);

    var tbody = htmlEl("tbody");
    (opts.rows || []).forEach(function (row) {
      var tr = htmlEl("tr");
      row.forEach(function (cell, ci) {
        var col = (opts.columns || [])[ci] || {};
        var td = htmlEl("td", col.numeric ? "num" : null);
        if (cell && typeof cell === "object" && cell.color) {
          var key = htmlEl("span", "table-key");
          key.style.background = cell.color;
          td.appendChild(key);
          td.appendChild(document.createTextNode(cell.text));
        } else {
          td.textContent = cell == null ? "—" : String(cell);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody);

    if (opts.footRow) {
      var tfoot = htmlEl("tfoot");
      var ftr = htmlEl("tr");
      opts.footRow.forEach(function (cell, ci) {
        var col = (opts.columns || [])[ci] || {};
        var td = htmlEl("td", col.numeric ? "num" : null, cell == null ? "" : String(cell));
        td.style.fontWeight = "600";
        ftr.appendChild(td);
      });
      tfoot.appendChild(ftr);
      tbl.appendChild(tfoot);
    }

    wrap.appendChild(tbl);
    container.appendChild(wrap);
  }

  global.Charts = {
    SERIES_VARS: SERIES_VARS,
    seriesColor: seriesColor,
    sparkline: sparkline,
    line: line,
    barsH: barsH,
    stackedBar: stackedBar,
    legend: legend,
    table: table,
    hideTip: hideTip
  };
})(window);
