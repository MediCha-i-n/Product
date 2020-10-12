'use strict';

const { connectContract } = require('../connect/connectContract');

const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

async function queryPatientHash(id, patientHash) {
    let orgNum;
    let identity;

    if (id === 'doctor') {
        identity = 'doctorAdmin';
        orgNum = 1;
    } else if (id === 'patient') {
        identity = 'patientAdmin';
        orgNum = 2;
    } else {
        throw Error('Invalid id');
    }
    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, `../identity/user/${identity}/wallet`));

    const gateway = new Gateway();

    try {
        const contract = await connectContract(orgNum, identity, gateway, wallet);

        // query medical data
        console.log('Evaluate patientHash Data query transaction.');
        const queryResponse = await contract.evaluateTransaction('GetPatientHashHistory', patientHash);

        // process response
        console.log('Process query transaction response.');
        const queryData = JSON.parse(queryResponse.toString());
        console.log('Transaction complete.');

        return queryData;
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
    queryPatientHash,
};
