# Сборка статичных страниц мероприятий из js/events.js.
# Запуск из папки сайта:  powershell -ExecutionPolicy Bypass -File tools\build-events.ps1 [-Version 11191200]
# Пишет event-<id>.html для каждого материала и подставляет статичные карточки в events.html.
param([string]$Version = (Get-Date -Format 'MMddHHmm'))

$root = Split-Path -Parent $PSScriptRoot
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$gen = 'file:///' + ($root -replace '\\', '/') + '/tools/build-events.html?v=' + $Version

$dom = & $chrome --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=10000 --dump-dom $gen 2>$null | Out-String
$m = [regex]::Match($dom, '<pre id="out">([\s\S]*?)</pre>')
if (-not $m.Success) { throw 'Генератор не вернул данные' }
$data = [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) | ConvertFrom-Json

$utf8 = New-Object System.Text.UTF8Encoding($false)
# удалить устаревшие страницы материалов
Get-ChildItem $root -Filter 'event-*.html' | Remove-Item
foreach ($p in $data.files.PSObject.Properties) {
  [IO.File]::WriteAllText((Join-Path $root $p.Name), $p.Value, $utf8)
  "  $($p.Name)"
}

# статичные карточки в список
$evPath = Join-Path $root 'events.html'
$ev = [IO.File]::ReadAllText($evPath, $utf8)
$new = [regex]::Replace($ev, '(<div class="ngrid" data-events-list>)[\s\S]*?(</div>\s*\n\s*<p class="listing__note">)', {
  param($mm) $mm.Groups[1].Value + "`n        " + $data.list + "`n      " + $mm.Groups[2].Value
})
if ($new -eq $ev -and $ev -notmatch [regex]::Escape($data.list)) { throw 'Не нашёл список в events.html' }
[IO.File]::WriteAllText($evPath, $new, $utf8)
"  events.html: карточки обновлены (v=$Version)"
