// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.querySelector("input#amount")
const expense = document.querySelector("input#expense")
const category = document.querySelector("select#category")

// Selecionando os elementos da lista de despesas.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Adiciona um ouvinte de evento para o campo de entrada. Toda vez que o valor mudar, a função será executada.
amount.oninput = () => {
  // Pega o valor atual do campo de entrada e remove todos os caracteres que não são números. Podemos usar /[^0-9]/g ou /\D/g para isso.
  // As expressões /\d/g e /[0-9]/g são equivalentes ao oposto, ou seja, encontram todos os dígitos (0-9).
  let value = amount.value.replace(/[^0-9]/g, "")

  value = Number(value) / 100 // Transforma a string em um número e divide por 100 para considerar os centavos (R$ 1,00 = 100 centavos).
  amount.value = formatCurrencyBRL(value) // Formata o valor como moeda local (BRL) através da função criada.
}

// Função que formata um valor numérico como moeda local. No caso abaixo em BRL (Real Brasileiro).
function formatCurrencyBRL(value) {
  // Retorna o valor formatado no qual foi usado o método toLocaleString() para formatar o número como moeda local.
  return (value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  }))

  // // Outra forma de fazer a mesma coisa.
  // value = value.toLocaleString("pt-BR", {
  //   style: "currency",
  //   currency: "BRL",
  // })

  // return value
}

// Captura o evento de submit do formulário para obter os dados/valores.
form.onsubmit = (event) => {
  event.preventDefault() // Previne o comportamento padrão do formulário (recarregar a página).

  // Cria um objeto com os dados da despesa.
  const newExpense = {
    id: new Date().getTime(), // Gera um ID único baseado no timestamp atual.
    expense: expense.value, // Pega o valor do campo de despesa.
    category_id: category.value, // Pega o valor do campo de categoria.
    category_label: category.options[category.selectedIndex].text, // Pega o texto da opção selecionada no campo de categoria.
    amount: amount.value, // Pega o valor do campo de valor.
    created_at: new Date(),
  }
  expenseAdd(newExpense) // Chama a função para adicionar a despesa, passando o objeto criado como argumento.
}

// Adiciona um novo item (li) na lista (ul) de despesas.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento (li) para ser adicionado e exibido na lista (ul).
    const expenseItem = document.createElement("li") // Cria um elemento <li> para ser adicionado a lista de despesa.
    expenseItem.classList.add("expense") // Adiciona uma classe CSS ao elemento para manter a estilização do elemento criado.

    // Cria o ícone da despesa.
    const expenseIcon = document.createElement("img") // Cria um elemento <img> para definir como o ícone da despesa de acordo com a categoria.
    expenseIcon.setAttribute("src", `../img/${newExpense.category_id}.svg`) // Define o atributo src da imagem com base na categoria selecionada.
    expenseIcon.setAttribute(
      "alt",
      `Ícone da categoria ${newExpense.category_label}`
    ) // Define o atributo alt da imagem para acessibilidade.

    // Cria as informações da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_label

    // Adiciona o nome e a categoria na div de informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // Cria o icone que remove o valor da despesa.
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "../img/remove.svg")
    removeIcon.setAttribute("alt", "Remover")

    // Adiciona o item (li) a lista (ul) com as informações da despesa.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon) // Adiciona o ícone da despesa ao item da despesa.

    // Adiciona o item a lista de despesas.
    expenseList.append(expenseItem) // Adiciona o item da despesa à lista de despesas.

    // Reseta o formulário.
    resetForm()

    // Atualiza o valor total.
    updateTotalValue()
  } catch (error) {
    alert("Não foi possível adicionar a despesa.")
    console.log(error)
  }
}

// Atualiza o total
function updateTotalValue() {
  try {
    // Cria uma variável chamada item que armazena todos os elementos filhos (li) da lista (ul) de despesas.
    // Pega o elemento paoi (ul) e usa a propriedade .children para obter uma coleção de todos os seus elementos filhos diretos.
    const items = expenseList.children

    // Atualiza o texto do span que mostra a quantidade de despesas e usa uma lógica para colocar o texto no plural.
    // Para a variável capturada expensesQuantity atualiza o texto do span que mostra a quantidade de despesas.
    // Se a quantidade de itens for diferente de 1, adiciona um "s" ao final da palavra "despesa" para indicar o plural. Caso contrário, mantém no singular.
    expensesQuantity.textContent = `${items.length} despesa${
      items.length !== 1 ? "s" : ""
    }`

    // Cria uma variável chamada total que armazena o valor total das despesas e inicia com 0.
    // Será usada para acumular o valor total das despesas.
    let total = 0

    // Percorre todos os itens (li) da lista (ul) de despesas.
    // Começa a contagem no índice zero (a primeira despesa).
    // Enquanto a variável de controle (item) for menor que o número total de itens (items.length) adiciona 1 ao índice (item++).
    for (let item = 0; item < items.length; item++) {
      // Cria uma constante chamada itemAmount.
      // Essa constante irá armazenar a despesa atual (items[item] / na lista de itens o item de índice 0, 1, 2, 3...).
      // E dentro da constante irá buscar o primeiro elemento com a classe .expense-amount.
      const itemAmount = items[item].querySelector(".expense-amount")

      // Declara uma variável chamada amountValue que irá armazenar o conteúdo de texto (textContent) do elemento itemAmount.
      // Através de uma expressão regular (regex) irá considerar apenas os valores numéricos (0-9).
      // E também irá substituir a vírgula por ponto para realizar o cálculo corretamente e considerar os centavos.
      let amountValue = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".")

      // Converte o resultado final da variável amountValue após o tratamento para um número decimal/ponto flutuante.
      amountValue = parseFloat(amountValue)

      // Verifica se o valor convertido é um número válido.
      // Se não for um número (isNaN) exibe um alerta e interrompe a execução da função.
      if (isNaN(amountValue)) {
        return alert("Não foi possível calcular. Valor inválido!")
      }
      // Se o valor for válido ele é adicionado (somado) ao valor atual da variável total assim acumulando a soma geral das despesas.
      total += Number(amountValue)
    }

    // Cria a variável formattedTotal que irá armazenar o valor total formatado como moeda local (BRL).
    const formattedSymbol = document.createElement("small")
    formattedSymbol.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido no elemento <small> criado acima com estilo personalizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo atual do elemento expensesTotal.
    expensesTotal.innerHTML = ""

    // Adiciona o símbolo da moeda formatada (R$) ao elemento expensesTotal.
    expensesTotal.append(formattedSymbol, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar o valor total.")
  }
}

// Evento que captupra o clique no ícone de remover despesa.
expenseList.addEventListener("click", function (event) {
  // Verificar se o elemento clicado é o ícone de remover a despesa.
  if (event.target.classList.contains("remove-icon")) {
    // Cria uma variável chamada clickedItem que irá armazenar o elemento pai do ícone de remover quando clicado.
    // Neste caso o elemento pai é o item da despesa (li).
    const clickedItem = event.target.closest("ul li.expense")
    // remove o item da lista de despesas.
    clickedItem.remove()
  }
  // Atualiza o valor total após a remoção do item da lista de despesas.
  updateTotalValue()
})

function resetForm() {
  // Realiza o reset do formulário. Limpa todos os campos.
  form.reset()

  // Define o foco (cursor) no campo de despesa para facilitar a digitação.
  expense.focus()
}
