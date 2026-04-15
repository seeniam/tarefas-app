# Tarefas App

Aplicacao web full stack em Next.js para organizacao pessoal de tarefas com dashboard mobile first e Google Sheets como base operacional.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- TanStack Query
- Google Sheets API via Service Account

## Arquitetura

- `app/`: rotas, layout e API
- `components/`: UI reutilizavel
- `features/`: composicao do dashboard e hooks
- `repositories/`: contrato e implementacao da fonte de dados
- `services/`: regras de aplicacao e integracao externa
- `schemas/`: validacao e normalizacao
- `types/`: modelos do dominio
- `lib/`: utilitarios e env

## Formato esperado da planilha

Aba: `tarefas`

Cabecalho na linha 1:

`id | titulo | descricao | data | horario_inicio | horario_fim | prioridade | status | categoria | observacoes | concluida | criado_em | atualizado_em`

Regras:

- `id` unico por linha
- `data` em `YYYY-MM-DD`
- horarios em `HH:mm`
- `concluida` aceita `true`, `false`, `sim`, `nao`, `1`, `0`
- a aplicacao revalida e normaliza valores invalidos com fallback seguro

## Service Account

1. Acesse o Google Cloud Console.
2. Crie ou selecione um projeto.
3. Ative `Google Sheets API`.
4. Va em `IAM & Admin > Service Accounts`.
5. Crie uma nova Service Account.
6. Gere uma chave JSON.
7. Copie `client_email` para `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
8. Copie `private_key` para `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, preservando `\n`.

## Compartilhar a planilha

1. Abra a planilha.
2. Clique em `Compartilhar`.
3. Adicione o email da Service Account.
4. Dê permissao de `Editor`.
5. Copie o ID da URL da planilha para `GOOGLE_SHEETS_SPREADSHEET_ID`.

## Instalacao

```bash
npm install
```

Crie `.env.local` baseado em `.env.example` e rode:

```bash
npm run dev
```

## Estrategia de sincronizacao

- Listagens leem a aba `tarefas` diretamente do Google Sheets.
- Cada mutacao localiza a linha por `id`.
- Atualizacoes usam o numero real da linha para `update`.
- Exclusoes usam `batchUpdate` com `deleteDimension`.
- O endpoint `/api/tasks/sync` dispara releitura e a UI invalida cache local.

## Melhorias futuras

- autenticacao multiusuario
- PWA com suporte offline
- drag and drop
- auditoria de alteracoes
- migracao para Postgres/Supabase via novo repositorio
