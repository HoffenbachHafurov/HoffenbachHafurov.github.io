<#
.SYNOPSIS
    Собирает зашифрованный файл данных дашборда (data/dashboard.enc.js).

.DESCRIPTION
    Повторяет схему из assets/js/vault.js, чтобы браузер мог открыть результат:

        ключи = PBKDF2-SHA256(login + "\n" + password, salt, N) -> 64 байта
                первые 32 -> ключ AES-256-CBC, вторые 32 -> ключ HMAC-SHA256
        ct    = AES-256-CBC(JSON, при необходимости сжатый gzip)
        tag   = HMAC-SHA256(iv || ct)          # encrypt-then-MAC

    Пароль нигде не сохраняется. Из него выводится только ключ, а проверить
    его правильность можно единственным способом - расшифровкой.

    ВАЖНО. Пароль не передавать открытым параметром: он осядет в истории
    PSReadLine. Скрипт запросит его сам через Read-Host -AsSecureString.

.PARAMETER InputPath
    Путь к JSON с данными по контракту (см. README.md).

.PARAMETER Demo
    Вместо чтения файла собрать синтетический демонстрационный набор.
    Логин и пароль при этом фиксированные и публичные: demo / demo-2026.
    Реальных продаж в этом наборе нет.

.PARAMETER User
    Логин, который будет открывать дашборд.

.PARAMETER OutPath
    Куда записать результат. По умолчанию ..\data\dashboard.enc.js

.PARAMETER Hint
    Необязательная подсказка к паролю. Видна всем - секретов не писать.

.EXAMPLE
    .\New-DashboardData.ps1 -Demo
    Собирает демо-набор под парой demo / demo-2026.

.EXAMPLE
    .\New-DashboardData.ps1 -InputPath .\sales.json -User vitaliy
    Спросит пароль и зашифрует реальные данные.
#>
[CmdletBinding(DefaultParameterSetName = 'File')]
param(
    [Parameter(ParameterSetName = 'File', Mandatory = $true)]
    [string]$InputPath,

    [Parameter(ParameterSetName = 'Demo', Mandatory = $true)]
    [switch]$Demo,

    [Parameter(ParameterSetName = 'File')]
    [string]$User,

    [string]$OutPath,

    [string]$Hint = '',

    [int]$Iterations = 600000,

    [switch]$NoCompress
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $OutPath) {
    $OutPath = Join-Path (Split-Path -Parent $scriptDir) 'data\dashboard.enc.js'
}

# ---------------------------------------------------------------------------
#  Демонстрационный набор
#  Числа синтетические. Детерминированность обеспечена фиксированным сидом:
#  повторный запуск даёт тот же набор, поэтому пересборка не плодит diff.
#  Строки по дням СОБИРАЮТСЯ ИЗ строк по SKU, иначе плитки показателей
#  разошлись бы с графиком топ-товаров.
# ---------------------------------------------------------------------------
function New-DemoDataset {
    $rand = New-Object System.Random(20260805)

    $markets = @(
        [pscustomobject]@{ id = 'DE'; name = 'Amazon.de';    currency = 'EUR'; weight = 0.34 }
        [pscustomobject]@{ id = 'FR'; name = 'Amazon.fr';    currency = 'EUR'; weight = 0.15 }
        [pscustomobject]@{ id = 'IT'; name = 'Amazon.it';    currency = 'EUR'; weight = 0.12 }
        [pscustomobject]@{ id = 'ES'; name = 'Amazon.es';    currency = 'EUR'; weight = 0.10 }
        [pscustomobject]@{ id = 'NL'; name = 'Amazon.nl';    currency = 'EUR'; weight = 0.07 }
        [pscustomobject]@{ id = 'UK'; name = 'Amazon.co.uk'; currency = 'GBP'; weight = 0.11 }
        [pscustomobject]@{ id = 'SE'; name = 'Amazon.se';    currency = 'SEK'; weight = 0.06 }
        [pscustomobject]@{ id = 'PL'; name = 'Amazon.pl';    currency = 'PLN'; weight = 0.05 }
    )

    $products = @(
        [pscustomobject]@{ sku = 'GP-KTL-1700'; name = 'Электрочайник 1.7 л, нержавеющая сталь'; price = 34.9 }
        [pscustomobject]@{ sku = 'GP-BLD-0900'; name = 'Блендер погружной 900 Вт с насадками';   price = 49.5 }
        [pscustomobject]@{ sku = 'GP-TST-0820'; name = 'Тостер на 2 отделения, 820 Вт';          price = 27.9 }
        [pscustomobject]@{ sku = 'GP-CFM-1450'; name = 'Кофемолка электрическая 150 г';          price = 22.4 }
        [pscustomobject]@{ sku = 'GP-SCL-0005'; name = 'Весы кухонные до 5 кг, стекло';          price = 15.9 }
        [pscustomobject]@{ sku = 'GP-PAN-0280'; name = 'Сковорода 28 см, антипригарная';         price = 31.0 }
        [pscustomobject]@{ sku = 'GP-POT-0500'; name = 'Кастрюля 5 л с крышкой, индукция';       price = 42.0 }
        [pscustomobject]@{ sku = 'GP-KNF-0006'; name = 'Набор кухонных ножей, 6 предметов';      price = 58.0 }
        [pscustomobject]@{ sku = 'GP-CTB-0450'; name = 'Разделочная доска бамбук 45 см';         price = 18.5 }
        [pscustomobject]@{ sku = 'GP-STR-1200'; name = 'Контейнеры для хранения, 12 шт';         price = 26.9 }
        [pscustomobject]@{ sku = 'GP-MIX-0350'; name = 'Миксер ручной 350 Вт, 5 скоростей';      price = 29.9 }
        [pscustomobject]@{ sku = 'GP-THM-0001'; name = 'Термометр кухонный цифровой';            price = 12.9 }
    )

    # Курсы нужны лишь для правдоподобия цен в не-евровых витринах.
    # На одной шкале валюты всё равно не сводятся - их разделяет фильтр.
    $fx = @{ EUR = 1.0; GBP = 0.85; SEK = 11.3; PLN = 4.3 }

    $lastDay = [datetime]::ParseExact('2026-08-04', 'yyyy-MM-dd', $null)
    $dayCount = 180

    $skuRows = New-Object System.Collections.ArrayList
    $dayMap = @{}

    for ($i = $dayCount - 1; $i -ge 0; $i--) {
        $date = $lastDay.AddDays(-$i)
        $iso = $date.ToString('yyyy-MM-dd')

        # Сезонность: выходные выше буднего дня + медленный рост к концу периода
        $weekend = if ($date.DayOfWeek -eq 'Sunday' -or $date.DayOfWeek -eq 'Saturday') { 1.25 } else { 1.0 }
        $trend = 0.8 + 0.4 * (($dayCount - $i) / $dayCount)
        $noise = 0.85 + $rand.NextDouble() * 0.3
        $dayFactor = $weekend * $trend * $noise

        foreach ($mp in $markets) {
            $soldCount = 2 + $rand.Next(0, 4)
            $picked = @{}

            for ($s = 0; $s -lt $soldCount; $s++) {
                $idx = $rand.Next(0, $products.Count)
                if ($picked.ContainsKey($idx)) { continue }
                $picked[$idx] = $true

                $product = $products[$idx]
                $units = [math]::Max(1, [math]::Round((1 + $rand.NextDouble() * 9) * $mp.weight * $dayFactor * 4))
                $price = [math]::Round($product.price * $fx[$mp.currency] * (0.95 + $rand.NextDouble() * 0.12), 2)
                $revenue = [math]::Round($units * $price, 2)

                [void]$skuRows.Add([pscustomobject]@{
                    date        = $iso
                    sku         = $product.sku
                    name        = $product.name
                    marketplace = $mp.id
                    currency    = $mp.currency
                    units       = [int]$units
                    revenue     = $revenue
                })

                $key = "$iso|$($mp.id)"
                if (-not $dayMap.ContainsKey($key)) {
                    $dayMap[$key] = [pscustomobject]@{
                        date = $iso; marketplace = $mp.id; currency = $mp.currency
                        revenue = 0.0; units = 0; orders = 0
                    }
                }
                $dayMap[$key].revenue = [math]::Round($dayMap[$key].revenue + $revenue, 2)
                $dayMap[$key].units += [int]$units
            }
        }
    }

    # Заказов меньше, чем штук: в среднем 1.3 позиции на заказ
    $days = $dayMap.Keys | Sort-Object | ForEach-Object {
        $row = $dayMap[$_]
        $row.orders = [math]::Max(1, [math]::Round($row.units / 1.3))
        $row
    }

    return [pscustomobject]@{
        meta = [pscustomobject]@{
            generatedAt     = '2026-08-04T21:00:00Z'
            storefront      = 'Demo Store'
            defaultCurrency = 'EUR'
            note            = 'Синтетические демонстрационные данные. Реальных продаж здесь нет.'
        }
        marketplaces = $markets | ForEach-Object {
            [pscustomobject]@{ id = $_.id; name = $_.name; currency = $_.currency }
        }
        days = @($days)
        skus = @($skuRows)
    }
}

# ---------------------------------------------------------------------------
#  Криптография
# ---------------------------------------------------------------------------
function ConvertFrom-SecureStringPlain {
    param([System.Security.SecureString]$Secure)
    $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToGlobalAllocUnicode($Secure)
    try {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringUni($ptr)
    } finally {
        # Освобождаем небезопасную копию сразу же
        [System.Runtime.InteropServices.Marshal]::ZeroFreeGlobalAllocUnicode($ptr)
    }
}

function Compress-Gzip {
    param([byte[]]$Bytes)
    $ms = New-Object System.IO.MemoryStream
    try {
        $gz = New-Object System.IO.Compression.GZipStream($ms, [System.IO.Compression.CompressionMode]::Compress, $true)
        try {
            $gz.Write($Bytes, 0, $Bytes.Length)
        } finally {
            $gz.Dispose()
        }
        return $ms.ToArray()
    } finally {
        $ms.Dispose()
    }
}

function New-EncryptedPayload {
    param(
        [string]$Json,
        [string]$Login,
        [string]$Password,
        [int]$Iterations,
        [bool]$UseGzip,
        [string]$Hint
    )

    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $salt = New-Object byte[] 16
    $iv = New-Object byte[] 16
    $rng.GetBytes($salt)
    $rng.GetBytes($iv)

    # UTF-8 без BOM: браузер декодирует TextDecoder'ом, лишний BOM сломал бы JSON.parse
    $utf8 = New-Object System.Text.UTF8Encoding($false)
    $body = $utf8.GetBytes($Json)
    if ($UseGzip) { $body = Compress-Gzip -Bytes $body }

    # Тот же материал ключа, что и в vault.js: логин нормализуется, пароль - нет
    $material = $utf8.GetBytes(($Login.Trim().ToLowerInvariant()) + "`n" + $Password)

    $kdf = New-Object System.Security.Cryptography.Rfc2898DeriveBytes(
        $material, $salt, $Iterations, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
    try {
        $keyBytes = $kdf.GetBytes(64)
    } finally {
        $kdf.Dispose()
    }
    $aesKey = $keyBytes[0..31]
    $macKey = $keyBytes[32..63]

    $aes = [System.Security.Cryptography.Aes]::Create()
    try {
        $aes.KeySize = 256
        $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
        $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
        $aes.Key = $aesKey
        $aes.IV = $iv
        $encryptor = $aes.CreateEncryptor()
        try {
            $ct = $encryptor.TransformFinalBlock($body, 0, $body.Length)
        } finally {
            $encryptor.Dispose()
        }
    } finally {
        $aes.Dispose()
    }

    # Подписывается iv вместе с шифротекстом, иначе iv можно подменить незаметно
    $signed = New-Object byte[] ($iv.Length + $ct.Length)
    [Array]::Copy($iv, 0, $signed, 0, $iv.Length)
    [Array]::Copy($ct, 0, $signed, $iv.Length, $ct.Length)

    $hmac = New-Object System.Security.Cryptography.HMACSHA256(, [byte[]]$macKey)
    try {
        $tag = $hmac.ComputeHash($signed)
    } finally {
        $hmac.Dispose()
    }

    return [ordered]@{
        v           = 2
        kdf         = 'PBKDF2-SHA256'
        iterations  = $Iterations
        cipher      = 'AES-256-CBC'
        mac         = 'HMAC-SHA256'
        compression = $(if ($UseGzip) { 'gzip' } else { 'none' })
        salt        = [Convert]::ToBase64String($salt)
        iv          = [Convert]::ToBase64String($iv)
        ct          = [Convert]::ToBase64String($ct)
        tag         = [Convert]::ToBase64String($tag)
        hint        = $Hint
        createdAt   = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    }
}

# ---------------------------------------------------------------------------
#  Основной ход
# ---------------------------------------------------------------------------

if ($Demo) {
    Write-Host 'Собираю демонстрационный набор...' -ForegroundColor Cyan
    $dataset = New-DemoDataset
    $json = $dataset | ConvertTo-Json -Depth 10 -Compress
    $login = 'demo'
    $password = 'demo-2026'
    if (-not $Hint) { $Hint = 'demo / demo-2026 - демонстрационные данные' }
    Write-Host 'Демо-пара логин/пароль публична и указана в README.' -ForegroundColor Yellow
}
else {
    if (-not (Test-Path -LiteralPath $InputPath)) {
        throw "Файл не найден: $InputPath"
    }
    $json = Get-Content -LiteralPath $InputPath -Raw -Encoding UTF8
    try {
        $null = $json | ConvertFrom-Json
    } catch {
        throw "JSON не разбирается: $($_.Exception.Message)"
    }

    if (-not $User) { $User = Read-Host 'Логин' }
    $login = $User

    # Пароль только через SecureString: параметром он попал бы в историю команд
    $secure = Read-Host 'Пароль' -AsSecureString
    $secure2 = Read-Host 'Пароль ещё раз' -AsSecureString
    $password = ConvertFrom-SecureStringPlain -Secure $secure
    $confirm = ConvertFrom-SecureStringPlain -Secure $secure2
    if ($password -ne $confirm) { throw 'Пароли не совпали' }
    if ($password.Length -lt 12) {
        Write-Warning 'Пароль короче 12 символов. Репозиторий публичный, шифротекст доступен для офлайнового перебора - возьмите длиннее.'
    }
}

$sizeKb = [math]::Round(([System.Text.Encoding]::UTF8.GetByteCount($json)) / 1KB, 1)
Write-Host "Исходный JSON: $sizeKb КБ" -ForegroundColor Gray

$payload = New-EncryptedPayload -Json $json -Login $login -Password $password `
    -Iterations $Iterations -UseGzip (-not $NoCompress) -Hint $Hint

$payloadJson = $payload | ConvertTo-Json -Depth 5

$header = @"
/* Зашифрованные данные дашборда. Сгенерировано tools/New-DashboardData.ps1.
   Открывается только парой логин+пароль, из которой выводится ключ.
   Пароль здесь не хранится - ни в открытом виде, ни хешем. */
window.DASHBOARD_PAYLOAD =
"@

$content = $header + $payloadJson + ";`n"

$outDir = Split-Path -Parent $OutPath
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

# .js читается браузером как UTF-8; BOM не нужен
[System.IO.File]::WriteAllText($OutPath, $content, (New-Object System.Text.UTF8Encoding($false)))

$outKb = [math]::Round((Get-Item -LiteralPath $OutPath).Length / 1KB, 1)
Write-Host ''
Write-Host "Готово: $OutPath" -ForegroundColor Green
Write-Host "Размер: $outKb КБ, сжатие: $($payload.compression), итераций PBKDF2: $Iterations" -ForegroundColor Gray
Write-Host 'Проверьте вход на странице перед коммитом.' -ForegroundColor Gray

# Затираем пароль в памяти скрипта
$password = $null
$confirm = $null
[GC]::Collect()
