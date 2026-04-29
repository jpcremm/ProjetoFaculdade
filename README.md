# Profit Brain Delivery 🍔🚀

**Sistema completo de delivery e gestão de Dark Kitchen** desenvolvido como projeto acadêmico. Funciona 100% offline com fallbacks e integra com Firebase para dados em tempo real.

---

## 🎯 **Visão Geral**

Aplicação web **full-stack frontend** para:
- **Clientes**: Cardápio → Carrinho → Pedido + histórico.
- **Staff**: Painéis role-based (Cozinha, Entregador, Gerente).

**Zero dependências** – abre direto no navegador!

---

## 📁 **Estrutura do Projeto**

```
projeto.faculdade/
├── index.html                 # Auto-redirect → login
├── README.md                  # Este arquivo!
├── src/
│   ├── firebase/              # Config + Auth/DB services
│   │   ├── firebase-config.js
│   │   ├── auth-service.js
│   │   └── db-service.js
│   └── utils/
│       └── validators.js
├── login/                     # Autenticação cliente
│   ├── login.{html,css,js}
├── cadastro/                  # Registro usuário
│   ├── cadastro.{html,css,js}
├── recuperar senha/           # Reset senha
│   ├── recuperar.{html,css,js}
├── cardapio/                  # Menu de pratos
│   ├── cardapio.{html,css,js}
├── carrinho/                  # Carrinho compras
│   ├── carrinho.{html,css,js}
├── cdp/                       # Confirmação pedido
│   ├── cdp.{html,css,js}
├── staff/                     # Seleção staff roles
│   ├── staff.{html,css,js}
├── cozinha/                   # Kanban pedidos cozinha
│   ├── cozinha.{html,css,js}
├── entregador/                # Gestão entregas
│   ├── entregador.{html,css,js}
├── gerente/                   # Dashboard gerente (placeholder)
│   ├── gerente.{html,css,js}
├── historicopedido/           # Histórico pedidos (mock + ready)
│   ├── historicopedido.{html,css,js}
└── ... (veja lista completa)
```

---

## 🚀 **Como Executar**

### **1. Direto no Navegador (Zero Setup)**
```
Duplo-clique em projeto.faculdade/index.html
```
✅ Abre login automaticamente.

### **2. VS Code + Live Server (Recomendado)**
1. Instale extensão **Live Server**.
2. Botão direito em `index.html` → **Open with Live Server**.

---

## 🧭 **Fluxos de Uso**

### **Cliente**
```
index.html → login/
         ↓ (login/convidado)
    cardapio/ → carrinho/ → cdp/
         ↓ (opcional)
historicopedido/
```

### **Staff** (de login/staff/)
```
staff/ → [cozinha/ | entregador/ | gerente/ ]
         ↓ (logout)
      login/
```

**Teclas**: `⇥` (Tab) + Enter pra sair rápido.

---

## ✨ **Funcionalidades**

| Role | Features |
|------|----------|
| **Cliente** | Cardápio interativo, carrinho persistente, pedido c/ toasts, histórico mock/Firebase-ready, auth anônimo. |
| **Cozinha** | Kanban real-time (pendente/pronto), timers, update status. |
| **Entregador** | Lista prontos/rota/entregues, ligar cliente, mover status, histórico entregas. |
| **Gerente** | Placeholder (alert) – pronto pra dashboard/analytics. |

---

## 🛠️ **Tech Stack**

- **Frontend**: HTML5 semântico, CSS3 Flex/Grid, Vanilla JS ES6.
- **Utils**: Validators, toasts custom.
- **Design**: Google Fonts (Sora), SVGs inline, responsive mobile-first.

**Sem Node/NPM** – puro static hosting ready (Netlify/GitHub Pages).

---

## 📊 **Status & Próximos Passos**

✅ **Concluído**:
- Todos fluxos navegáveis.

