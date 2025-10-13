# 💰 Byte Bank App

Um aplicativo mobile moderno de gerenciamento financeiro pessoal desenvolvido com React Native e Expo, oferecendo uma experiência intuitiva e completa para controle de receitas e despesas.

> **📢 Tech Challenge - FIAP**  
> Este projeto foi desenvolvido como parte do Tech Challenge da FIAP. O banco de dados foi migrado para o Supabase, seguindo as orientações detalhadas neste tópico do Discord: [@Discord - Tech Challenge](https://discord.com/channels/1255291574045376644/1405341177435259023)

## 📋 Índice

- [Atualizações Recentes](#-atualizações-recentes)
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

## 🔄 Atualizações Recentes

### Última Atualização - Outubro 2025

#### 🎨 Melhorias de Autenticação

**Context de Autenticação (`src/context/auth.context.tsx`)**

- ✅ Implementação completa do fluxo de autenticação com Supabase
- ✅ Gerenciamento de sessão persistente com tokens JWT
- ✅ Tratamento robusto de erros de autenticação
- ✅ Validação de email confirmado antes do login
- ✅ Sistema de reenvio de email de confirmação
- ✅ Detecção de emails duplicados no cadastro
- ✅ Feedback claro ao usuário sobre erros específicos
- ✅ Auto-recuperação de sessão ao reabrir o app

**Tela de Login (`src/screens/login/loginForm/index.tsx`)**

- ✅ Melhorias no tratamento de erros de login
- ✅ Exibição de mensagens de erro contextualizadas
- ✅ Estados de loading durante autenticação
- ✅ Reset automático de erros entre tentativas
- ✅ Validação de campos com feedback em tempo real
- ✅ Interface limpa e responsiva

#### 📊 Melhorias no Dashboard

**Dashboard Completo (`src/screens/dashboard/index.tsx`)**

- ✅ Seletor de ano com modo "Todos" e anos específicos
- ✅ Cards de resumo financeiro (Receitas, Despesas, Saldo)
- ✅ Sistema de insights financeiros automáticos:
  - Comparação mês a mês (modo "Todos")
  - Comparação ano a ano (anos específicos)
  - Insights de economia e aumento por categoria
  - Detecção de padrões financeiros relevantes
- ✅ Gráficos interativos:
  - Gráfico de linha com evolução temporal
  - Gráfico de pizza com despesas por categoria
  - Legendas e cores acessíveis
- ✅ Estatísticas detalhadas:
  - Total de transações
  - Média de despesas
  - Média de receitas
- ✅ Estados vazios informativos
- ✅ Loading states durante carregamento de dados
- ✅ Performance otimizada com queries paralelas

#### 🔧 Melhorias Técnicas

**Configuração do Supabase (`src/utils/constants/supabase.ts`)**

- ✅ Arquivo de configuração centralizado
- ✅ Credenciais do Supabase organizadas
- ✅ Pronto para diferentes ambientes (dev/prod)

#### 📈 Performance e UX

- ✅ Remoção de comentários desnecessários para código mais limpo
- ✅ Melhor organização de imports
- ✅ Otimização de re-renders com estados controlados
- ✅ Feedback visual em todas as operações
- ✅ Tratamento de casos extremos (erros, estados vazios)
- ✅ Animações suaves em transições

#### 🔐 Segurança

- ✅ Validação de sessão ao iniciar o app
- ✅ Proteção contra tentativas de login sem email confirmado
- ✅ Feedback claro sobre falhas de autenticação
- ✅ Tokens JWT gerenciados automaticamente
- ✅ Logout seguro com limpeza de sessão
---

## 🎯 Visão Geral

O **Byte Bank App** é uma solução completa para gerenciamento financeiro pessoal que permite aos usuários:

- 💰 Registrar receitas e despesas com categorias personalizadas
- 📊 Visualizar gráficos e estatísticas interativas
- 💡 Receber insights financeiros automáticos com comparação de períodos
- 🔍 Buscar e filtrar transações por ano, categoria e período
- 📈 Acompanhar evolução financeira com dashboard filtrado por ano
- 🎯 Onboarding intuitivo na primeira utilização
- 📎 Anexar comprovantes às transações
- 📱 Interface moderna com animações fluidas

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
  - Query otimizada para resumo anual (`fetchYearSummary`)
  - Execução paralela de queries com `Promise.all`
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
- **React Native Animated API** - Animações nativas integradas
  - Componente `AnimatedView` customizado com fade in/out
  - `useAnimatedView` hook para controle de animações
  - Transições suaves entre telas e componentes
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
- **React Native Animated API** - API de animação nativa do React Native
  - Componente `AnimatedView` para transições suaves
  - Hook `useAnimatedView` para controle de fade in/out
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

### 🎯 Onboarding

- **Primeira Experiência** - Tela de boas-vindas exibida apenas na primeira vez
- **4 Slides Interativos** - Explicação visual das principais features do app:
  - 💰 Gerenciamento de Finanças
  - 💡 Dashboard Inteligente
  - 🔍 Filtros Avançados
  - 📊 Busca Anual e Relatórios
- **Navegação Intuitiva** - Swipe horizontal para navegar entre slides
- **Controles Flexíveis**:
  - Botão "Pular" para ir direto ao login
  - Botão "Voltar" contextual (a partir do 2º slide)
  - Botão dinâmico ("Próximo" → "Começar")
- **Paginação Visual** - Indicadores de progresso com bolinhas
- **Animações Suaves** - AnimatedView com fade in
- **Persistência Local** - AsyncStorage para salvar que onboarding foi visto
- **Ícones Coloridos** - Material Icons grandes e visualmente atrativos
- **Código**: `src/screens/onboarding/index.tsx` e `src/utils/hooks/useOnboarding.tsx`

### 🔐 Autenticação

- **Cadastro de usuários** com validação de email e senha
- **Login seguro** com sessão persistente
- **Recuperação de senha** via email
- **Reenvio de email de confirmação**

### 🎯 Funcionalidades Avançadas

#### 📊 Busca Anual Inteligente

- **Busca por Ano** - Digite `/` seguido do ano (ex: `/2024`, `/2025`) na barra de busca
- **Formato Especial** - A barra `/` indica uma busca especial por ano, diferenciando de buscas normais
- **Resumo Anual Automático** - Exibe 3 cards horizontais com:
  - 💚 **Total de Entradas** do ano (cor verde)
  - ❤️ **Total de Saídas** do ano (cor vermelha)
  - 💰 **Saldo do Ano** (entrada - saída)
- **Query Otimizada** - Busca apenas os campos necessários (`type_id`, `value`)
- **Execução Paralela** - Resumo e listagem carregam simultaneamente
- **Estados Visuais**:
  - Loading spinner durante a busca
  - Estado vazio quando não há transações no ano
  - Ícones e badges informativos
- **Código**: `src/components/yearSummaryCards.tsx` e `src/context/transaction.context.tsx` (função `fetchYearSummary`)

#### 🔍 Filtros Avançados

- **Múltiplas Categorias** - Selecione várias categorias ao mesmo tempo (ex: Trabalho + Reforma)
- **Filtros Rápidos de Data** - 3 botões com períodos pré-definidos:
  - 📅 **Semana Passada** - Domingo a Sábado da semana anterior
  - 📆 **Mês Passado** - Todo o mês anterior (1º ao último dia)
  - 📋 **Trimestre Atual** - Trimestre atual (Jan-Mar, Abr-Jun, Jul-Set, Out-Dez)
- **Campos de Data Manuais** - Campos "De" e "Até" para seleção customizada
- **Validação Inteligente** - Só aplica filtro se pelo menos um campo estiver preenchido
- **Feedback Visual** - SnackBar de erro se tentar filtrar sem seleção
- **Design Moderno** - Botões coloridos com ícones Material Icons
- **Código**: `src/components/filterTransactions.tsx`

#### 🔝 Scroll to Top

- **Botão Flutuante** - Aparece automaticamente após rolar 300px
- **Animação Suave** - Efeito spring com fade in/out
- **Scroll Animado** - Volta ao topo com animação suave
- **Design Material** - Botão circular vermelho com ícone de seta
- **Sombra e Elevação** - Destaque visual sobre o conteúdo
- **Código**: `src/screens/home/index.tsx` (linhas 327-405)

### 🔐 Autenticação (continuação)

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
- **Busca por ano** - Digite `/` + ano (ex: `/2024`, `/2025`) para ver resumo anual completo
- **Filtro múltiplo por categoria** - Selecione várias categorias simultaneamente
- **Filtro por tipo** (receita/despesa)
- **Filtro por período** com campos "De" e "Até"
- **Filtros rápidos de data**:
  - Semana Passada
  - Mês Passado
  - Trimestre Atual
- **Validação de filtros** - Só aplica se algum campo estiver selecionado
- **Ordenação** por data ou valor
- **Limpar filtros** rapidamente

### 📊 Dashboard & Estatísticas

- **Filtro de Ano** - Seletor de ano para análise temporal:
  - Opção "Todos" - Visualiza últimos 6 meses
  - Anos específicos (2025, 2024, 2023, 2022) - Visualiza 12 meses completos
  - Totais calculados dinamicamente baseado no ano selecionado
  - Título do gráfico atualiza automaticamente
  - **Código**: `src/components/yearSelector.tsx`

- **💡 Insights Financeiros Automáticos** - Análise inteligente comparativa:
  - **Comparação Mês a Mês** (quando "Todos" selecionado):
    - Compara mês atual vs mês anterior
    - Ex: "Janeiro 2025 vs Dezembro 2024"
  - **Comparação Ano a Ano** (quando ano específico selecionado):
    - Compara ano selecionado vs ano anterior
    - Ex: "2024 vs 2023" ou "2023 vs 2022"
  - **Tipos de Insights**:
    - ✅ Economia em despesas (redução ≥20%)
    - ⚠️ Aumento em despesas (aumento ≥20%)
    - 📈 Aumento em receitas (aumento ≥20%)
    - 📉 Redução em receitas (redução ≥20%)
    - 💰 Economia por categoria (mudança ≥30%)
    - 📊 Aumento por categoria (mudança ≥30%)
  - **Cards Visuais Horizontais**:
    - Cores dinâmicas por tipo (verde=sucesso, laranja=atenção, vermelho=perigo)
    - Badge de porcentagem de variação
    - Scroll horizontal para múltiplos insights
    - Título contextual mostrando período de comparação
  - **Estados**:
    - Loading durante análise
    - Sem exibição se não houver insights relevantes
  - **Query Otimizada** - 2 queries paralelas buscando apenas `category_id`, `value`, `type_id`
  - **Código**: `src/components/insightsCards.tsx` e `src/context/transaction.context.tsx` (função `fetchPeriodComparison`)

- **Saldo total** (receitas - despesas) do período filtrado
- **Total de receitas** acumuladas do período
- **Total de despesas** acumuladas do período
- **Gráfico de evolução**:
  - Últimos 6 meses (quando "Todos" selecionado)
  - 12 meses completos (quando ano específico selecionado)
  - Linha de receitas (verde)
  - Linha de despesas (vermelha)
- **Gráfico de pizza** - Top 6 despesas por categoria
- **Estatísticas gerais**:
  - Total de transações do período
  - Média de despesas do período
  - Média de receitas do período

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
- **Infinite Scroll** com botão "voltar ao topo" animado
- **Onboarding Persistente** - AsyncStorage para controle de primeira visualização
- **Filtros Dinâmicos** - Dashboard adapta gráficos baseado no ano selecionado
- **Insights Inteligentes** - Comparação automática de períodos com regras configuráveis
- **Cache de imagens** para performance
- **Compressão de imagens** antes do upload
- **Lazy loading** de componentes
- **Memoização** para otimização de renders
- **Validação em tempo real** de formulários
- **Gestão de erros** centralizada
- **Sistema de tipos** completo com TypeScript
- **Queries otimizadas** - Busca apenas campos necessários (ex: `type_id`, `value`)
- **Execução paralela** - Múltiplas queries simultâneas com `Promise.all`
- **Debounce** na busca para reduzir requisições
- **Agregação eficiente** - Cálculos no frontend após queries otimizadas

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
│   │   ├── filterTransactions.tsx     # Filtros avançados com períodos rápidos
│   │   ├── input.tsx
│   │   ├── insightsCards.tsx          # Cards de insights financeiros automáticos
│   │   ├── loading.tsx
│   │   ├── receiptPicker.tsx
│   │   ├── searchBar.tsx
│   │   ├── snackBar.tsx
│   │   ├── yearSelector.tsx           # Seletor de ano para dashboard
│   │   ├── yearSummaryCards.tsx       # Cards de resumo anual
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
│   │   │   └── index.tsx    # Dashboard com gráficos e insights
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
│   │   ├── onboarding/
│   │   │   └── index.tsx    # Onboarding de boas-vindas
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
│       │   ├── onboarding.ts  # Constantes do Onboarding
│       │   └── supabase.ts    # Constantes Supabase
│       ├── hooks/
│       │   ├── useAnimatedView.tsx
│       │   ├── useInfiniteScroll.tsx
│       │   ├── useKeyboardVisible.tsx
│       │   └── useOnboarding.tsx  # Hook para gerenciar onboarding
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

Execute o seguinte script SQL completo no editor SQL do Supabase (SQL Editor):

```sql
BEGIN;

DROP TRIGGER IF EXISTS createAuthUser ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS transaction_categories CASCADE;
DROP TABLE IF EXISTS transaction_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS migrations CASCADE;

CREATE TABLE migrations (
  id SERIAL PRIMARY KEY NOT NULL,
  timestamp BIGINT NOT NULL,
  name VARCHAR NOT NULL
);

INSERT INTO migrations VALUES
  (1, 1731706554960, 'CreateUsersTable1731706554960'),
  (2, 1741746343254, 'CreateTransactionsTable1741746343254'),
  (3, 1741911466558, 'CreateTransactionTypeTable1741911466558'),
  (4, 1741911575176, 'CreateTransactionCategoriesTable1741911575176'),
  (5, 1742959827377, 'CreateDescriptionColunm1742959827377');

CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_types (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL
);

INSERT INTO transaction_types VALUES
  (1, 'Entrada'),
  (2, 'Saída');

CREATE TABLE transaction_categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL
);

INSERT INTO transaction_categories VALUES
  (1, 'Casa'),
  (2, 'Academia'),
  (3, 'Saúde'),
  (4, 'Aluguel'),
  (5, 'Trabalho'),
  (6, 'Freelance'),
  (7, 'Emergência'),
  (8, 'Reforma');

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY NOT NULL,
  type_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  description VARCHAR,
  receipt_url TEXT,
  CONSTRAINT FK_transaction_category_id FOREIGN KEY (category_id) REFERENCES transaction_categories (id),
  CONSTRAINT FK_transaction_type_id FOREIGN KEY (type_id) REFERENCES transaction_types (id),
  CONSTRAINT FK_transaction_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type_id ON transactions(type_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_deleted_at ON transactions(deleted_at);
CREATE INDEX idx_users_email ON users(email);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    RAISE WARNING 'Email já existe na tabela users: %', new.email;
    RETURN new;
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao inserir usuário na tabela users: %', SQLERRM;
    RETURN new;
END;
$$;

CREATE TRIGGER createAuthUser
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

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

CREATE POLICY "Authenticated users can view categories"
  ON transaction_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view types"
  ON transaction_types FOR SELECT
  TO authenticated
  USING (true);

COMMIT;
```

### 4. Configurar Storage

1. No painel do Supabase, vá em **Storage**
2. Clique em **Create a new bucket**
3. Nome do bucket: `receipts`
4. Configuração: **Private** (recomendado para segurança)
5. Após criar o bucket, execute no SQL Editor:

```sql
DROP POLICY IF EXISTS "Users can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own receipts" ON storage.objects;

CREATE POLICY "Users can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own receipts"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own receipts"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 5. Configurar Autenticação

1. No painel do Supabase, vá em **Authentication → Providers**
2. Habilite **Email** provider
3. **Para desenvolvimento/teste**: Desabilite "Confirm email" (opcional)
4. Configure URLs de redirecionamento:
   - **Site URL**: `exp://localhost:8081`
   - **Redirect URLs**:
     - `exp://localhost:8081`
     - `http://localhost:8081`

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
5. **Busca Anual**: `Home` → `TransactionContext.fetchYearSummary` → `Supabase` (query otimizada)
6. **Filtro por Ano**: `Dashboard` → `TransactionContext.fetchTransactionsByYear` → `Supabase`
7. **Insights**: `Dashboard` → `TransactionContext.fetchPeriodComparison` → `Supabase` (2 queries paralelas)

### Gerenciamento de Onboarding

- **Verificação**: `PublicStack` → `useOnboarding` → `AsyncStorage` → decide rota inicial
- **Completar**: `Onboarding` → `AsyncStorage.setItem` → navega para Login
- **Resetar**: `useOnboarding.resetOnboarding` → `AsyncStorage.removeItem` (para testes)

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

Como parte da entrega do Tech Challenge, incluímos um vídeo demonstrativo de até 5 minutos.

### 🎥 Link do Vídeo

> **[Acesse aqui](https://youtu.be/B1fcAxLaA20)]**

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

**Integrantes do Grupo 40:**

- Kayo Henrique da Silva Pinto - RM 362479
- Carlos Eduardo Batista de Souza - RM 360902
- Gabriel Piva Pereira - RM 361733

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
