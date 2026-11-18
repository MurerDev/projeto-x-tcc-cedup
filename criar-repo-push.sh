#!/usr/bin/env bash
# ============================================================================
# CRIA REPOSITÓRIO NO GITHUB E ENVIA O CÓDIGO LOCAL AUTOMATICAMENTE
# Uso: ./criar-repo-push.sh nomedorepositorio          # público
#      ./criar-repo-push.sh nomedorepositorio private   # privado
#      ./criar-repo-push.sh nomedorepositorio public /caminho/do/projeto
# ============================================================================

set -e

if [ -z "$1" ]; then
    echo "Uso: $0 nomedorepositorio [public|private|internal] [pasta]"
    exit 1
fi

NOME="$1"
VISIBILIDADE="${2:-public}"
PASTA="${3:-.}"

if ! command -v gh &> /dev/null; then
    echo "Erro: GitHub CLI (gh) não está instalado. Instale em: https://cli.github.com/"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "Erro: Você não está logado no GitHub. Rode uma vez: gh auth login"
    exit 1
fi

if [[ "$VISIBILIDADE" != "public" && "$VISIBILIDADE" != "private" && "$VISIBILIDADE" != "internal" ]]; then
    echo "Erro: Visibilidade inválida. Use: public, private ou internal"
    exit 1
fi

# Converte para caminho absoluto
PASTA_COMPLETA=$(realpath "$PASTA" 2>/dev/null || readlink -f "$PASTA" 2>/dev/null || echo "$PASTA")
if [ ! -d "$PASTA_COMPLETA" ]; then
    echo "Erro: Pasta não encontrada: $PASTA"
    exit 1
fi

echo "Criando repositório '$NOME' ($VISIBILIDADE)..."
echo "Pasta do projeto: $PASTA_COMPLETA"

cd "$PASTA_COMPLETA"
gh repo create "$NOME" --"$VISIBILIDADE" --source=. --push

echo ""
echo "Concluído!"
USUARIO=$(gh api user -q .login 2>/dev/null)
echo "Repositório: https://github.com/$USUARIO/$NOME"