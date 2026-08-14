/* Журнал синхронизаций. Собирается автоматически, руками не править. */
window.DASHBOARD_RUNS = {
  "schemaVersion": 1,
  "updatedAt": "2026-08-14T13:07:12Z",
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
