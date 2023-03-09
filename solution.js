const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

 function shop(n, k, centers, roads) {
  let fishes = new Array(n + 1).fill(0);
  let graph = new Array(n + 1).fill(null).map(() => []);
  const INF = Number.POSITIVE_INFINITY;
  let ans = INF;
  let d = new Array(n + 1).fill(null).map(() => new Array(1 << k).fill(INF));

  for (let i = 0; i < centers.length; i++) {
    const center = centers[i].split(' ').map((num) => parseInt(num));
    for (let j = 1; j < center.length; j++) {
      fishes[i + 1] |= 1 << (center[j] - 1);
    }
  }

  for (let i = 0; i < roads.length; i++) {
    const [u, v, w] = roads[i];
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  d[1][fishes[1]] = 0;
  const pq = new PriorityQueue((a, b) => a[0] < b[0])
  pq.push([0, 1, fishes[1]])
  //const pq = [[0, 1, fishes[1]]]; // distance, node, fishes bitmask

  while (!pq.isEmpty()) {
    const [distance, u, fishes_bitmask] = pq.pop();

    for (let i = 0; i < graph[u].length; i++) {
      const [v, w] = graph[u][i];
      if (d[v][fishes_bitmask | fishes[v]] > distance + w) {
        d[v][fishes_bitmask | fishes[v]] = distance + w;
        pq.push([distance + w, v, fishes_bitmask | fishes[v]]);
      }
    }
  }

  const target = (1 << k) - 1;
  const last_row = d[n];

  for (let i = 0; i < 1 << k; i++) {
    for (let j = i; j < 1 << k; j++) {
      if ((i | j) === target) {
        ans = Math.min(ans, Math.max(last_row[i], last_row[j]));
      }
    }
  }
  return ans;
}

module.exports = {shop, PriorityQueue, top, parent, left, right}
