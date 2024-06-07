const express = require('express');

const compressionRoutes = require('./routes/compressionRoutes');

const app = express();

app.use(express.json());

app.use('/api/compression', compressionRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
