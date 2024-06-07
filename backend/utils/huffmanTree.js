class Node {
  constructor(symbol, freq, left = null, right = null) {
    this.symbol = symbol;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

function buildTree(freqs) {
  const nodes = Object.entries(freqs).map(
    ([symbol, freq]) => new Node(symbol, freq)
  );

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const newNode = new Node(null, left.freq + right.freq, left, right);
    nodes.push(newNode);
  }
  return nodes[0];
}

function buildCodes(tree, prefix = '', codes = {}) {
  if (tree.symbol !== null) {
    codes[tree.symbol] = prefix;
  } else {
    buildCodes(tree.left, prefix + '0', codes);
    buildCodes(tree.right, prefix + '1', codes);
  }
  return codes;
}

module.exports = { buildTree, buildCodes };
