## Gerencia de Memória
Implementar um gerenciador de memória que simule a alocação e desalocação de memória em um sistema operacional.

**Implementação:**

1. Inicialmente, o sistema deve possuir um tamanho de memória ao seu gosto. Recomedo trabalhar com unidades grandes do que simplesmente colocar 1GB, isso pode acabar fragmentando de mais os valores (exemplo, vocês terem que trabalhar com valores de 0.05 ou 0.0002) e confundi-los. Deixei uma tabela de referencia das unidades de medidas de armazanamento.

### Tabela de Unidades de Medida para Armazenamento

| **Unidade**   | **Abreviação** | **Equivalência (Decimal)**          | **Equivalência (Binário)**                   |
|---------------|----------------|-------------------------------------|----------------------------------------------|
| **Bit**       | bit            | 1 bit                               | 1 bit                                        |
| **Byte**      | B              | 1 Byte = 8 bits                     | 1 Byte = 8 bits                               |
| **Kilobit**   | Kb             | 1 Kb = 1.000 bits                   | 1 Kb = 1.024 bits                             |
| **Kilobyte**  | KB             | 1 KB = 1.000 bytes                  | 1 KB = 1.024 bytes                            |
| **Megabit**   | Mb             | 1 Mb = 1.000.000 bits               | 1 Mb = 1.048.576 bits                         |
| **Megabyte**  | MB             | 1 MB = 1.000.000 bytes              | 1 MB = 1.048.576 bytes                        |
| **Gigabit**   | Gb             | 1 Gb = 1.000.000.000 bits           | 1 Gb = 1.073.741.824 bits                     |
| **Gigabyte**  | GB             | 1 GB = 1.000.000.000 bytes          | 1 GB = 1.073.741.824 bytes                    |
| **Terabit**   | Tb             | 1 Tb = 1.000.000.000.000 bits       | 1 Tb = 1.099.511.627.776 bits                 |
| **Terabyte**  | TB             | 1 TB = 1.000.000.000.000 bytes      | 1 TB = 1.099.511.627.776 bytes                |

*Obs: A diferença entre as unidades de medida decimal e binária é que a medida decimal é baseada em 1.000 e a binária é baseada em 1.024. A medida binária é a mais utilizada em informática.*

> **Sistema Decimal (SI):** Onde as unidades são baseadas em múltiplos de 1.000.
> **Sistema Binário (IEC):** Onde as unidades são baseadas em múltiplos de 1.024.

2. Partindo do ponto há uma pilha de N processos, dentre esses N processo deve existir **um processo que representa o Sistema Operacional** e o seu tamanho. Todo processo deve possuir um tamanho aleatório. A soma total dos processos deve ser menor ou igual que o tamanho total da memória, sendo assim os processos que não couberem na memória devem ficar na fila de espera.

3. Não implementaremos questão de Swap, ou seja, não haverá a possibilidade de trocar processos de lugar na memória. Os processos devem ser alocados de forma sequencial, ou seja, o primeiro processo a ser alocado deve ser o primeiro da fila de processos.

~~3. Não implementaremos questão de Swap, ou seja, não haverá a possibilidade de trocar processos de lugar na memória. Então cada processo terá um tempo aleatório de execução e ao finalizar o processo, a memória deve ser liberada. Com exeção do processo que representa o Sistema Operacional, que deve ser o primeiro a ser alocado e o último a ser desalocado.~~

~~4. O próximo processo da fila de espera deve ser alocado na memória. Utilizando o algoritmo de alocação escolhido, os algoritmos de alocação *First Fit*, *Best Fit* e *Worst Fit*. No livro abordam esses algoritmos. Mas em resumo, cada estrategia de alocação tem um comportamento diferente, o **First Fit** aloca o primeiro espaço que cabe o processo, o **Best Fit** aloca o menor espaço que cabe o processo e o **Worst Fit** aloca o maior espaço que cabe o processo. Escolha um deste algoritmos para implementar.~~

5. Para determinarmos e conseguirmos gerenciar nossa memória, devemos criar uma estrutura de dados que represente a memória. A memória deve ser representada por um vetor de tamanho N, onde N é o tamanho da memória. 

6. Cada posição do vetor deve ser um objeto que represente um bloco de memória. Cada bloco de memória deve possuir um tamanho, status, onde o status pode ser livre ou ocupado, e um identificador do processo que está ocupando o bloco.
- Exemplo: defini que o tamanho da memória é 1024 bytes, cada indice do vetor representará 1byte, desta forma o vetor terá 1024 posições. Para inciar a alocação da nossa memoria irei representar que tenho 2 processos, um de 500 bytes e outro de 300 bytes, o primeiro processo será alocado nas posições de 0 a 499 e o segundo processo será alocado nas posições de 500 a 799. O restante da memória será livre, podendo ser alocada por outros processos.

7. Resultado final, ao finalizar a execução do seu programa, você deve exibir um relatório com as seguintes informações:
- Tamanho total da memória
- Tamanho total dos processos
- Tamanho total da memória livre
- Tamanho total da memória ocupada
- Processos que foram alocados
- Processos que ficaram na fila de espera
