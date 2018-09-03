const express = require('express');
const app = express();
app.use(express.static('./public'));

//Some security
const helmet = require('helmet');
app.use(helmet());

const url = require('url');
const path = require('path');
const VendingMachine = require('./services/VendingMachine');
const vendingMachine = new VendingMachine();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/templates/index.html'));
});


app.get('/getChange',  (req, res) => {
    const urlParts = url.parse(req.url, true);
    const query = urlParts.query;
    if (query.amount) {
        let answer;
        /**
         * mode :
         * 0 - get change without limits;
         * 1 - get change with limits
         */
        if (query.mode) {
            if(query.mode !== '0' && query.mode !== '1') {
                answer = {error: 'Undefined mode. Please check your input'}
            } else {
                const withLimits = query.mode === '1';
                answer = vendingMachine.getChangeFor(query.amount, withLimits);
            }

            if (!answer.error) {
                //success
                return res.json({ answer });
            }
        }
        if (!answer) {
            res.status(400).json({ error: 'Mode is not provided' });
        } else if (answer.error) {
            res.status(400).json({ error: answer.error });
        }
    } else {
        res.status(400).json({ error: 'Amount value is not provided' });
    }
});

app.listen(3000, () => {
    console.log('App running successfully on http://localhost:3000 ');
});