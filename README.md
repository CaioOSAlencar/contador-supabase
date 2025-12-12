# 🌍 Contador Global de Cliques

Um contador de cliques global em tempo real onde cada usuário que clica no botão incrementa o contador para **todos** os visitantes simultaneamente! O projeto usa React, TypeScript, Vite e Supabase com Realtime Database.

## 🚀 Demonstração

Cada pessoa que acessa o site e clica no botão aumenta o contador instantaneamente para todos os usuários conectados ao redor do mundo!

## 💻 Tecnologias Utilizadas

- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool ultra rápida
- **Supabase** - Backend as a Service (BaaS)
  - Realtime Database
  - PostgreSQL
  - Realtime Subscriptions

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Conta no [Supabase](https://supabase.com) (gratuita)

## ⚙️ Configuração do Supabase

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Preencha os dados do projeto

### 2. Criar a tabela no banco de dados

Execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela
CREATE TABLE global_clicks (
  id BIGINT PRIMARY KEY,
  total BIGINT NOT NULL DEFAULT 0
);

-- Inserir registro inicial
INSERT INTO global_clicks (id, total) VALUES (1, 0);

-- Habilitar Row Level Security (RLS)
ALTER TABLE global_clicks ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT para todos
CREATE POLICY "Allow public read access" 
ON global_clicks FOR SELECT 
TO public 
USING (true);

-- Política para permitir UPDATE para todos
CREATE POLICY "Allow public update access" 
ON global_clicks FOR UPDATE 
TO public 
USING (true);
```

### 3. Habilitar Realtime

1. No Supabase, vá em **Database > Replication**
2. Procure a tabela `global_clicks`
3. Ative a opção **Realtime**

### 4. Obter as credenciais

1. Vá em **Settings > API**
2. Copie:
   - `Project URL` (URL do projeto)
   - `anon/public` key (chave pública)

## 🔧 Instalação e Execução Local

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/contador-supabase.git
cd contador-supabase/contador-global
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `contador-global`:

```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-publica-do-supabase
```

### 4. Execute o projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

## 🌐 Deploy no GitHub Pages

### 1. Instale o gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Adicione os scripts no `package.json`

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://seu-usuario.github.io/contador-supabase"
}
```

### 3. Faça o deploy

```bash
npm run deploy
```

### 4. Configure o GitHub Pages

1. Vá em **Settings > Pages** no seu repositório
2. Em **Source**, selecione a branch `gh-pages`
3. Aguarde alguns minutos

**⚠️ IMPORTANTE:** As variáveis de ambiente são incorporadas no build. Se você atualizar as credenciais do Supabase, precisará fazer um novo build e deploy.

## 📁 Estrutura do Projeto

```
contador-global/
├── src/
│   ├── App.tsx          # Componente principal com lógica do contador
│   ├── App.css          # Estilos do App
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── public/              # Arquivos estáticos
├── .env                 # Variáveis de ambiente (não commitar!)
├── package.json         # Dependências
├── vite.config.ts       # Configuração do Vite
└── tsconfig.json        # Configuração do TypeScript
```

## 🔒 Segurança

- O arquivo `.env` **NÃO deve ser commitado** no Git
- Adicione `.env` no `.gitignore`
- A chave `anon/public` do Supabase é segura para exposição pública
- Use Row Level Security (RLS) no Supabase para proteger seus dados

## 🤝 Como Funciona

1. **Conexão com Supabase**: O app se conecta ao banco de dados usando as credenciais
2. **Leitura Inicial**: Ao carregar, busca o valor atual do contador
3. **Realtime Subscription**: Assina as mudanças na tabela `global_clicks`
4. **Incremento**: Quando alguém clica, o valor é incrementado no banco
5. **Atualização Automática**: Todos os usuários conectados veem a mudança instantaneamente
