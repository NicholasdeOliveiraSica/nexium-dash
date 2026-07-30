export interface TransactionItem {
  amount: number
  type: 'income' | 'expense'
}

export function calculateTotals(transactions: TransactionItem[]) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = income - expense

  return { income, expense, balance }
}

export function validateTransactionForm(description: string, amount: number | '') {
  if (!description || !description.trim()) {
    return { valid: false, message: 'A descrição é obrigatória.' }
  }

  if (amount === '' || isNaN(Number(amount)) || Number(amount) <= 0) {
    return { valid: false, message: 'O valor deve ser maior que zero.' }
  }

  return { valid: true, message: '' }
}
