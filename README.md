# Randomizer

> Você tem tempo. Eu tenho um plano.

MVP mobile local-first em React Native, Expo e TypeScript. O aplicativo transforma um contexto rápido — tempo, orçamento, local, energia, companhia, transporte e entropia — em uma sidequest segura para fazer no mundo real ou em casa.

## O que está implementado

- Home com todos os filtros, slider de entropia e animação de randomização
- catálogo local versionado com 60 atividades específicas em 12 categorias
- engine de seleção filtrada e aleatória ponderada
- seeds reproduzíveis por versão de catálogo
- tela `RUN GENERATED`, aceitar, reroll, abandonar e concluir
- Blind Runs com etapas bloqueadas e reveladas em sequência
- feedback local (`Adorei`, `Gostei`, `Meh`, `Nunca mais`)
- aprendizado estatístico por categoria e bloqueio de atividade
- XP, level e seis conquistas
- histórico de runs geradas, aceitas, concluídas, abandonadas e rerolls
- persistência com AsyncStorage
- haptics nos filtros, geração, aceite, etapas e conclusão
- interface dark com identidade de videogame leve

Não existem backend, cadastro, analytics, rede social, chamadas remotas ou IA.

## Executar

O Expo SDK 57 requer Node 22.13 ou superior. O projeto inclui `.nvmrc`.

```bash
nvm use
npm install
npm start
```

Depois, abra no Expo Go pelo QR code ou use:

```bash
npm run android
npm run ios
npm run web
```

Validações locais:

```bash
npm test
npm run typecheck
npm run format:check
```

Para formatar todo o código e os arquivos de configuração:

```bash
npm run format
```

## Estrutura

```text
app/
  _layout.tsx            # providers e navegação
  index.tsx              # Home e filtros
  run.tsx                # coordenador simples dos estados da run
  history.tsx            # memória, métricas e conquistas
src/
  components/            # UI reutilizável sem regras de negócio
  data/                  # catálogo e definições de conquistas
  domain/                # engine, preferências e progressão
  hooks/                 # estado/orquestração do aplicativo
  services/              # implementações dos repositórios
  screens/run/           # geração, run ativa/Blind Run e feedback
  storage/               # chaves e serialização do AsyncStorage
  types/                 # entidades e contratos dos repositórios
  utils/                 # seed, formatação e tema
```

As abstrações principais são `ActivityRepository`, `RunHistoryRepository` e `AppStateRepository`. A implementação atual é local; uma implementação diferente pode ser injetada no futuro sem mover regras para os componentes.

## Tipos centrais

- `Activity`: conteúdo da run e todos os metadados de compatibilidade
- `RandomizerContext`: filtros escolhidos na Home
- `RunRecord`: ciclo de vida e memória imutável da sugestão
- `UserPreferences`: afinidade por categoria e IDs bloqueados
- `PlayerProfile`: XP, streak e conquistas
- `PersistedAppState`: estado mínimo necessário para retomar offline

## Seleção ponderada

`RandomizerEngine` executa a seguinte sequência:

1. elimina atividades bloqueadas ou incompatíveis com tempo, orçamento, local, energia, companhia e transporte;
2. delimita uma faixa de entropia; se ela esvaziar o catálogo, usa os demais candidatos ainda compatíveis;
3. remove atividades dentro do cooldown; somente essa exclusão pode ser relaxada;
4. calcula o peso com afinidade aprendida, proximidade da entropia, diversidade das quatro categorias recentes, energia e bônus contextual para Blind Runs;
5. realiza uma roleta ponderada usando um PRNG determinístico.

Em termos simplificados:

```text
peso = preferência × entropia × diversidade × energia × blindRun
```

Os pesos de categoria ficam limitados entre `0.35` e `1.80`. Feedback positivo sobe pouco, negativo reduz e “Nunca mais” bloqueia o ID. A penalidade de diversidade continua sendo aplicada mesmo a categorias favoritas.

## Seeds

A seleção contextual gera uma seed no formato `ABC-123-XY`. Essa seed é procurada de modo que `engine.replay(catalog, catalogVersion, seed)` recupere exatamente a mesma atividade sem consultar histórico, filtros ou preferências. Assim, a futura tela “Faz essa run” pode reproduzir uma seed compartilhada somente com o catálogo local correspondente.

O catálogo atual é `2026.08.1`. Qualquer alteração de conteúdo que afete replay deve incrementar essa versão.

## Persistência e privacidade

AsyncStorage guarda apenas:

- filtros recentes;
- histórico de runs;
- preferências aprendidas e bloqueios;
- XP, conquistas e run em andamento.

Todo esse estado permanece no aparelho. Não há código de sincronização ou coleta de telemetria neste MVP.
