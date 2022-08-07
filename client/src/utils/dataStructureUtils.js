export class Stack {
  constructor() {
    this.items = [];
  }

  // add element to the stack
  push(element) {
    this.items.push(element);
  }

  // remove element from the stack
  pop() {
    if (this.items.length > 0) return this.items.pop();
  }

  // view the last element
  peek() {
    if (this.items.length === 0) return undefined;
    return this.items[this.items.length - 1];
  }

  // check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // the size of the stack
  size() {
    return this.items.length;
  }

  // empty the stack
  clear() {
    this.items = [];
  }
}

// add append, removing of elements, keep track of length as well
export class NutrientPrioritySet {
  constructor(array) {
    this.priority = Object.fromEntries(
      array.map((item, index) => [item, index])
    );
    this.items = new Set(array);
    this.length = array.length;
  }

  has(element) {
    return this.items.has(element);
  }

  indexOf(element) {
    if (!this.has(element)) return -1;
    return this.priority[element];
  }
}
