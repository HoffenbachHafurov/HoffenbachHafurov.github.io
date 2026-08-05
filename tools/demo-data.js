/* ============================================================================
   demo-data.js — генератор демонстрационного набора
   ----------------------------------------------------------------------------
   Нужен, чтобы дашборд можно было посмотреть до подключения реальных данных,
   и чтобы контракт данных был показан на живом примере, а не только описан.

   Числа синтетические и детерминированные (сид фиксирован): одинаковый вход
   даёт одинаковый выход, поэтому пересборка файла не создаёт лишних diff'ов.
   Реальных продаж здесь нет.

   Строки по дням СОБИРАЮТСЯ ИЗ строк по SKU, а не генерируются отдельно —
   иначе показатели в плитках разошлись бы с графиком топ-товаров.
   ========================================================================= */

(function (global) {
  "use strict";

  /* mulberry32 — компактный ГПСЧ с сидом */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var MARKETPLACES = [
    { id: "DE", name: "Amazon.de", currency: "EUR", weight: 0.34 },
    { id: "FR", name: "Amazon.fr", currency: "EUR", weight: 0.15 },
    { id: "IT", name: "Amazon.it", currency: "EUR", weight: 0.12 },
    { id: "ES", name: "Amazon.es", currency: "EUR", weight: 0.10 },
    { id: "NL", name: "Amazon.nl", currency: "EUR", weight: 0.07 },
    { id: "UK", name: "Amazon.co.uk", currency: "GBP", weight: 0.11 },
    { id: "SE", name: "Amazon.se", currency: "SEK", weight: 0.06 },
    { id: "PL", name: "Amazon.pl", currency: "PLN", weight: 0.05 }
  ];

  var PRODUCTS = [
    { sku: "GP-KTL-1700", name: "Электрочайник 1.7 л, нержавеющая сталь", price: 34.9 },
    { sku: "GP-BLD-0900", name: "Блендер погружной 900 Вт с насадками", price: 49.5 },
    { sku: "GP-TST-0820", name: "Тостер на 2 отделения, 820 Вт", price: 27.9 },
    { sku: "GP-CFM-1450", name: "Кофемолка электрическая 150 г", price: 22.4 },
    { sku: "GP-SCL-0005", name: "Весы кухонные до 5 кг, стекло", price: 15.9 },
    { sku: "GP-PAN-0280", name: "Сковорода 28 см с антипригарным покрытием", price: 31.0 },
    { sku: "GP-POT-0500", name: "Кастрюля 5 л с крышкой, индукция", price: 42.0 },
    { sku: "GP-KNF-0006", name: "Набор кухонных ножей, 6 предметов", price: 58.0 },
    { sku: "GP-CTB-0450", name: "Разделочная доска бамбук 45 см", price: 18.5 },
    { sku: "GP-STR-1200", name: "Контейнеры для хранения, набор 12 шт", price: 26.9 },
    { sku: "GP-MIX-0350", name: "Миксер ручной 350 Вт, 5 скоростей", price: 29.9 },
    { sku: "GP-THM-0001", name: "Термометр кухонный цифровой", price: 12.9 }
  ];

  /* Курсы нужны только чтобы цены в не-евровых витринах выглядели правдоподобно.
     На одной шкале валюты всё равно не сводятся — их разделяет фильтр. */
  var FX = { EUR: 1, GBP: 0.85, SEK: 11.3, PLN: 4.3 };

  var LAST_DAY = "2026-08-04";
  var DAYS = 180;

  function isoShift(iso, delta) {
    var d = new Date(iso + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10);
  }

  function round2(v) { return Math.round(v * 100) / 100; }

  function buildDemoData() {
    var rand = rng(20260805);
    var skuRows = [];
    var dayMap = {};

    for (var i = DAYS - 1; i >= 0; i--) {
      var date = isoShift(LAST_DAY, -i);
      var dow = new Date(date + "T00:00:00Z").getUTCDay();

      /* Сезонность: выходные выше буднего дня, плюс медленный рост к концу периода */
      var weekend = dow === 0 || dow === 6 ? 1.25 : 1.0;
      var trend = 0.8 + 0.4 * ((DAYS - i) / DAYS);
      var noise = 0.85 + rand() * 0.3;
      var dayFactor = weekend * trend * noise;

      MARKETPLACES.forEach(function (mp) {
        /* Не каждый товар продаётся каждый день на каждой витрине */
        var soldCount = 2 + Math.floor(rand() * 4);
        var picked = {};
        for (var s = 0; s < soldCount; s++) {
          var idx = Math.floor(rand() * PRODUCTS.length);
          if (picked[idx]) continue;
          picked[idx] = true;

          var product = PRODUCTS[idx];
          var units = Math.max(1, Math.round((1 + rand() * 9) * mp.weight * dayFactor * 4));
          var price = round2(product.price * FX[mp.currency] * (0.95 + rand() * 0.12));
          var revenue = round2(units * price);

          skuRows.push({
            date: date,
            sku: product.sku,
            name: product.name,
            marketplace: mp.id,
            currency: mp.currency,
            units: units,
            revenue: revenue
          });

          var key = date + "|" + mp.id;
          if (!dayMap[key]) {
            dayMap[key] = {
              date: date, marketplace: mp.id, currency: mp.currency,
              revenue: 0, units: 0, orders: 0
            };
          }
          dayMap[key].revenue = round2(dayMap[key].revenue + revenue);
          dayMap[key].units += units;
        }
      });
    }

    /* Заказов меньше, чем штук: в среднем 1.3 позиции на заказ */
    var days = Object.keys(dayMap).sort().map(function (k) {
      var row = dayMap[k];
      row.orders = Math.max(1, Math.round(row.units / 1.3));
      return row;
    });

    return {
      meta: {
        generatedAt: LAST_DAY + "T21:00:00Z",
        storefront: "Demo Store",
        defaultCurrency: "EUR",
        note: "Синтетические демонстрационные данные. Реальных продаж здесь нет."
      },
      marketplaces: MARKETPLACES.map(function (m) {
        return { id: m.id, name: m.name, currency: m.currency };
      }),
      days: days,
      skus: skuRows
    };
  }

  global.buildDemoData = buildDemoData;
})(window);
