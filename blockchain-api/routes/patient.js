'use strict';

let express = require('express');
let router = express.Router();
const { queryPatientHash } = require('../services/queryData');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/getMyData/:myHash', async (req, res, next) => {
    const { myHash } = req.params;
    if (!myHash) {
        res.json({
            message: 'Include params - myHash'
        });
        return;
    }
    const queryResult = await queryPatientHash('patient', decodeURI(myHash));
    if (!queryResult) {
        res.json({
            message: 'Not exist myHash'
        });
        return;
    }
    res.json(queryResult);
});

module.exports = router;
