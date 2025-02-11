const FIBONATTI_LIMIT = 10e4;

function sum(a: number, b: number): number {
  return a + b;
}

type FibonattiParams = {
  message?: string;
  limit?: number;
};

/**
 * Gera uma sequência de números de Fibonacci até um limite especificado.
 *
 * @param {FibonattiParams} [params] - Parâmetros opcionais para a sequência de Fibonacci.
 * @param {number} [params.limit] - O limite até o qual a sequência de Fibonacci é gerada. O padrão é `FIBONATTI_LIMIT`.
 */

export function fibonatti(params?: FibonattiParams) {
  console.log('Fibonatti function called from:', params?.message);
  const limit = params?.limit || FIBONATTI_LIMIT;

  console.log('Fibonatti limit:', limit);

  let initial = 0;
  for (let i = 0; i < limit; i++) {
    initial = sum(initial, i);
  }
}
