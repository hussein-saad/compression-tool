const fs = require('fs');
const { buildTree, buildCodes } = require('./huffmanTree');

const endOfHeaderMarker = '##END##';
const symbolFreqSeparator = '~';
const symbolsSeparator = '^';

function calculateFrequencies(data) {
  return data.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
}

function compress(data) {
  const freqs = calculateFrequencies(data);

  const tree = buildTree(freqs);
  const codes = buildCodes(tree);

  let header = '';
  for (const [symbol, freq] of Object.entries(freqs)) {
    header += `${symbol}${symbolFreqSeparator}${freq.toString(
      16
    )}${symbolsSeparator}`;
  }
  header += endOfHeaderMarker;

  fs.writeFileSync('header.txt', header, 'utf-8');

  let body = data
    .split('')
    .map((char) => codes[char])
    .join('');

  // pad the body with zeros if necessary to make its length a multiple of 8 bits
  const padding = 8 - (body.length % 8);
  body += '0'.repeat(padding);

  const bytes = body.match(/.{8}/g).map((byte) => parseInt(byte, 2));

  let byteString = '';
  const chunkSize = 1024;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.slice(i, i + chunkSize);
    byteString += String.fromCharCode(...chunk);
  }

  return header + String.fromCharCode(padding) + byteString;
}

function decompress(compressedData) {
  const headerEndIndex =
    compressedData.indexOf(endOfHeaderMarker) + endOfHeaderMarker.length;
  const header = compressedData.slice(
    0,
    headerEndIndex - endOfHeaderMarker.length
  );
  const padding = compressedData.charCodeAt(headerEndIndex);
  const byteString = compressedData.slice(headerEndIndex + 1);

  const freqs = {};
  header.split(symbolsSeparator).forEach((entry) => {
    if (entry) {
      const [symbol, freq] = entry.split(symbolFreqSeparator);
      freqs[symbol] = parseInt(freq, 16);
    }
  });

  const tree = buildTree(freqs);
  const reversedCodes = Object.entries(buildCodes(tree)).reduce(
    (acc, [symbol, code]) => {
      acc[code] = symbol;
      return acc;
    },
    {}
  );

  let body = '';
  for (let i = 0; i < byteString.length; i++) {
    body += byteString.charCodeAt(i).toString(2).padStart(8, '0');
  }
  body = body.slice(0, -padding);

  let currentCode = '';
  let decodedData = '';
  for (const bit of body) {
    currentCode += bit;
    if (currentCode in reversedCodes) {
      decodedData += reversedCodes[currentCode];
      currentCode = '';
    }
  }

  return decodedData;
}

module.exports = { compress, decompress };
