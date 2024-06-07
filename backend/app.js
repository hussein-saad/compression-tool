const express = require('express');
const cors = require('cors');

const compressionRoutes = require('./routes/compressionRoutes');

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/compression', compressionRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
