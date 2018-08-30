const express = require('express');
const app = express();
app.use(express.static('./public'));

const url = require('url');
const path = require('path');
const VendingMachine = require('./services/VendingMachine');
const vendingMachine = new VendingMachine();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/templates/index.html'));
});

app.get('/getOptimalChangeFor',  (req, res) => {
    let urlParts = url.parse(req.url, true);
    let query = urlParts.query;
    if (query.amount) {
        let result = vendingMachine.getOptimalChangeFor(parseInt(query.amount));
        if (result.change) {
            res.json({ result: result.change });
        } else {
            res.status(500).json({ error: result.error });
        }

    } else {
        res.status(500).json({ error: 'Amount value is not provided' });
    }
});

app.listen(3000, () => {
    console.log('Run successful');
});

//
//
// vendingMachine.getOptimalChangeFor(223233235);
// vendingMachine.getChangeFor(4336);