param(
    [Parameter(Mandatory=$true)]
    [string]$Nome,

    [Parameter(Mandatory=$false)]
    [string]$Visibilidade = "public",

    [Parameter(Mandatory=$false)]
    [string]$Pasta = "."
)

# ============================================================================
# CRIA REPOSITÓRIO NO GITHUB E ENVIA O CÓDIGO LOCAL AUTOMATICAMENTE
# Uso: .\criar-repo-push.ps1 -Nome nomedorepositorio
#      .\criar-repo-push.ps1 -Nome nomedorepositorio -Visibilidade private
#      .\criar-repo-push.ps1 -Nome nomedorepositorio -Pasta "C:\caminho\do\projeto"
# ============================================================================

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) não está instalado. Instale em: https://cli.github.com/"
    exit 1
}

$auth = gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Você não está logado no GitHub. Rode uma vez: gh auth login"
    exit 1
}

if ($Visibilidade -notin @("public","private","internal")) {
    Write-Error "Visibilidade inválida. Use: public, private ou internal"
    exit 1
}

# Converte para caminho absoluto
$PastaCompleta = Resolve-Path $Pasta
if (-not (Test-Path $PastaCompleta)) {
    Write-Error "Pasta não encontrada: $Pasta"
    exit 1
}

$flag = switch ($Visibilidade) {
    "private" { "--private" }
    "internal" { "--internal" }
    default { "--public" }
}

Write-Host "Criando repositório '$Nome' ($Visibilidade)..." -ForegroundColor Cyan
Write-Host "Pasta do projeto: $PastaCompleta" -ForegroundColor Gray

# Entra na pasta do projeto e roda o gh
Push-Location $PastaCompleta
try {
    gh repo create $Nome $flag --source=. --push
}
finally {
    Pop-Location
}

if ($LASTEXITCODE -eq 0) {
    $usuario = (gh api user -q .login 2>$null)
    Write-Host "Concluído!" -ForegroundColor Green
    Write-Host "Repositório: https://github.com/$usuario/$Nome" -ForegroundColor Cyan
} else {
    Write-Error "Falha ao criar/enviar o repositório."
    exit 1
}