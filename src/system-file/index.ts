class BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;

  constructor(isLeaf: boolean) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = [];
  }
}

class BTree {
  root: BTreeNode;
  // Número máximo de chaves permitidas em um nó (para árvore 2-3: 2 chaves, ou seja, 3 filhos no máximo)
  readonly MAX_KEYS = 2;

  constructor() {
    this.root = new BTreeNode(true);
  }

  // Insere uma nova chave na árvore
  insert(key: number): void {
    const root = this.root;
    // Se o nó raiz estiver cheio, precisamos dividir a raiz
    if (root.keys.length === this.MAX_KEYS) {
      const newRoot = new BTreeNode(false);
      newRoot.children.push(root);
      this.splitChild(newRoot, 0);
      this.insertNonFull(newRoot, key);
      this.root = newRoot;
    } else {
      this.insertNonFull(root, key);
    }
  }

  // Insere a chave em um nó que não está cheio
  private insertNonFull(node: BTreeNode, key: number): void {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      // Insere a chave na posição correta para manter a ordem
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      node.keys.splice(i + 1, 0, key);
    } else {
      // Procura o filho adequado para descer na árvore
      while (i >= 0 && key < node.keys[i]) {
        i--;
      }
      i++; // Índice do filho onde a chave deve ser inserida

      // Se o filho selecionado estiver cheio, divida-o
      if (node.children[i].keys.length === this.MAX_KEYS) {
        this.splitChild(node, i);
        // Após a divisão, verifica em qual dos dois nós deve inserir a chave
        if (key > node.keys[i]) {
          i++;
        }
      }
      this.insertNonFull(node.children[i], key);
    }
  }

  // Divide o filho cheio do nó pai na posição index
  private splitChild(parent: BTreeNode, index: number): void {
    const fullChild = parent.children[index];
    // fullChild possui 3 chaves após inserção (estará temporariamente com overflow)
    // O índice mediano é 1 (considerando que os índices são 0, 1, 2)
    const midIndex = 1;
    const midKey = fullChild.keys[midIndex];

    // Cria um novo nó que receberá as chaves e filhos à direita da chave mediana
    const newNode = new BTreeNode(fullChild.isLeaf);
    // newNode recebe as chaves após a mediana
    newNode.keys = fullChild.keys.splice(midIndex + 1);
    // Remove a chave mediana do fullChild
    fullChild.keys.splice(midIndex, 1);

    // Se fullChild não for folha, transfere os ponteiros dos filhos correspondentes
    if (!fullChild.isLeaf) {
      newNode.children = fullChild.children.splice(midIndex + 1);
    }
    // Insere a chave mediana no nó pai
    parent.keys.splice(index, 0, midKey);
    // Insere o novo nó como filho do pai, imediatamente à direita do fullChild
    parent.children.splice(index + 1, 0, newNode);
  }

  // Busca uma chave na árvore, retornando true se encontrada, ou false caso contrário
  search(key: number, node: BTreeNode | null = null): boolean {
    if (!node) {
      node = this.root;
    }

    let i = 0;
    // Procura pela posição da chave ou pelo filho a descer
    while (i < node.keys.length && key > node.keys[i]) {
      i++;
    }
    if (i < node.keys.length && key === node.keys[i]) {
      return true;
    }
    if (node.isLeaf) {
      return false;
    }
    return this.search(key, node.children[i]);
  }

  // Função para exibir a árvore (para fins de depuração)
  print(node: BTreeNode = this.root, indent: string = ''): void {
    console.log(indent + 'Keys: ' + node.keys.join(', '));
    if (!node.isLeaf) {
      for (const child of node.children) {
        this.print(child, indent + '  ');
      }
    }
  }
}

// Exemplo de uso:
const btree = new BTree();
const valores = [10, 20, 5, 6, 12, 30, 7, 17];

for (const valor of valores) {
  btree.insert(valor);
}

btree.print();
console.log('Busca 12:', btree.search(12));
console.log('Busca 99:', btree.search(99));
