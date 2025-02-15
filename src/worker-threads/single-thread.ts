import { Temporal } from '@js-temporal/polyfill';
import { fibonacci } from './fibonacci-function.js';

/**
 * Executa a função `fibonacci` e registra o tempo total de execução em milissegundos.
 * O tempo de execução é calculado desde o início até o final da chamada da função.
 *
 * A duração é registrada no formato `[Total] <duration_in_milliseconds>`.
 */

type SingleThreadParams = {
  message?: string;
  limit?: number;
};

export function singleThread(params?: SingleThreadParams) {
  const start = new Date();

  fibonacci({ limit: params?.limit, message: params?.message });

  const end = new Date();
  console.log(
    `[Total]`,
    Temporal.Duration.from({ milliseconds: end.getTime() - start.getTime() })
      .total({ unit: 'milliseconds' })
      .toFixed(4),
    '\n',
  );
}
