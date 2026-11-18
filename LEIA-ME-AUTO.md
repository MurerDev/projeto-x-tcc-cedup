# 🚀 Scripts automáticos para GitHub

Esses scripts criam repositórios e enviam código para o seu GitHub sem você precisar digitar comandos longos.

## Pré-requisito (faça apenas uma vez)

1. Instale o [GitHub CLI](https://cli.github.com/)
2. Abra o terminal e rode:
   ```powershell
   gh auth login
   ```
   Siga as instruções (escolha HTTPS e faça login pelo navegador ou token).

Depois disso, você nunca mais precisa digitar senha.

---

## Como usar

Abra o terminal dentro da pasta `C:\Users\User\Documents\Projeto Padrão`.

### 1) Criar um repositório novo e enviar todo o código

**PowerShell:**
```powershell
.\criar-repo-push.ps1 -Nome nomedoseurepositorio
.\criar-repo-push.ps1 -Nome nomedoseurepositorio -Visibilidade private
```

**Git Bash:**
```bash
./criar-repo-push.sh nomedoseurepositorio        # público
./criar-repo-push.sh nomedoseurepositorio private # privado
```

O link do repositório aparece no terminal ao terminar.

---

### 2) Enviar mudanças que você já fez (atualizar o GitHub)

Depois de editar arquivos aqui, rode:

**PowerShell:**
```powershell
.\push-auto.ps1 -Mensagem "descreva o que mudou"
```

**Git Bash:**
```bash
./push-auto.sh "descreva o que mudou"
```

Isso faz `git add .`, `git commit` e `git push` de uma vez.

---

## O que cada script faz

| Script | O que faz |
|--------|-----------|
| `criar-repo-push.ps1` / `.sh` | Cria o repositório no GitHub e envia o código da pasta atual |
| `push-auto.ps1` / `.sh` | Salva e envia todas as mudanças para o repositório que já existe |

---

## Dica

Se quiser que eu adicione algo (ex: `.gitignore`, branch `main`, SSH, etc.), é só me dizer.