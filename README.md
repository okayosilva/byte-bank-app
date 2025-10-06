# 💰 Byte Bank App

Um aplicativo mobile moderno de gerenciamento financeiro pessoal desenvolvido com React Native e Expo, oferecendo uma experiência intuitiva e completa para controle de receitas e despesas.

> **📢 Tech Challenge - FIAP**  
> Este projeto foi desenvolvido como parte do Tech Challenge da FIAP. O banco de dados foi migrado para o Supabase, seguindo as orientações detalhadas neste tópico do Discord: [@Discord - Tech Challenge](https://discord.com/channels/1255291574045376644/1405341177435259023)

## 📋 Índice

- [Tech Challenge - Mapeamento de Requisitos](#-tech-challenge---mapeamento-de-requisitos)
- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Arquitetura](#-arquitetura)
- [Banco de Dados](#-banco-de-dados)
- [Vídeo Demonstrativo](#-vídeo-demonstrativo)

## 🎯 Visão Geral

O **Byte Bank App** é uma solução completa para gerenciamento financeiro pessoal que permite aos usuários:

- Registrar receitas e despesas
- Categorizar transações
- Visualizar gráficos e estatísticas
- Anexar comprovantes às transações
- Acompanhar evolução financeira ao longo do tempo

O aplicativo foi construído com foco em **escalabilidade**, **manutenibilidade** e **experiência do usuário**, utilizando as melhores práticas de desenvolvimento mobile.

## 🎓 Tech Challenge - Mapeamento de Requisitos

Este projeto atende a todos os requisitos do Tech Challenge da FIAP.

### ✅ Requisitos Atendidos

#### 1. Tela Principal (Dashboard) - `src/screens/dashboard/index.tsx`

- ✅ **Gráficos e Análises Financeiras**
  - Gráfico de linha mostrando evolução dos últimos 6 meses (receitas vs despesas)
  - Gráfico de pizza exibindo despesas por categoria
  - Cards com totais de receitas, despesas e saldo
  - Estatísticas gerais (total de transações, média de despesas, média de receitas)
- ✅ **Animações para Transições**
  - Implementado com React Native Reanimated (`~4.1.1`)
  - Custom hook `useAnimatedView` para fade in/out
  - Transições suaves entre seções do dashboard
  - **Código**: `src/utils/hooks/useAnimatedView.tsx`

#### 2. Tela de Listagem de Transações - `src/screens/home/index.tsx`

- ✅ **Visualização de Lista com Filtros Avançados**
  - Filtro por data (período inicial e final)
  - Filtro por categoria
  - Filtro por tipo (receita/despesa)
  - Busca por texto (descrição) com debounce
  - Ordenação por data ou valor
  - **Código**: `src/components/filterTransactions.tsx`

- ✅ **Scroll Infinito e Paginação**
  - Paginação de 10 transações por página
  - Infinite scroll com `onEndReached`
  - Indicador de carregamento ("Carregando mais transações...")
  - Pull to refresh para atualizar dados
  - Otimizações de performance (memo, callbacks, windowSize)
  - **Código**: Linhas 156-190 em `src/screens/home/index.tsx`

- ✅ **Integração com Cloud (Supabase)**
  - Substituição do Firebase Firestore por Supabase PostgreSQL
  - Queries otimizadas com índices
  - Filtros aplicados no servidor
  - Row Level Security (RLS) para isolamento de dados
  - **Código**: `src/context/transaction.context.tsx` (linhas 204-277)

#### 3. Tela de Adicionar/Editar Transação

- ✅ **Adicionar Novas Transações**
  - Modal bottom sheet com formulário completo
  - Seleção de tipo (receita/despesa)
  - Seleção de categoria
  - Input de valor com formatação monetária (R$)
  - Campo de descrição
  - **Código**: `src/components/transactions/newTransaction.tsx`

- ✅ **Editar Transações Existentes**
  - Swipe para esquerda na lista de transações
  - Formulário pré-preenchido com dados atuais
  - Validação dos campos editados
  - **Código**: `src/screens/home/transactionCardList/leftAction/editTransactionForm/`

- ✅ **Validação Avançada de Campos**
  - Schema de validação com Yup (`^1.7.1`)
  - Validação de valor obrigatório e maior que zero
  - Validação de categoria obrigatória
  - Validação de descrição obrigatória
  - Mensagens de erro em português
  - Validação em tempo real
  - **Código**: `src/components/transactions/schema/newTransition-schema.ts`

- ✅ **Upload de Recibos/Documentos**
  - Substituição do Firebase Storage por Supabase Storage
  - Seleção de imagem da galeria ou câmera
  - Upload para bucket `receipts` no Supabase
  - Estrutura organizada: `{user_id}/{timestamp}.{ext}`
  - Formatos aceitos: jpg, jpeg, png, gif, webp, bmp
  - Conversão base64 para array buffer
  - Visualização de comprovante anexado
  - Exclusão de comprovante ao deletar transação
  - **Código**: `src/context/transaction.context.tsx` (linhas 92-164)

### 🛠️ Tecnologias e Conceitos Utilizados

#### React Native com Expo ✅

- **React Native** `0.81.4` - Framework mobile multiplataforma
- **Expo** `~54.0.12` - Plataforma de desenvolvimento acelerado
- **TypeScript** `~5.9.2` - Tipagem estática para maior segurança
- Otimização de performance com `memo`, `useCallback`, `useMemo`
- Lazy loading e code splitting

#### Gerenciamento de Estado com Context API ✅

- **Auth Context** (`src/context/auth.context.tsx`)
  - Gerenciamento de autenticação
  - Sessão persistente com AsyncStorage
  - Login, signup, logout
  - Reenvio de email de confirmação
- **Transaction Context** (`src/context/transaction.context.tsx`)
  - Estado global das transações
  - CRUD completo
  - Upload de comprovantes
  - Cálculo de totais
- **Snackbar Context** (`src/context/snackbar.context.tsx`)
  - Notificações globais
  - Feedback de sucesso/erro
- **BottomSheet Context** (`src/context/bottomSheet.context.tsx`)
  - Controle de modais
  - Gerenciamento de formulários

#### Navegação ✅

- **React Navigation** `^7.1.17`
- Bottom Tabs Navigator (Home e Dashboard)
- Stack Navigator (Login e Signup)
- Proteção de rotas baseada em autenticação
- **Código**: `src/routes/`

#### Cloud Backend (Supabase) ✅

**Substituição do Firebase pelo Supabase:**

- ✅ **Authentication** (Firebase Auth → Supabase Auth)
  - JWT com refresh token
  - Email/senha com confirmação
  - Recuperação de senha
- ✅ **Database** (Firestore → Supabase PostgreSQL)
  - Queries SQL otimizadas
  - Índices para melhor performance
  - Row Level Security (RLS)
  - Soft delete com `deleted_at`
- ✅ **Storage** (Firebase Storage → Supabase Storage)
  - Bucket `receipts` para comprovantes
  - Políticas de segurança por usuário
  - URLs públicas para visualização

#### Animações e UI/UX ✅

- **React Native Reanimated** `~4.1.1` - Animações de alta performance
- **@gorhom/bottom-sheet** `^5.2.6` - Bottom sheets nativos
- **NativeWind** `^4.2.1` - TailwindCSS para React Native
- Feedback visual em todas as ações
- Loading states e empty states

#### Validação de Formulários ✅

- **React Hook Form** `^7.64.0` - Gerenciamento eficiente de forms
- **Yup** `^1.7.1` - Schemas de validação
- Validação em tempo real
- Mensagens de erro customizadas

#### Gráficos e Visualização ✅

- **React Native Chart Kit** `^6.12.0`
- LineChart para evolução temporal
- PieChart para distribuição por categoria
- Paleta de cores acessível

### 📦 Estrutura de Entrega Completa

#### ✅ Código Fonte

- Repositório Git com código organizado e comentado
- README completo com instruções de configuração
- Scripts de SQL para setup do Supabase
- Configuração de ambiente documentada
- Estrutura de pastas modular e escalável

#### 📹 Vídeo Demonstrativo (Ver seção abaixo)

Vídeo de até 5 minutos demonstrando:

- Login e autenticação
- Adicionar/Editar transações
- Visualizar e filtrar transações
- Upload de anexos (comprovantes)
- Integração com Supabase (substituindo Firebase)
- Dashboard com gráficos

### 🔄 Diferencial: Firebase → Supabase

Este projeto utiliza **Supabase** ao invés de Firebase, oferecendo vantagens como:

- ✅ **PostgreSQL** ao invés de NoSQL - Queries mais poderosas e relacionais
- ✅ **Row Level Security (RLS)** - Segurança a nível de linha nativa
- ✅ **SQL Queries** - Maior flexibilidade para filtros complexos
- ✅ **Open Source** - Sem vendor lock-in
- ✅ **Mesmas funcionalidades** - Auth, Database, Storage, Real-time
- ✅ **Melhor performance** - Índices e otimizações SQL

## 🚀 Tecnologias

### Core

- **React Native** `0.81.4` - Framework para desenvolvimento mobile multiplataforma
- **Expo** `~54.0.12` - Plataforma para desenvolvimento React Native
- **TypeScript** `~5.9.2` - Superset JavaScript com tipagem estática

### Navegação

- **React Navigation** `^7.1.17` - Biblioteca de navegação
  - Bottom Tabs Navigator - Navegação por abas
  - Stack Navigator - Navegação em pilha

### Backend & Autenticação

- **Supabase** `^2.58.0` - Backend as a Service (BaaS)
  - Autenticação de usuários
  - Banco de dados PostgreSQL
  - Storage para arquivos
  - Real-time subscriptions

### Gerenciamento de Estado

- **React Context API** - Gerenciamento de estado global
  - Auth Context - Autenticação
  - Transaction Context - Transações
  - Snackbar Context - Notificações
  - BottomSheet Context - Modais

### Formulários & Validação

- **React Hook Form** `^7.64.0` - Gerenciamento de formulários
- **Yup** `^1.7.1` - Validação de schemas
- **@hookform/resolvers** `^5.2.2` - Integração entre RHF e Yup

### UI & Estilização

- **NativeWind** `^4.2.1` - TailwindCSS para React Native
- **TailwindCSS** `^3.4.17` - Framework CSS utility-first
- **React Native Reanimated** `~4.1.1` - Animações de alta performance
- **@gorhom/bottom-sheet** `^5.2.6` - Bottom sheets nativos

### Gráficos & Visualização

- **React Native Chart Kit** `^6.12.0` - Biblioteca de gráficos
  - LineChart - Gráficos de linha
  - PieChart - Gráficos de pizza

### Componentes & Utilitários

- **@expo/vector-icons** `^15.0.2` - Ícones (MaterialIcons)
- **date-fns** `^4.1.0` - Manipulação de datas
- **clsx** `^2.1.1` - Utilitário para classes CSS
- **expo-image-picker** `^17.0.8` - Seleção de imagens
- **expo-file-system** `^19.0.16` - Sistema de arquivos
- **react-native-currency-input** `^1.1.1` - Input de moeda formatado

### Armazenamento & Persistência

- **@react-native-async-storage/async-storage** `2.2.0` - Armazenamento local
- **base64-arraybuffer** `^1.0.2` - Conversão de arquivos

### Qualidade de Código

- **Prettier** com plugin Tailwind - Formatação de código
- **ESLint** - Análise estática de código

## ✨ Funcionalidades

### 🔐 Autenticação

- **Cadastro de usuários** com validação de email e senha
- **Login seguro** com sessão persistente
- **Recuperação de senha** via email
- **Reenvio de email de confirmação**
- **Logout** com limpeza de sessão
- **Proteção de rotas** privadas

### 💳 Gerenciamento de Transações

- **Criar transações** de receita ou despesa
- **Editar transações** existentes
- **Excluir transações** com confirmação
- **Categorização** por tipo (Alimentação, Transporte, Saúde, etc.)
- **Descrição detalhada** de cada transação
- **Valor monetário** com formatação brasileira (R$)
- **Upload de comprovantes** (imagens)
- **Visualização de comprovantes** anexados

### 🔍 Busca e Filtros

- **Busca por texto** com debounce para performance
- **Filtro por categoria** de transação
- **Filtro por tipo** (receita/despesa)
- **Filtro por período** (data inicial e final)
- **Ordenação** por data ou valor
- **Limpar filtros** rapidamente

### 📊 Dashboard & Estatísticas

- **Saldo total** (receitas - despesas)
- **Total de receitas** acumuladas
- **Total de despesas** acumuladas
- **Gráfico de evolução** dos últimos 6 meses
  - Linha de receitas
  - Linha de despesas
- **Gráfico de pizza** - Despesas por categoria
- **Estatísticas gerais**:
  - Total de transações
  - Média de despesas
  - Média de receitas

### 📱 Lista de Transações

- **Listagem paginada** com infinite scroll
- **Pull to refresh** para atualizar dados
- **Swipe actions**:
  - Swipe para esquerda: Editar transação
  - Swipe para direita: Excluir transação
- **Indicadores visuais** de tipo (receita/despesa)
- **Exibição de categoria** e data
- **Formatação de valores** em reais

### 🎨 Interface & UX

- **Design moderno** e intuitivo
- **Animações fluidas** com Reanimated
- **Feedback visual** para ações do usuário
- **Notificações** (Snackbar) para sucesso/erro
- **Bottom sheets** para formulários e filtros
- **Loading states** para operações assíncronas
- **Empty states** informativos
- **Teclado responsivo** com dismiss ao scroll

### 📂 Funcionalidades Técnicas

- **Paginação** de transações (10 por página)
- **Cache de imagens** para performance
- **Compressão de imagens** antes do upload
- **Lazy loading** de componentes
- **Memoização** para otimização de renders
- **Validação em tempo real** de formulários
- **Gestão de erros** centralizada
- **Sistema de tipos** completo com TypeScript

## 📁 Estrutura do Projeto

```
byte-bank-app/
├── src/
│   ├── assets/              # Imagens e recursos estáticos
│   │   └── logo.png
│   │
│   ├── components/          # Componentes reutilizáveis
│   │   ├── animatedView.tsx
│   │   ├── appHeader.tsx
│   │   ├── authHeader.tsx
│   │   ├── button.tsx
│   │   ├── buttonCircle.tsx
│   │   ├── checkbox.tsx
│   │   ├── confirmationModal.tsx
│   │   ├── dateInput.tsx
│   │   ├── dismissKeyboardView.tsx
│   │   ├── filterTransactions.tsx
│   │   ├── input.tsx
│   │   ├── loading.tsx
│   │   ├── receiptPicker.tsx
│   │   ├── searchBar.tsx
│   │   ├── snackBar.tsx
│   │   └── transactions/
│   │       ├── buttonIconSelect.tsx
│   │       ├── errorMessage.tsx
│   │       ├── newTransaction.tsx
│   │       ├── selectTransaction.tsx
│   │       ├── modal/
│   │       │   └── selectModalCategory.tsx
│   │       └── schema/
│   │           └── newTransition-schema.ts
│   │
│   ├── context/             # Contextos globais
│   │   ├── auth.context.tsx           # Autenticação
│   │   ├── bottomSheet.context.tsx    # Bottom sheets
│   │   ├── snackbar.context.tsx       # Notificações
│   │   └── transaction.context.tsx    # Transações
│   │
│   ├── lib/                 # Configurações de bibliotecas
│   │   └── supabase.ts      # Cliente Supabase
│   │
│   ├── routes/              # Navegação
│   │   ├── index.tsx        # Router principal
│   │   └── stack/
│   │       ├── privateStacks.tsx  # Rotas privadas (Bottom Tabs)
│   │       └── publicStacks.tsx   # Rotas públicas (Login/Signup)
│   │
│   ├── screens/             # Telas da aplicação
│   │   ├── dashboard/
│   │   │   └── index.tsx    # Dashboard com gráficos
│   │   ├── home/
│   │   │   ├── index.tsx    # Lista de transações
│   │   │   ├── list/
│   │   │   │   ├── listHeader.tsx
│   │   │   │   └── transactionCard/
│   │   │   │       └── index.tsx
│   │   │   └── transactionCardList/
│   │   │       ├── index.tsx
│   │   │       ├── leftAction/      # Swipe esquerda (editar)
│   │   │       │   ├── index.tsx
│   │   │       │   └── editTransactionForm/
│   │   │       │       ├── index.tsx
│   │   │       │       └── schema.ts
│   │   │       └── rightAction/     # Swipe direita (excluir)
│   │   │           ├── index.tsx
│   │   │           └── deleteModal.tsx
│   │   ├── loading/
│   │   │   └── index.tsx    # Tela de loading
│   │   ├── login/
│   │   │   ├── index.tsx
│   │   │   └── loginForm/
│   │   │       ├── index.tsx
│   │   │       └── schema.ts
│   │   └── signup/
│   │       ├── index.tsx
│   │       └── signupForm/
│   │           ├── index.tsx
│   │           └── schema.ts
│   │
│   ├── styles/              # Estilos globais
│   │   └── global.css       # Estilos Tailwind
│   │
│   ├── theme/               # Tema da aplicação
│   │   └── colors.ts        # Paleta de cores
│   │
│   ├── types/               # Definições de tipos
│   │   ├── enum.ts
│   │   └── transactions.ts  # Tipos de transações
│   │
│   └── utils/               # Utilitários
│       ├── constants/
│       │   └── supabase.ts  # Constantes Supabase
│       ├── hooks/
│       │   ├── useAnimatedView.tsx
│       │   ├── useInfiniteScroll.tsx
│       │   └── useKeyboardVisible.tsx
│       └── reanimated.config.ts
│
├── android/                 # Projeto Android nativo
├── assets/                  # Assets do Expo
├── App.tsx                  # Componente raiz
├── app.json                 # Configuração do Expo
├── babel.config.js          # Configuração Babel
├── index.ts                 # Entry point
├── metro.config.js          # Configuração Metro bundler
├── nativewind-env.d.ts      # Tipos NativeWind
├── package.json             # Dependências
├── tailwind.config.js       # Configuração Tailwind
└── tsconfig.json            # Configuração TypeScript
```

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Conta no Supabase** (gratuita)
- Para Android: **Android Studio** com SDK configurado
- Para iOS: **Xcode** (apenas macOS)

## 📦 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/byte-bank-app.git
cd byte-bank-app
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

## ⚙️ Configuração

> **⚠️ IMPORTANTE**: As keys do banco de dados Supabase serão fornecidas pela equipe. Você só precisa adicioná-las no arquivo `src/utils/constants/supabase.ts` conforme as instruções na seção [Configuração](#%EF%B8%8F-configuração). Não é necessário criar uma conta no Supabase, apenas adicionar as credenciais fornecidas.

### 1. Configurar Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Acesse as configurações do projeto e copie:
   - URL do projeto
   - Anon key (chave pública)

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `src/utils/constants/supabase.ts` com o seguinte conteúdo:

```typescript
export const EXPO_PUBLIC_SUPABASE_URL = "sua-url-do-supabase";
export const EXPO_PUBLIC_SUPABASE_ANON_KEY = "sua-anon-key";
```

### 3. Configurar Banco de Dados

Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Criar tabela de categorias de transações
CREATE TABLE transaction_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO transaction_categories (name) VALUES
  ('Alimentação'),
  ('Transporte'),
  ('Saúde'),
  ('Educação'),
  ('Lazer'),
  ('Moradia'),
  ('Outros');

-- Criar tabela de transações
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type_id INTEGER NOT NULL CHECK (type_id IN (1, 2)), -- 1: Receita, 2: Despesa
  category_id INTEGER REFERENCES transaction_categories(id),
  value INTEGER NOT NULL, -- Valor em centavos
  description TEXT NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type_id ON transactions(type_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança - usuários só veem suas próprias transações
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. Configurar Storage

1. No painel do Supabase, vá em **Storage**
2. Crie um novo bucket chamado `receipts`
3. Configure as políticas de acesso:

```sql
-- Permitir upload de arquivos
CREATE POLICY "Users can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permitir visualização de arquivos
CREATE POLICY "Users can view own receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permitir exclusão de arquivos
CREATE POLICY "Users can delete own receipts"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 🏃 Executando o Projeto

> **⚠️ IMPORTANTE**: As keys do banco de dados Supabase serão fornecidas pela equipe. Você só precisa adicioná-las no arquivo `src/utils/constants/supabase.ts` conforme as instruções na seção [Configuração](#%EF%B8%8F-configuração). Não é necessário criar uma conta no Supabase, apenas adicionar as credenciais fornecidas.

### Desenvolvimento (Expo Go)

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Ou para Android
npm run android

# Ou para iOS (apenas macOS)
npm run ios

# Ou para web
npm run web
```

### Build de Produção

#### Android

```bash
# Build local
npx expo run:android --variant release

# Build com EAS (Expo Application Services)
eas build --platform android
```

#### iOS

```bash
# Build local (apenas macOS)
npx expo run:ios --configuration Release

# Build com EAS
eas build --platform ios
```

## 🏗️ Arquitetura

### Padrões de Design

- **Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável
- **Composition Pattern** - Composição de componentes
- **Separation of Concerns** - Separação de responsabilidades

### Fluxo de Dados

```
User Action → Component → Context → API (Supabase) → Context → Component → UI Update
```

### Autenticação

```
App → Router → AuthContext
                   ↓
              isAuthenticated?
                   ↓
           Yes          No
            ↓            ↓
      PrivateStack  PublicStack
      (Home/Dashboard) (Login/Signup)
```

### Gerenciamento de Transações

1. **Criação**: `NewTransaction` → `TransactionContext` → `Supabase`
2. **Listagem**: `Home` → `TransactionContext` → `Supabase` → Cache
3. **Edição**: `EditForm` → `TransactionContext` → `Supabase` → Refresh
4. **Exclusão**: `DeleteModal` → `TransactionContext` → `Supabase` → Refresh

## 🗄️ Banco de Dados

### Tabelas

#### `auth.users` (Supabase Auth)

- Gerenciamento de usuários e autenticação
- Email, senha (hash), metadata

#### `transaction_categories`

| Campo      | Tipo         | Descrição             |
| ---------- | ------------ | --------------------- |
| id         | SERIAL       | ID único da categoria |
| name       | VARCHAR(100) | Nome da categoria     |
| created_at | TIMESTAMP    | Data de criação       |

#### `transactions`

| Campo       | Tipo      | Descrição                     |
| ----------- | --------- | ----------------------------- |
| id          | SERIAL    | ID único da transação         |
| user_id     | UUID      | Referência ao usuário         |
| type_id     | INTEGER   | 1: Receita, 2: Despesa        |
| category_id | INTEGER   | Referência à categoria        |
| value       | INTEGER   | Valor em centavos             |
| description | TEXT      | Descrição da transação        |
| receipt_url | TEXT      | URL do comprovante (opcional) |
| created_at  | TIMESTAMP | Data de criação               |
| updated_at  | TIMESTAMP | Data de atualização           |
| deleted_at  | TIMESTAMP | Soft delete                   |

### Storage

- **Bucket**: `receipts`
- **Estrutura**: `{user_id}/{timestamp}.{ext}`
- **Formatos aceitos**: jpg, jpeg, png, gif, webp, bmp

## 🎨 Tema e Cores

O aplicativo utiliza uma paleta de cores moderna e acessível:

- **Primary**: `#ED4A4C` (Vermelho)
- **Success**: `#00B37E` (Verde)
- **Background**: `#FFFFFF` (Branco)
- **Text**: `#323238` (Cinza escuro)
- **Border**: `#E1E1E6` (Cinza claro)

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Validação de dados no client e server
- ✅ Autenticação JWT com refresh token
- ✅ Senhas com hash bcrypt (gerenciado pelo Supabase)
- ✅ HTTPS em todas as requisições
- ✅ Isolamento de dados por usuário

## 📱 Compatibilidade

- **Android**: 5.0 (API 21) ou superior
- **iOS**: 13.0 ou superior
- **Web**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 📹 Vídeo Demonstrativo

Como parte da entrega do Tech Challenge, incluímos um vídeo demonstrativo de até 5 minutos mostrando:

### 🎬 Conteúdo do Vídeo

1. **Autenticação** (0:00 - 0:45)
   - Tela de login
   - Processo de cadastro
   - Validação de email
   - Fluxo de autenticação com Supabase

2. **Adicionar Transações** (0:45 - 1:30)
   - Abertura do formulário de nova transação
   - Preenchimento dos campos (tipo, categoria, valor, descrição)
   - Upload de comprovante (imagem)
   - Salvamento no Supabase
   - Feedback de sucesso

3. **Editar Transações** (1:30 - 2:15)
   - Swipe para esquerda em uma transação
   - Formulário de edição pré-preenchido
   - Alteração de valores
   - Substituição de comprovante
   - Atualização no banco de dados

4. **Visualizar e Filtrar Transações** (2:15 - 3:15)
   - Lista de transações com scroll infinito
   - Busca por texto
   - Aplicação de filtros avançados:
     - Filtro por categoria
     - Filtro por tipo (receita/despesa)
     - Filtro por período de datas
   - Pull to refresh
   - Visualização de comprovantes anexados

5. **Dashboard e Gráficos** (3:15 - 4:15)
   - Navegação para o dashboard
   - Cards de resumo (receitas, despesas, saldo)
   - Gráfico de evolução dos últimos 6 meses
   - Gráfico de pizza por categoria
   - Estatísticas gerais

6. **Integração com Supabase** (4:15 - 5:00)
   - Demonstração do banco de dados no painel Supabase
   - Visualização de transações salvas
   - Comprovantes no Supabase Storage
   - Políticas de segurança (RLS) em ação
   - Logout e persistência de sessão

### 📝 Observações sobre o Vídeo

- ✅ Duração: Máximo de 5 minutos
- ✅ Demonstra todas as funcionalidades principais
- ✅ Mostra a integração com Supabase (substituindo Firebase)
- ✅ Evidencia validações e tratamento de erros
- ✅ Apresenta a performance e animações
- ✅ Qualidade de áudio e vídeo adequada

### 🎥 Link do Vídeo

> **[Inserir link do vídeo aqui após upload no YouTube/Vimeo/Google Drive]**

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Equipe

Desenvolvido como parte do **Tech Challenge - FIAP** | Fase [X] - [Ano]

**Integrantes:**

- [Nome do Integrante 1] - RM XXXXX
- [Nome do Integrante 2] - RM XXXXX
- [Nome do Integrante 3] - RM XXXXX
- [Nome do Integrante 4] - RM XXXXX

## 🙏 Agradecimentos

- **FIAP** - Pela oportunidade e conhecimentos compartilhados durante o curso
- **Professores** - Pela orientação e suporte ao longo das disciplinas
- **Discord Community** - [@Tech Challenge](https://discord.com/channels/1255291574045376644/1405341177435259023)
- [Expo](https://expo.dev) - Plataforma incrível para desenvolvimento React Native
- [Supabase](https://supabase.com) - Backend as a Service poderoso e open source
- [NativeWind](https://www.nativewind.dev) - TailwindCSS para React Native
- Comunidade React Native

## 📚 Referências

- [Documentação React Native](https://reactnative.dev/docs/getting-started)
- [Documentação Expo](https://docs.expo.dev/)
- [Documentação Supabase](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [NativeWind Documentation](https://www.nativewind.dev/quick-starts/expo)

---

## 📝 Notas Finais

### Sobre o Tech Challenge

Este projeto foi desenvolvido como atividade obrigatória do **Tech Challenge da FIAP**, que engloba conhecimentos de todas as disciplinas da fase e vale **90% da nota** de todas as disciplinas.

**Autorização e Diretrizes:** [@Discord - Tech Challenge](https://discord.com/channels/1255291574045376644/1405341177435259023)

### Decisão Técnica: Supabase vs Firebase

Optamos por utilizar **Supabase** ao invés de Firebase pelos seguintes motivos:

1. **PostgreSQL Relacional** - Maior flexibilidade para queries complexas e relacionamentos
2. **Row Level Security (RLS)** - Segurança nativa a nível de linha
3. **Open Source** - Sem vendor lock-in, código aberto
4. **SQL Nativo** - Maior controle sobre queries e otimizações
5. **Mesmas Funcionalidades** - Auth, Database, Storage, Real-time
6. **Melhor Performance** - Índices SQL otimizados
7. **Custo-benefício** - Plano gratuito mais generoso

Todas as funcionalidades solicitadas no desafio foram implementadas com sucesso utilizando Supabase, demonstrando que é uma alternativa superior ao Firebase para aplicações que requerem queries complexas e relações de dados.

### Boas Práticas Aplicadas

- ✅ **Clean Code** - Código limpo, legível e bem documentado
- ✅ **SOLID Principles** - Separação de responsabilidades
- ✅ **Component Composition** - Reutilização de componentes
- ✅ **Type Safety** - TypeScript em todo o projeto
- ✅ **Performance** - Memoização, lazy loading, paginação
- ✅ **Security** - RLS, validação, autenticação JWT
- ✅ **UX/UI** - Animações, feedback visual, acessibilidade
- ✅ **Scalability** - Arquitetura modular e escalável
- ✅ **Maintainability** - Código organizado e fácil de manter

---

**📝 Nota Final**: Este projeto foi desenvolvido com foco em boas práticas de desenvolvimento, escalabilidade e manutenibilidade, atendendo a todos os requisitos do Tech Challenge. Sinta-se à vontade para usar como referência ou base para seus próprios projetos!
