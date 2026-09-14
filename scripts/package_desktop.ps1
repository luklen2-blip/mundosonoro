$projectDir = "C:\Users\luciano\.gemini\antigravity\scratch\soundworld"
$desktop = [Environment]::GetFolderPath("Desktop")

Write-Host "Empacotando SoundWorld na Area de Trabalho..."

# 1. Gerar SoundWorld-Iniciar.bat
$batLines = @(
    "@echo off",
    "title SoundWorld / Mundo Sonoro",
    "cd /d `"$projectDir`"",
    "echo ========================================================",
    "echo   SOUNDWORLD / MUNDO SONORO (2 a 6 anos)",
    "echo   Ambiente Bilingue Infantil e Web Audio API",
    "echo ========================================================",
    "echo.",
    "echo Iniciando servidor local na porta 3000...",
    "start http://localhost:3000",
    "node server.js",
    "pause"
)
$batPath = Join-Path $desktop "SoundWorld-Iniciar.bat"
Set-Content -Path $batPath -Value $batLines -Encoding UTF8
Write-Host "Atalho BAT criado em: $batPath"

# 2. Gerar SoundWorld-deploy.zip
$zipPath = Join-Path $desktop "SoundWorld-deploy.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$tempZipDir = Join-Path $env:TEMP "soundworld_deploy_temp"
if (Test-Path $tempZipDir) {
    Remove-Item -Recurse -Force $tempZipDir
}
New-Item -ItemType Directory -Path $tempZipDir | Out-Null

Copy-Item "$projectDir\server.js" "$tempZipDir\"
Copy-Item "$projectDir\package.json" "$tempZipDir\"
Copy-Item "$projectDir\render.yaml" "$tempZipDir\"
Copy-Item "$projectDir\Dockerfile" "$tempZipDir\"
Copy-Item "$projectDir\.gitignore" "$tempZipDir\"
Copy-Item "$projectDir\.dockerignore" "$tempZipDir\"
Copy-Item -Recurse "$projectDir\public" "$tempZipDir\public"
Copy-Item -Recurse "$projectDir\tests" "$tempZipDir\tests"

Compress-Archive -Path "$tempZipDir\*" -DestinationPath $zipPath -Force
Remove-Item -Recurse -Force $tempZipDir

Write-Host "Pacote ZIP criado em: $zipPath"
