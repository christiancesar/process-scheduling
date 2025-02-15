const fibonacci_LIMIT = 10e4;

function sum(a: number, b: number): number {
  return a + b;
}

type fibonacciParams = {
  message?: string;
  limit?: number;
};

/**
 * Gera uma sequência de números de Fibonacci até um limite especificado.
 *
 * @param {fibonacciParams} [params] - Parâmetros opcionais para a sequência de Fibonacci.
 * @param {number} [params.limit] - O limite até o qual a sequência de Fibonacci é gerada. O padrão é `fibonacci_LIMIT`.
 */

export function fibonacci(params?: fibonacciParams) {
  console.log('fibonacci function called from:', params?.message);
  const limit = params?.limit || fibonacci_LIMIT;

  console.log('fibonacci limit:', limit);

  let initial = 0;
  for (let i = 0; i < limit; i++) {
    initial = sum(initial, i);
  }
}
