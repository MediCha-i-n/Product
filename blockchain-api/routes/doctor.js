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
        res.json({
            message: 'Include params - patientHash',
        });
        return;
    }
    const queryResult = await queryPatientHash('doctor', decodeURI(patientHash));
    if (!queryResult) {
        res.json({
            message: 'Not exist patientHash'
        });
        return;
    }
    res.json(queryResult);
});

router.post('/uploadPatientData', async (req, res, next) => {
    const { doctorNumber, patientHash, rawImgCID, resultImgCID } = req.body;
    if (!doctorNumber || !patientHash || !rawImgCID || !resultImgCID) {
        res.json({
            message: 'Include body - doctorNumber & patientHash & rawImgCID & resultImgCID'
        });
        return;
    }
    const uploadResult = await uploadPatientData(doctorNumber, patientHash, rawImgCID, resultImgCID);
    if (!uploadResult) {
        res.json({
            message: 'Upload Fail'
        });
        return;
    }
    res.json(uploadResult);
});

module.exports = router;
