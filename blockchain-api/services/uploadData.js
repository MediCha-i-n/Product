'use strict';

const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const { connectContract } = require('../connect/connectContract');

async function uploadPatientData(doctorNumber, patientHash, rawImgCID, resultImgCID) {
    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, '../identity/user/doctorAdmin/wallet'));

    const gateway = new Gateway();

    try {
        const contract = await connectContract(1, 'doctorAdmin', gateway, wallet);

        console.log('Submit medical data upload transaction.');
        const response = await contract.submitTransaction('UploadPatientHash', doctorNumber, patientHash, rawImgCID, resultImgCID);

        // process response
        console.log('Process upload transaction response.');
        const data = Buffer.from(JSON.stringify(response));

        console.log('Transaction complete.');
        return data;
    } catch (error) {
        console.error(`Error processing transaction. ${error}`);
        console.error(error.stack);
        return null;
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}


module.exports = {
    uploadPatientData
};
