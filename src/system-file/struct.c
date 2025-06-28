#include <stdio.h>
#include <stdlib.h>
#include <locale.h>
#include <time.h>

struct Node {
  int value;
  struct Node *next;
};

int main() {
  double math;
  setlocale(LC_ALL, "pt-br.UTF-8");

  math = (double) 10/3*2;
  printf("Nota: %lf \n", math);

  srand(time(NULL));
  int random_value = rand();
  printf("Rand %i \n", random_value);

  system("pause");
}
