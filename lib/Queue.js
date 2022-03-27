class Queue {
  constructor(queue = []) {
    this.queue = queue;
  }

  front() {
    if (this.queue.length == 0) {
      return null;
    }
    return this.queue.shift();
  }
}

module.exports = Queue;
