const express = require('express');
const app = express();
const PATH = require('path')
const PORT = process.env.PORT || 8000;
app.use(express.static(PATH.join(__dirname, 'public')));


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})