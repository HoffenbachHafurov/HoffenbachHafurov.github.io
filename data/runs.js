/* Журнал синхронизаций. Собирается автоматически, руками не править. */
window.DASHBOARD_RUNS = {
  "schemaVersion": 1,
  "updatedAt": "2026-08-17T11:38:30Z",
  "integrations": [
    {
      "id": "amazon-economics",
      "name": "Amazon SP-API · Data Kiosk",
      "cron": "10 */5 * * *",
      "every": "PT5H",
      "repo": "amazon-sp-api-integration"
    }
  ],
  "runs": [
    {
      "id": "32022173791",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-17T10:52:06Z",
      "finishedAt": "2026-08-17T11:38:30Z",
      "durationSec": 2784,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-16"
      },
      "coverage": {
        "expectedDays": 228,
        "coveredDays": 228,
        "percent": 100.0,
        "rows": 2508,
        "feeRows": 12012,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 2014,
          "detail": "142 956 строк, 82 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 25,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 23,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 93,
          "detail": "7,4 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 615,
          "detail": "позиций 23, единиц за порогом 174"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,4 МБ"
        },
        {
          "name": "Страны доставки в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "2026-01-01..2026-07-01, стран 6, 6 076 шт"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "1 268 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/32022173791"
    },
    {
      "id": "32008172781",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-17T07:58:38Z",
      "finishedAt": "2026-08-17T08:23:13Z",
      "durationSec": 1475,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-16"
      },
      "coverage": {
        "expectedDays": 228,
        "coveredDays": 228,
        "percent": 100.0,
        "rows": 2508,
        "feeRows": 11975,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 676,
          "detail": "142 956 строк, 82 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 38,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 35,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 94,
          "detail": "7,4 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 618,
          "detail": "позиций 23, единиц за порогом 184"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 259 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/32008172781"
    },
    {
      "id": "31991280675",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-17T03:28:49Z",
      "finishedAt": "2026-08-17T03:53:23Z",
      "durationSec": 1474,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-16"
      },
      "coverage": {
        "expectedDays": 228,
        "coveredDays": 228,
        "percent": 100.0,
        "rows": 2508,
        "feeRows": 11959,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 675,
          "detail": "142 956 строк, 82 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 38,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 34,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 94,
          "detail": "7,4 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 617,
          "detail": "позиций 23, единиц за порогом 184"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 258 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31991280675"
    },
    {
      "id": "31971864665",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-16T20:53:35Z",
      "finishedAt": "2026-08-16T21:55:16Z",
      "durationSec": 3701,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-15"
      },
      "coverage": {
        "expectedDays": 227,
        "coveredDays": 227,
        "percent": 100.0,
        "rows": 2497,
        "feeRows": 11959,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 2867,
          "detail": "142 329 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 25,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 28,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 146,
          "detail": "7,4 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 617,
          "detail": "позиций 23, единиц за порогом 185"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 258 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31971864665"
    },
    {
      "id": "31956920976",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-16T15:52:02Z",
      "finishedAt": "2026-08-16T15:56:47Z",
      "durationSec": 285,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-15"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "failed",
          "durationSec": 280,
          "detail": "Response status code does not indicate success: 429 ()."
        },
        {
          "name": "Сборка данных дашборда",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Выгрузка Data Kiosk",
        "message": "Response status code does not indicate success: 429 ()."
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31956920976"
    },
    {
      "id": "31942909802",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-16T10:54:44Z",
      "finishedAt": "2026-08-16T10:59:34Z",
      "durationSec": 290,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-15"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "failed",
          "durationSec": 282,
          "detail": "Response status code does not indicate success: 429 ()."
        },
        {
          "name": "Сборка данных дашборда",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Выгрузка Data Kiosk",
        "message": "Response status code does not indicate success: 429 ()."
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31942909802"
    },
    {
      "id": "31930327200",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-16T05:59:59Z",
      "finishedAt": "2026-08-16T06:04:49Z",
      "durationSec": 290,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-15"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "failed",
          "durationSec": 281,
          "detail": "Response status code does not indicate success: 429 ()."
        },
        {
          "name": "Сборка данных дашборда",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Выгрузка Data Kiosk",
        "message": "Response status code does not indicate success: 429 ()."
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31930327200"
    },
    {
      "id": "31924313724",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-16T03:28:18Z",
      "finishedAt": "2026-08-16T03:33:10Z",
      "durationSec": 292,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-15"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "failed",
          "durationSec": 283,
          "detail": "Response status code does not indicate success: 429 ()."
        },
        {
          "name": "Сборка данных дашборда",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Выгрузка Data Kiosk",
        "message": "Response status code does not indicate success: 429 ()."
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31924313724"
    },
    {
      "id": "31907970479",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-15T20:54:40Z",
      "finishedAt": "2026-08-15T20:59:25Z",
      "durationSec": 285,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-14"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "failed",
          "durationSec": 280,
          "detail": "Response status code does not indicate success: 429 ()."
        },
        {
          "name": "Сборка данных дашборда",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Выгрузка Data Kiosk",
        "message": "Response status code does not indicate success: 429 ()."
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31907970479"
    },
    {
      "id": "31893811412",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-15T15:49:44Z",
      "finishedAt": "2026-08-15T15:54:31Z",
      "durationSec": 287,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-14"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "failed",
          "durationSec": 281,
          "detail": "Response status code does not indicate success: 429 ()."
        },
        {
          "name": "Сборка данных дашборда",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Выгрузка Data Kiosk",
        "message": "Response status code does not indicate success: 429 ()."
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31893811412"
    },
    {
      "id": "31880659769",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-15T10:53:39Z",
      "finishedAt": "2026-08-15T12:24:06Z",
      "durationSec": 5427,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-14"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 5417,
          "detail": ""
        },
        {
          "name": "Сборка данных дашборда",
          "status": "failed",
          "durationSec": 0,
          "detail": "Не найден ни один .jsonl в .cache\\economics. Сначала запустите Export-SpApiEconomics.ps1"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Сборка payload",
        "message": "Не найден ни один .jsonl в .cache\\economics. Сначала запустите Export-SpApiEconomics.ps1"
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31880659769"
    },
    {
      "id": "31868268509",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "failed",
      "startedAt": "2026-08-15T05:58:26Z",
      "finishedAt": "2026-08-15T07:28:48Z",
      "durationSec": 5422,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-14"
      },
      "coverage": null,
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 5406,
          "detail": ""
        },
        {
          "name": "Сборка данных дашборда",
          "status": "failed",
          "durationSec": 0,
          "detail": "Не найден ни один .jsonl в .cache\\economics. Сначала запустите Export-SpApiEconomics.ps1"
        },
        {
          "name": "База знаний в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные маржи в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Запасы в payload",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        },
        {
          "name": "Шифрование файла данных",
          "status": "skipped",
          "durationSec": 0,
          "detail": "Пропущен: прогон остановлен на предыдущем шаге"
        }
      ],
      "error": {
        "type": "Сборка payload",
        "message": "Не найден ни один .jsonl в .cache\\economics. Сначала запустите Export-SpApiEconomics.ps1"
      },
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31868268509"
    },
    {
      "id": "31860930827",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-15T03:06:11Z",
      "finishedAt": "2026-08-15T03:37:44Z",
      "durationSec": 1893,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-14"
      },
      "coverage": {
        "expectedDays": 226,
        "coveredDays": 226,
        "percent": 100.0,
        "rows": 2486,
        "feeRows": 11844,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 522,
          "detail": "141 702 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 33,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "failed",
          "durationSec": 669,
          "detail": "Отчёт B072PPT9V3 B0DMTJXH9W B0854MW97N B07JZCWJMW B07PPXKJPQ B0DJ1DGY6J B0F63Q4BLX B0933B1NKB B0DMTMHVK4 B0FVG9MZR8 B0DNT4FNZ9 B0933F6ZWD B08NCRRM6M B0FNX21TZF B0F79C4Y9C B0GGJ6VRCQ B0DNTPCLRN B0933DBFMS за 2026-07-26..2026-08-01 не собрался за отведённое время"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 617,
          "detail": "позиций 23, единиц за порогом 193"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,1 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 208 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31860930827"
    },
    {
      "id": "31840608934",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-14T21:01:56Z",
      "finishedAt": "2026-08-14T21:28:15Z",
      "durationSec": 1579,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-13"
      },
      "coverage": {
        "expectedDays": 225,
        "coveredDays": 225,
        "percent": 100.0,
        "rows": 2475,
        "feeRows": 11843,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 735,
          "detail": "141 075 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 35,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 35,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 145,
          "detail": "7,4 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 616,
          "detail": "позиций 23, единиц за порогом 190"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 255 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31840608934"
    },
    {
      "id": "31827225849",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-14T18:08:05Z",
      "finishedAt": "2026-08-14T18:36:02Z",
      "durationSec": 1677,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-13"
      },
      "coverage": {
        "expectedDays": 225,
        "coveredDays": 225,
        "percent": 100.0,
        "rows": 2475,
        "feeRows": 11843,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 765,
          "detail": "141 075 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 33,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 207,
          "detail": "7,4 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 615,
          "detail": "позиций 23, единиц за порогом 190"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 255 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31827225849"
    },
    {
      "id": "31805802764",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-14T13:40:23Z",
      "finishedAt": "2026-08-14T14:41:37Z",
      "durationSec": 3674,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-13"
      },
      "coverage": {
        "expectedDays": 225,
        "coveredDays": 225,
        "percent": 100.0,
        "rows": 2475,
        "feeRows": 11843,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 2924,
          "detail": "141 075 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 31,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 29,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 57,
          "detail": "7,1 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 616,
          "detail": "позиций 23, единиц за порогом 198"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,2 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 213 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31805802764"
    },
    {
      "id": "31802782519",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-14T13:07:23Z",
      "finishedAt": "2026-08-14T13:34:32Z",
      "durationSec": 1629,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-13"
      },
      "coverage": {
        "expectedDays": 225,
        "coveredDays": 225,
        "percent": 100.0,
        "rows": 2475,
        "feeRows": 11843,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 853,
          "detail": "141 075 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 37,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 34,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 76,
          "detail": "7,1 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "success",
          "durationSec": 613,
          "detail": "позиций 23, единиц за порогом 198"
        },
        {
          "name": "Запасы в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "7,2 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 213 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31802782519"
    },
    {
      "id": "31801770122",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-14T12:52:12Z",
      "finishedAt": "2026-08-14T13:07:12Z",
      "durationSec": 900,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-13"
      },
      "coverage": {
        "expectedDays": 225,
        "coveredDays": 225,
        "percent": 100.0,
        "rows": 2475,
        "feeRows": 11843,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 704,
          "detail": "141 075 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 34,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 108,
          "detail": "7,1 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "failed",
          "durationSec": 0,
          "detail": "Exception calling \"ReadAllLines\" with \"1\" argument(s): \"Could not find file '/home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.env'.\""
        },
        {
          "name": "Запасы в payload",
          "status": "failed",
          "durationSec": 0,
          "detail": "Нет узла overstock: /home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.cache/overstock.json — сначала запустите src/Find-OverstockedSkus.ps1"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 208 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31801770122"
    },
    {
      "id": "31800632891",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-14T12:30:41Z",
      "finishedAt": "2026-08-14T12:52:00Z",
      "durationSec": 1279,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-13"
      },
      "coverage": {
        "expectedDays": 225,
        "coveredDays": 225,
        "percent": 100.0,
        "rows": 2475,
        "feeRows": 11843,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 738,
          "detail": "141 075 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 37,
          "detail": "5,6 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 35,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 455,
          "detail": "7,1 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "failed",
          "durationSec": 0,
          "detail": "Exception calling \"ReadAllLines\" with \"1\" argument(s): \"Could not find file '/home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.env'.\""
        },
        {
          "name": "Запасы в payload",
          "status": "failed",
          "durationSec": 0,
          "detail": "Нет узла overstock: /home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.cache/overstock.json — сначала запустите src/Find-OverstockedSkus.ps1"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 208 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31800632891"
    },
    {
      "id": "31774161163",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-14T05:48:16Z",
      "finishedAt": "2026-08-14T06:12:35Z",
      "durationSec": 1459,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-13"
      },
      "coverage": {
        "expectedDays": 225,
        "coveredDays": 225,
        "percent": 100.0,
        "rows": 2475,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 1314,
          "detail": "141 075 строк, 81 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "6,0 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 34,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 57,
          "detail": "7,1 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "failed",
          "durationSec": 0,
          "detail": "Exception calling \"ReadAllLines\" with \"1\" argument(s): \"Could not find file '/home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.env'.\""
        },
        {
          "name": "Запасы в payload",
          "status": "failed",
          "durationSec": 0,
          "detail": "Нет узла overstock: /home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.cache/overstock.json — сначала запустите src/Find-OverstockedSkus.ps1"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 206 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31774161163"
    },
    {
      "id": "31754325394",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-13T23:34:51Z",
      "finishedAt": "2026-08-13T23:49:43Z",
      "durationSec": 892,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 763,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 33,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "success",
          "durationSec": 45,
          "detail": "7,1 МБ"
        },
        {
          "name": "Данные по запасам FBA",
          "status": "failed",
          "durationSec": 0,
          "detail": "Exception calling \"ReadAllLines\" with \"1\" argument(s): \"Could not find file '/home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.env'.\""
        },
        {
          "name": "Запасы в payload",
          "status": "failed",
          "durationSec": 0,
          "detail": "Нет узла overstock: /home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.cache/overstock.json — сначала запустите src/Find-OverstockedSkus.ps1"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 206 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31754325394"
    },
    {
      "id": "31752975314",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-13T23:16:54Z",
      "finishedAt": "2026-08-13T23:32:20Z",
      "durationSec": 926,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 829,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 39,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 37,
          "detail": "7,1 МБ"
        },
        {
          "name": "Поисковые запросы в payload",
          "status": "failed",
          "durationSec": 0,
          "detail": "Exception calling \"ReadAllLines\" with \"1\" argument(s): \"Could not find file '/home/runner/work/amazon-sp-api-integration/amazon-sp-api-integration/pipeline/.env'.\""
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 200 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31752975314"
    },
    {
      "id": "31752241869",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-13T23:01:03Z",
      "finishedAt": "2026-08-13T23:16:41Z",
      "durationSec": 938,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 862,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 31,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 29,
          "detail": "7,1 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 200 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31752241869"
    },
    {
      "id": "31749803464",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-13T22:24:21Z",
      "finishedAt": "2026-08-13T22:38:14Z",
      "durationSec": 833,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 763,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 29,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 26,
          "detail": "7,0 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 175 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31749803464"
    },
    {
      "id": "31742199861",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-13T20:42:43Z",
      "finishedAt": "2026-08-13T20:56:19Z",
      "durationSec": 816,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 747,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 31,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Данные маржи в payload",
          "status": "success",
          "durationSec": 27,
          "detail": "7,0 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "1 175 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31742199861"
    },
    {
      "id": "31729426076",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-13T18:10:42Z",
      "finishedAt": "2026-08-13T18:22:40Z",
      "durationSec": 718,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 673,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 31,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "957 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31729426076"
    },
    {
      "id": "31700842441",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-13T12:39:46Z",
      "finishedAt": "2026-08-13T12:56:03Z",
      "durationSec": 977,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 921,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 38,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "956 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31700842441"
    },
    {
      "id": "31699928330",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-13T12:25:25Z",
      "finishedAt": "2026-08-13T12:39:36Z",
      "durationSec": 851,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11780,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 795,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 40,
          "detail": "5,5 МБ"
        },
        {
          "name": "База знаний в payload",
          "status": "success",
          "durationSec": 0,
          "detail": "5,9 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "956 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31699928330"
    },
    {
      "id": "31671772645",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-13T05:51:48Z",
      "finishedAt": "2026-08-13T06:04:11Z",
      "durationSec": 743,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-12"
      },
      "coverage": {
        "expectedDays": 224,
        "coveredDays": 224,
        "percent": 100.0,
        "rows": 2464,
        "feeRows": 11656,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 703,
          "detail": "140 448 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 29,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "578 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31671772645"
    },
    {
      "id": "31646787227",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-12T22:24:12Z",
      "finishedAt": "2026-08-12T22:37:20Z",
      "durationSec": 788,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-11"
      },
      "coverage": {
        "expectedDays": 223,
        "coveredDays": 223,
        "percent": 100.0,
        "rows": 2453,
        "feeRows": 11656,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 737,
          "detail": "139 821 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "577 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31646787227"
    },
    {
      "id": "31626227265",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-12T18:09:30Z",
      "finishedAt": "2026-08-12T18:43:00Z",
      "durationSec": 2010,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-11"
      },
      "coverage": {
        "expectedDays": 223,
        "coveredDays": 223,
        "percent": 100.0,
        "rows": 2453,
        "feeRows": 11656,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 1958,
          "detail": "139 821 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "577 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31626227265"
    },
    {
      "id": "31597208508",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-12T12:35:54Z",
      "finishedAt": "2026-08-12T12:45:47Z",
      "durationSec": 593,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-11"
      },
      "coverage": {
        "expectedDays": 223,
        "coveredDays": 223,
        "percent": 100.0,
        "rows": 2453,
        "feeRows": 11656,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 554,
          "detail": "139 821 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 25,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "577 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31597208508"
    },
    {
      "id": "31567760138",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-12T05:48:25Z",
      "finishedAt": "2026-08-12T06:02:15Z",
      "durationSec": 830,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-11"
      },
      "coverage": {
        "expectedDays": 223,
        "coveredDays": 223,
        "percent": 100.0,
        "rows": 2453,
        "feeRows": 11609,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 798,
          "detail": "139 821 строк, 80 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 21,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "577 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31567760138"
    },
    {
      "id": "31542272870",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-11T22:24:33Z",
      "finishedAt": "2026-08-11T22:36:41Z",
      "durationSec": 728,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-10"
      },
      "coverage": {
        "expectedDays": 222,
        "coveredDays": 222,
        "percent": 100.0,
        "rows": 2442,
        "feeRows": 11604,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 680,
          "detail": "139 194 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "577 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31542272870"
    },
    {
      "id": "31521216330",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-11T18:09:03Z",
      "finishedAt": "2026-08-11T18:23:54Z",
      "durationSec": 891,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-10"
      },
      "coverage": {
        "expectedDays": 222,
        "coveredDays": 222,
        "percent": 100.0,
        "rows": 2442,
        "feeRows": 11604,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 858,
          "detail": "139 194 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 24,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "577 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31521216330"
    },
    {
      "id": "31491532063",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-11T12:30:19Z",
      "finishedAt": "2026-08-11T12:43:39Z",
      "durationSec": 800,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-10"
      },
      "coverage": {
        "expectedDays": 222,
        "coveredDays": 222,
        "percent": 100.0,
        "rows": 2442,
        "feeRows": 11604,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 766,
          "detail": "139 194 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 20,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "577 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31491532063"
    },
    {
      "id": "31473736536",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-11T08:33:31Z",
      "finishedAt": "2026-08-11T08:48:33Z",
      "durationSec": 902,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-10"
      },
      "coverage": {
        "expectedDays": 222,
        "coveredDays": 222,
        "percent": 100.0,
        "rows": 2442,
        "feeRows": 11584,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 853,
          "detail": "139 194 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 37,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "575 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31473736536"
    },
    {
      "id": "31459800657",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-11T04:51:54Z",
      "finishedAt": "2026-08-11T05:04:54Z",
      "durationSec": 780,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-10"
      },
      "coverage": {
        "expectedDays": 222,
        "coveredDays": 222,
        "percent": 100.0,
        "rows": 2442,
        "feeRows": 11559,
        "productRows": 20691
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 734,
          "detail": "139 194 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 37,
          "detail": "5,5 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "574 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31459800657"
    },
    {
      "id": "31437104466",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-10T22:09:44Z",
      "finishedAt": "2026-08-10T22:24:14Z",
      "durationSec": 870,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11559,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 823,
          "detail": "138 567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "566 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31437104466"
    },
    {
      "id": "31417113205",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-10T18:03:22Z",
      "finishedAt": "2026-08-10T18:18:17Z",
      "durationSec": 895,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 855,
          "detail": "138 567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 30,
          "detail": "5,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 2,
          "detail": "565 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31417113205"
    },
    {
      "id": "31389453777",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-10T12:52:04Z",
      "finishedAt": "2026-08-10T13:19:33Z",
      "durationSec": 1649,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 1615,
          "detail": "138 567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 23,
          "detail": "5,4 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "566 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31389453777"
    },
    {
      "id": "31388751048",
      "integration": "amazon-economics",
      "trigger": "schedule",
      "status": "success",
      "startedAt": "2026-08-10T12:35:38Z",
      "finishedAt": "2026-08-10T12:51:45Z",
      "durationSec": 967,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 920,
          "detail": "138 567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 36,
          "detail": "5,0 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "533 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31388751048"
    },
    {
      "id": "31376196370",
      "integration": "amazon-economics",
      "trigger": "workflow_dispatch",
      "status": "success",
      "startedAt": "2026-08-10T09:47:05Z",
      "finishedAt": "2026-08-10T09:59:32Z",
      "durationSec": 747,
      "period": {
        "from": "2026-01-01",
        "to": "2026-08-09"
      },
      "coverage": {
        "expectedDays": 221,
        "coveredDays": 221,
        "percent": 100.0,
        "rows": 2431,
        "feeRows": 11539,
        "productRows": 20064
      },
      "steps": [
        {
          "name": "Выгрузка экономики из Amazon",
          "status": "success",
          "durationSec": 703,
          "detail": "138,567 строк, 79 МБ"
        },
        {
          "name": "Сборка данных дашборда",
          "status": "success",
          "durationSec": 34,
          "detail": "5.0 МБ"
        },
        {
          "name": "Шифрование файла данных",
          "status": "success",
          "durationSec": 1,
          "detail": "533 КБ"
        }
      ],
      "error": null,
      "runUrl": "https://github.com/HoffenbachHafurov/amazon-sp-api-integration/actions/runs/31376196370"
    }
  ]
};
