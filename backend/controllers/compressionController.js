const huffmanCoding = require('../utils/huffmanCoding');

exports.compress = (req, res) => {
  const fileContent = req.file.buffer.toString('utf8');

  try {
    const compressedData = huffmanCoding.compress(fileContent);

    const compressedBuffer = Buffer.from(compressedData);

    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="compressed.huff"',
      'Content-Length': compressedBuffer.length,
    });

    res.end(compressedBuffer);
  } catch (err) {
    res.status(500).json({ message: 'compression error' });
  }
};

exports.decompress = (req, res) => {
  const fileContent = req.file.buffer.toString('utf8');

  try {
    const decompressedData = huffmanCoding.decompress(fileContent);

    const decompressedBuffer = Buffer.from(decompressedData);

    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="decompressed.txt"',
      'Content-Length': decompressedBuffer.length,
    });

    res.end(decompressedBuffer);
  } catch (err) {
    res.status(500).json({ message: 'decompression error' });
  }
};
