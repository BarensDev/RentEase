# RentEase — começar aqui

Este é o ponto de partida do Projeto Integrador RentEase. O projeto já contém as três páginas, a ligação entre ficheiros, os campos necessários e exemplos de código. A aplicação abre sem dependências e sem frameworks.

O objetivo não é apagar o starter e começar de novo. Deves completar os comentários `TODO` e conseguir explicar as decisões que tomaste.

## O que já está preparado

- estrutura das três páginas e navegação entre elas;
- nomes dos ficheiros, `id`, `name` e classes necessários à ligação entre HTML, CSS e JavaScript;
- campos do formulário e dos filtros;
- funções de feedback e formatação;
- validação completa do formulário de novo apartamento;
- exemplos de criação de elementos do DOM;
- funções e eventos onde vais implementar cada requisito.

## O que tens de completar

### HTML

- associar os `label` em falta aos respectivos campos;
- completar os rodapés e os blocos assinalados;
- confirmar que a estrutura e a navegação são consistentes nas três páginas.

### CSS

- organizar navegação, grelhas, formulário, filtros e cartões;
- criar estados visuais claros;
- adaptar a aplicação a ecrãs pequenos;
- manter texto legível e foco visível.

### JavaScript

- carregar e guardar o array com a chave `renteaseFlats`;
- criar e guardar um apartamento depois da validação;
- apresentar os favoritos na Home;
- aplicar filtros e ordenação;
- marcar e desmarcar favoritos;
- eliminar apenas o apartamento escolhido;
- voltar a renderizar depois de cada alteração.

## Como encontrar o trabalho

Pesquisa por `TODO` em toda a pasta. Os marcadores têm uma área e um número, por exemplo:

```text
TODO HTML-2
TODO CSS-4
TODO JS-STORAGE-1
TODO JS-FLATS-3
```

Faz uma tarefa de cada vez e testa antes de passar à seguinte.

## Ordem recomendada

1. Abre as três páginas e confirma que os links funcionam.
2. Completa os `TODO HTML` e confirma os formulários no browser.
3. Completa os `TODO CSS` e testa desktop e mobile.
4. Implementa `loadFlats()` e `saveFlats()` em `js/storage.js`.
5. Testa o formulário vazio e confirma que a validação fornecida apresenta erros.
6. Completa o fluxo de gravação em `js/new-flat.js`.
7. Completa a listagem, os filtros, a ordenação e as acções em `js/flats.js`.
8. Completa o resumo e os favoritos em `js/home.js`.
9. Recarrega as páginas e confirma a persistência.
10. Preenche o `README.md` e executa a checklist final.

## Como usar a validação fornecida

O ficheiro `js/new-flat.js` já lê os campos, verifica as regras e apresenta as mensagens. No evento `submit`, o resultado tem esta forma:

```js
{
  data: {
    city: "Porto",
    streetName: "Rua das Flores",
    streetNumber: 42,
    areaSize: 85,
    hasAC: true,
    yearBuilt: 2018,
    rentPrice: 950,
    dateAvailable: "2026-09-01"
  },
  errors: {}
}
```

Quando não existem erros, deves usar `validationResult.data` para criar o novo apartamento. Depois:

```text
carregar o array
→ criar o objecto com id e isFavourite
→ adicionar ao array
→ guardar o array completo
→ limpar o formulário
→ apresentar sucesso
```

Não guardes apenas `validationResult.data` no `localStorage`: a aplicação precisa de conservar o array completo de apartamentos.

## Checkpoints

### Checkpoint 1 — Estrutura

- as três páginas abrem;
- os links funcionam;
- a consola não apresenta erros;
- todos os campos têm `label` associado.

### Checkpoint 2 — Persistência

- `loadFlats()` devolve `[]` quando a chave não existe;
- `saveFlats(flats)` guarda o array;
- os dados continuam disponíveis depois de recarregar.

### Checkpoint 3 — Criação

- dados inválidos não são guardados;
- um apartamento válido é acrescentado ao array;
- o formulário só é limpo depois de guardar com sucesso.

### Checkpoint 4 — Listagem e acções

- os apartamentos aparecem em `flats.html`;
- os filtros funcionam isoladamente e em conjunto;
- a ordenação não altera desnecessariamente o array guardado;
- favorito e eliminar persistem depois de recarregar.

### Checkpoint 5 — Home e qualidade

- as contagens estão correctas;
- aparecem apenas os favoritos;
- remover dos favoritos não elimina o apartamento;
- a aplicação é utilizável num ecrã estreito;
- o `README.md` está preenchido.

## Executar

Podes abrir `index.html` com Live Server. Se tiveres Python instalado, também podes executar nesta pasta:

```bash
python3 -m http.server 5500
```

Depois abre `http://localhost:5500`.
