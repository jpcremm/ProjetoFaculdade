# Profit Brain Delivery 🍔

Sistema de pedidos e gestão para **Dark Kitchen** desenvolvido como projeto acadêmico.

---

## Estrutura do Projeto

```
projeto.faculdade/
├── index.html                    ← Ponto de entrada (redireciona para login)
├── login/                        ← Portal do cliente
│   ├── login.html
│   ├── login.css
│   └── login.js
├── cadastro/                     ← Criação de conta
│   ├── cadastro.html
│   ├── cadastro.css
│   └── cadastro.js
├── recuperar senha/              ← Recuperação de senha
│   ├── recuperar.html
│   ├── recuperar.css
│   └── recuperar.js
├── staff/                        ← Seleção de perfil (funcionários)
│   ├── staff.html
│   ├── staff.css
│   └── staff.js
├── cozinha/                      ← Kanban de pedidos
│   ├── cozinha.html
│   ├── cozinha.css
│   └── cozinha.js
└── entregador/                   ← Gestão de entregas
    ├── entregador.html
    ├── entregador.css
    └── entregador.js
```

---

## Como Executar

O projeto é composto por arquivos estáticos (HTML, CSS, JavaScript), então **não requer instalação de dependências**.

### Opção 1: Abrir diretamente no navegador

1. Navegue até a pasta `projeto.faculdade/`
2. Dê um **duplo clique** no arquivo `index.html`
3. O navegador abrirá automaticamente na tela de login

### Opção 2: Pelo VS Code (Live Server)

1. Instale a extensão **Live Server** no VS Code
2. Clique com o botão direito em `index.html`
3. Selecione **"Open with Live Server"**

## Fluxo de Navegação Corrigido

```
index.html
    ↓ (redireciona)
login/login.html
    ├── "Criar conta" → cadastro/cadastro.html
    ├── "Esqueci minha senha" → recuperar senha/recuperar.html
    └── "Fazer login como staff" → staff/staff.html

cadastro/cadastro.html
    └── "Voltar para login" / "Fazer login" → ../login/login.html

recuperar senha/recuperar.html
    └── "Fazer login" / "Voltar para login" → ../login/login.html
    └── "Criar conta" → ../cadastro/cadastro.html

staff/staff.html
    ├── "Voltar para login" → ../login/login.html
    ├── "Cozinha" → ../cozinha/cozinha.html
    └── "Entregador" → ../entregador/entregador.html

cozinha/cozinha.html
    └── "Sair (⇥)" → ../login/login.html

entregador/entregador.html
    └── "Sair (⇥)" → ../login/login.html
```

> **Nota:** O perfil "Gerente" ainda não possui página implementada, portanto exibe apenas um `alert()` como placeholder.

---

## Tecnologias

- HTML5 semântico + Acessibilidade (ARIA)
- CSS3 puro
- JavaScript Vanilla (ES5/ES6)
- Ícones SVG inline

---

## Status das Correções

Todas as navegações entre as páginas existentes foram corrigidas e estão funcionais. Não há links quebrados entre os módulos implementados.

