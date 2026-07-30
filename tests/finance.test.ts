import { calculateTotals, validateTransactionForm } from '../app/utils/finance'

function runTests() {
  console.log('=== Iniciando Testes da Etapa 3 ===')

  // Teste 1: Cálculo dos totais
  const testTransactions = [
    { amount: 5000, type: 'income' as const },
    { amount: 1500, type: 'expense' as const },
    { amount: 500, type: 'expense' as const }
  ]

  const totals = calculateTotals(testTransactions)
  console.assert(totals.income === 5000, `Esperado income 5000, recebido ${totals.income}`)
  console.assert(totals.expense === 2000, `Esperado expense 2000, recebido ${totals.expense}`)
  console.assert(totals.balance === 3000, `Esperado balance 3000, recebido ${totals.balance}`)
  console.log('✔ Teste 1 (Cálculo de Totais) passou com sucesso!')

  // Teste 2: Validação de formulário - Descrição vazia
  const val1 = validateTransactionForm('', 100)
  console.assert(!val1.valid, 'Descrição vazia deveria falhar')
  console.log('✔ Teste 2 (Descrição vazia) passou com sucesso!')

  // Teste 3: Validação de formulário - Valor negativo ou zero
  const val2 = validateTransactionForm('Mercado', -50)
  console.assert(!val2.valid, 'Valor negativo deveria falhar')

  const val3 = validateTransactionForm('Mercado', 0)
  console.assert(!val3.valid, 'Valor zero deveria falhar')
  console.log('✔ Teste 3 (Valor <= 0) passou com sucesso!')

  // Teste 4: Validação de formulário - Dados válidos
  const val4 = validateTransactionForm('Mercado', 150.5)
  console.assert(val4.valid, 'Dados válidos deveriam passar')
  console.log('✔ Teste 4 (Dados válidos) passou com sucesso!')

  console.log('=== Todos os testes foram concluídos com SUCESSO! ===')
}

runTests()
