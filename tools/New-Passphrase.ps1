<#
.SYNOPSIS
    Генерирует стойкий пароль для входа в дашборд.

.DESCRIPTION
    Пароль печатается ТОЛЬКО в вашей консоли и никуда не отправляется.
    Не пересылайте его в переписке, чате или почте - там он перестанет быть
    секретом в тот же момент.

    Зачем нужен именно стойкий пароль. Шифротекст дашборда лежит в публичном
    репозитории, значит подбирать пароль можно офлайн, без ограничения попыток.
    600 000 итераций PBKDF2 замедляют перебор примерно до 3-10 тысяч попыток
    в секунду на хорошей видеокарте - и этого достаточно, чтобы словарный
    пароль вроде "qwerty11" пал за секунды. Против длинной случайной строки
    тот же перебор бесполезен.

    По умолчанию выдаётся 20 символов из 32-символьного алфавита без похожих
    знаков (без 0/O, 1/l/I) - около 100 бит энтропии. Группировка через дефисы
    сделана только для удобства набора и в стойкость не входит.

.PARAMETER Groups
    Сколько групп по 5 символов. По умолчанию 4, то есть 20 символов.

.PARAMETER Count
    Сколько вариантов показать, чтобы было из чего выбрать. По умолчанию 5.

.EXAMPLE
    .\New-Passphrase.ps1
#>
[CmdletBinding()]
param(
    [ValidateRange(3, 8)]
    [int]$Groups = 4,

    [ValidateRange(1, 20)]
    [int]$Count = 5
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Алфавит без визуально похожих символов: 0/O, 1/l/I, 5/S, 2/Z исключены,
# чтобы пароль нельзя было записать с ошибкой
$alphabet = 'abcdefghjkmnpqrstuvwxyz34679'.ToCharArray()

# Криптографический ГСЧ, а не Get-Random: последний не предназначен для секретов
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

function New-Secret {
    param([int]$GroupCount)

    $parts = @()
    for ($g = 0; $g -lt $GroupCount; $g++) {
        $chars = @()
        for ($i = 0; $i -lt 5; $i++) {
            # Отбраковка остатка: простой % по модулю сместил бы распределение
            # в сторону начала алфавита
            do {
                $b = New-Object byte[] 1
                $rng.GetBytes($b)
                $v = [int]$b[0]
            } while ($v -ge (256 - (256 % $alphabet.Length)))
            $chars += $alphabet[$v % $alphabet.Length]
        }
        $parts += (-join $chars)
    }
    return ($parts -join '-')
}

$bits = [math]::Round($Groups * 5 * [math]::Log($alphabet.Length, 2))

Write-Host ''
Write-Host "Варианты пароля ($($Groups * 5) символов, около $bits бит энтропии):" -ForegroundColor Cyan
Write-Host ''
for ($i = 1; $i -le $Count; $i++) {
    Write-Host ('  ' + (New-Secret -GroupCount $Groups)) -ForegroundColor Green
}
Write-Host ''
Write-Host 'Выберите один, сохраните в менеджере паролей и введите при запуске' -ForegroundColor Gray
Write-Host 'New-DashboardData.ps1. Пароль нигде не сохраняется: потеряете -' -ForegroundColor Gray
Write-Host 'файл данных придётся собрать заново.' -ForegroundColor Gray
Write-Host ''
Write-Host 'Не пересылайте пароль в переписке.' -ForegroundColor Yellow
Write-Host ''

$rng.Dispose()
