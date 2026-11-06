S# Documento de Visão e Escopo

## Propósito

Jogo em que o usuário monta a escalação de um time de futebol a partir de uma roleta, que oferece a oportunidade de preencher o elenco jogador por jogador.

O usuário gira a roleta, que sorteia um time histórico de um ano específico, e deve selecionar, de forma estratégica, o melhor jogador daquele time. Com o elenco completo, o usuário enfrenta um mata-mata contra outros times históricos, tentando vencer um campeonato.E

---

## Requisitos Funcionais

- **RF01:** A roleta seleciona times de forma aleatória. O usuário não tem mais chance de tirar um time bom ou um time ruim.
- **RF02:** O usuário enfrenta o mata-mata em um chaveamento qualquer. Ele não sabe contra quem vai jogar nem contra quem vai se classificar.

---

## Requisitos Não Funcionais (Regras)

- **RN01:** O usuário só pode escolher **um jogador por time** sorteado.
- **RN02:** Após a escolha, o usuário **não pode colocar outro jogador da mesma posição** em seu time.
- **RN03:** O usuário pode pedir para a roleta **girar mais cinco vezes** se não gostar do time que veio.

---

## Casos de Uso

### UC01 - Criar time

1. O usuário aperta para jogar.
2. O jogo solicita algumas formações para o usuário escolher.
3. O usuário aperta para girar a roleta e um time aparece.
4. O usuário escolhe um jogador daquele time para preencher o seu.
5. Quando o time estiver completo, o usuário aperta para jogar.

---

## Modelo Conceitual

Extraído do escopo pela leitura da gramática do texto: substantivos viram entidades, características viram atributos e verbos viram relacionamentos.

### Entidades e atributos

| Entidade | Atributos |
|---|---|
| **Usuario** | nome, email, senha |
| **Time** | nome, ano |
| **Atleta** | nome, nota |
| **Posicao** | nome |
| **Formacao** | nome |
| **Escalacao** | data de criação, status |
| **Giro** | número, é_regiro |
| **Campeonato** | data, status |
| **Partida** | placar de cada lado, vencedor |

> **Nota sobre o nome "Atleta":** foi usado no lugar de "Jogador" para não confundir com o usuário, que é quem joga.

### Relacionamentos

| Relacionamento | Cardinalidade | Observação |
|---|---|---|
| Usuario **cria** Escalacao | 1:N | |
| Escalacao **usa** Formacao | N:1 | |
| Formacao **possui** Posicao | N:N | com a quantidade de vagas de cada posição |
| Escalacao **realiza** Giro | 1:N | |
| Giro **sorteia** Time | N:1 | |
| Time **possui** Atleta | 1:N | |
| Escalacao **contém** Atleta | N:N | guarda a posição em que o atleta foi encaixado |
| Usuario **disputa** Campeonato | 1:N | |
| Campeonato **tem** Partida | 1:N | |

### Restrições vindas das regras

- **RN01:** cada giro tem no máximo um atleta escolhido.
- **RN02:** a combinação (Escalacao, Posicao) deve ser única.

### Decisão de modelagem: como uma partida é decidida

O atributo **nota** do Atleta (o overall do jogador, por exemplo de 1 a 99) é o dado usado para decidir o resultado das partidas do mata-mata. A força de uma escalação é calculada a partir das notas dos atletas que a compõem, e vence a partida quem tiver a maior força.
