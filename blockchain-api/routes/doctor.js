'use strict';

let express = require('express');
let router = express.Router();
const { queryPatientHash } = require('../services/queryData');
const { uploadPatientData } = require('../services/uploadData');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/getPatientData/:patientHash', async (req, res, next) => {
    const { patientHash } = req.params;
    if (!patientHash) {
        res.send('Include params - patientHash');
        return;
    }
    const queryResult = await queryPatientHash('doctor', decodeURI(patientHash));
    if (!queryResult) {
        res.send('Not exist patientHash');
        return;
    }
    res.send(queryResult);
});

router.post('/uploadPatientData', async (req, res, next) => {
    const { doctorNumber, patientHash, rawImgCID, resultImgCID } = req.body;
    if (!doctorNumber || !patientHash || !rawImgCID || !resultImgCID) {
        res.send('Include body - doctorNumber & patientHash & rawImg & resultImg');
        return;
    }
    const uploadResult = await uploadPatientData(doctorNumber, patientHash, rawImgCID, resultImgCID);
    if (!uploadResult) {
        res.send('Upload Fail');
        return;
    }
    res.send(uploadResult);
});

module.exports = router;
