module.exports = () => {
    const express = require('express');
    const app = express();
    const port = 3000;
  
    app.get('/', (req, res) => res.send("Khao's Server Manager Discord Bot"));
  
    app.listen(port, () => console.log(`Listening at port ${port}`));
}