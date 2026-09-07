# RentEase

O RentEase é uma aplicação web desenvolvida como parte do módulo JavaScript do Programa de Pós-Graduação da TechOf.

A aplicação permite que os utilizadores gerenciem imóveis para arrendamento através de uma interface simples e intuitiva. Os utilizadores podem adicionar apartamentos, navegar pelos anúncios disponíveis, filtrar e classificar os resultados, marcar favoritos e visualizar informações resumidas no painel de controlo. Todos os dados são armazenados localmente utilizando a API de armazenamento local do browser, eliminando a necessidade de um servidor de backend.

## Funcionalidades concluídas

- [x] criar apartamentos;
- [x] guardar e recuperar dados com `localStorage`;
- [x] listar apartamentos;
- [x] filtrar por cidade, preço e área;
- [x] ordenar por cidade, preço e área;
- [x] marcar e desmarcar favoritos;
- [x] eliminar apartamentos;
- [x] apresentar resumo e favoritos na Home;
- [x] adaptar a interface a mobile.
- [x] Editar um apartamento e guardar a alteração.
- [x] Botão para limpar filtros e ordenação cresente e decrescente.
- [x] Criar um modal antes de eliminar.
- [x] Apresentar estátisticas: renda média e apartamentos disponiveis por cidade.
- [x] Adicionar botão de exemplo sem duplicar os dados a cada click.

## Como executar

### Opção 1: Abrir diretamente no browser

1.º Descarregue ou clone o repositório:

```bash
git clone https://github.com/BarensDev/RentEase.git
```

2.º Abra a pasta do projeto.

3.º Abra o ficheiro `index. html` com o seu browser preferido.

### Opção 2: Servidor Live (Recomendado)

1.º Abra o projeto no Visual Studio Code.

2.º Instale a extensão **Live Server**.

3.º Clique com o botão direito do rato em `index.html`.

4.º Selecione **Abrir com Live Server**.

A aplicação será executada localmente no seu navegador.

## Como utilizar

### Página Inicial

A página inicial oferece uma visão geral do sistema, incluindo:

- Total de apartamentos inscritos
- Apartamentos favoritos
- Acesso rápido às principais funcionalidades

### Página de Apartamentos

Na página de anúncios de apartamentos, os utilizadores podem:

- Visualizar todos os apartamentos
- Pesquisar e filtrar apartamentos
- Ordenar apartamentos por diferentes critérios
- Adicionar ou remover favoritos
- Excluir apartamentos

### Página de Novo Apartamento

Os utilizadores podem adicionar um novo apartamento fornecendo:

- Informação do apartamento
- Detalhes da localização
- Informação sobre o preço
- Detalhes da região

Após o envio, o apartamento é guardado automaticamente no armazenamento local e fica disponível na lista.

## Testes realizados

### Casos Válidos

- Criar apartamentos com todas as informações necessárias
- Guardar e recuperar apartamentos do armazenamento local
- Filtrar apartamentos por cidade
- Filtrar apartamentos por preço
- Filtrar apartamentos por área
- Ordenar apartamentos por diferentes critérios
- Marcar um apartamento como favorito
- Remover um apartamento dos favoritos
- Excluir apartamentos
- Editar apartamento e guardar

### Casos Inválidos

- Enviar formulários com informação obrigatória em falta
- Introduzir valores inválidos em campos numéricos
- Tentar operações quando não existem apartamentos

### Operações Repetidas

- Criação de múltiplos apartamentos
- Filtragem e ordenação repetidas
- Marcar e desmarcar favoritos várias vezes
- Atualizar o browser após a persistência dos dados

## Limitações conhecidas

- Os dados são armazenados apenas no browser, utilizando o armazenamento local (Local Storage).
- Não existe autenticação de utilizador.
- Os dados não são partilhados entre diferentes dispositivos ou browsers.
- Não existe integração com base de dados backend.
- As capacidades de pesquisa e filtragem estão limitadas aos critérios implementados.

## Autor

Pedro Barão
João Rosado (starter Project)

Postgraduate Program in Software Development - TechOf
