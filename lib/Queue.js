class Queue {
  constructor(queue) {
    if (!Array.isArray(queue)) {
      throw new TypeError(
        `expected queue to be an array, got ${typeof queue}}`
      );
    }

    if (queue.length === 0) {
      throw new Error('expected queue to be non-empty');
    }

    this.queue = queue;
    this._capacity = queue.length;
  }

  get capacity() {
    return this._capacity;
  }

  get length() {
    return this.queue.length;
  }

  front() {
    if (this.length === 0) {
      return null;
    }
    return this.queue.shift();
  }
}

module.exports = Queue;
