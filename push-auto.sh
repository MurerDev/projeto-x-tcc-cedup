#!/usr/bin/env bash
# ============================================================================
# ENVIA TODAS AS MUDANÇAS PARA O GITHUB (commit + push automático)
# Uso: ./push-auto.sh "sua mensagem aqui"
#      ./push-auto.sh "sua mensagem aqui" /caminho/do/projeto
# ============================================================================

set -e

if [ -z "$1" ]; then
    echo "Uso: $0 \"sua mensagem de commit\" [pasta]"
    exit 1
fi

MENSAGEM="$1"
PASTA="${2:-.}"

if ! command -v gh &> /dev/null; then
    echo "Erro: GitHub CLI (gh) não está instalado. Instale em: https://cli.github.com/"
    exit 1
fi

# Converte para caminho absoluto
PASTA_COMPLETA=$(realpath "$PASTA" 2>/dev/null || readlink -f "$PASTA" 2>/dev/null || echo "$PASTA")
if [ ! -d "$PASTA_COMPLETA" ]; then
    echo "Erro: Pasta não encontrada: $PASTA"
    exit 1
fi

echo "Enviando mudanças de: $PASTA_COMPLETA"

cd "$PASTA_COMPLETA"
git add .
git commit -m "$MENSAGEM"

if [ $? -ne 0 ]; then
    echo "Erro: Falha no commit (talvez não haja mudanças para salvar?)."
    exit 1
fi

git push

echo "Enviado para o GitHub com sucesso!"