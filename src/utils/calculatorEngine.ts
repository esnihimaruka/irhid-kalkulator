export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface CalculatorState {
  currentInput: string;
  previousValue: number | null;
  operator: string | null;
  waitingForSecondOperand: boolean;
  expression: string;
  memory: number;
  history: HistoryItem[];
}

export const initialCalculatorState: CalculatorState = {
  currentInput: '0',
  previousValue: null,
  operator: null,
  waitingForSecondOperand: false,
  expression: '',
  memory: 0,
  history: []
};

// Clean floating point errors (e.g. 0.1 + 0.2 = 0.3)
export function sanitizeNumber(num: number): number {
  return parseFloat(num.toPrecision(12));
}

// Format numbers nicely for display: e.g. 1000000 -> 1,000,000
export function formatDisplayNumber(value: string): string {
  if (value === 'Error' || value === 'Infinity' || value === '-Infinity' || value === 'NaN') {
    return 'Error';
  }
  if (!value) return '0';

  const parts = value.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : null;

  // Format integer with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (decimalPart !== null) {
    return `${formattedInteger}.${decimalPart}`;
  }
  return formattedInteger;
}

export function performCalculation(first: number, second: number, operator: string): number {
  switch (operator) {
    case '+':
      return sanitizeNumber(first + second);
    case '-':
      return sanitizeNumber(first - second);
    case '*':
      return sanitizeNumber(first * second);
    case '/':
      if (second === 0) {
        throw new Error('DivByZero');
      }
      return sanitizeNumber(first / second);
    default:
      return second;
  }
}

export function getOperatorSymbol(op: string | null): string {
  switch (op) {
    case '+':
      return '+';
    case '-':
      return '−';
    case '*':
      return '×';
    case '/':
      return '÷';
    default:
      return '';
  }
}
