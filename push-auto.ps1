param(
    [Parameter(Mandatory=$true)]
    [string]$Mensagem,

    [Parameter(Mandatory=$false)]
    [string]$Pasta = "."
)

# ============================================================================
# ENVIA TODAS AS MUDANÇAS PARA O GITHUB (commit + push automático)
# Uso: .\push-auto.ps1 -Mensagem "sua mensagem aqui"
#      .\push-auto.ps1 -Mensagem "sua mensagem" -Pasta "C:\caminho\do\projeto"
# ============================================================================

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) não está instalado. Instale em: https://cli.github.com/"
    exit 1
}

$PastaCompleta = Resolve-Path $Pasta
if (-not (Test-Path $PastaCompleta)) {
    Write-Error "Pasta não encontrada: $Pasta"
    exit 1
}

Write-Host "Enviando mudanças de: $PastaCompleta" -ForegroundColor Gray

Push-Location $PastaCompleta
try {
    git add .
    git commit -m "$Mensagem"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no commit (talvez não haja mudanças para salvar?)."
        exit 1
    }

    git push
}
finally {
    Pop-Location
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Enviado para o GitHub com sucesso!" -ForegroundColor Green
} else {
    Write-Error "Falha ao enviar para o GitHub."
    exit 1
}