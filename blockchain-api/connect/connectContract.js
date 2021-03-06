/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

async function connectContract(orgNum, identity, gateway, wallet) {
    try {
        let connectionProfile;
        if (orgNum === 1) {
            connectionProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../gateway/connection-org1.yaml')), 'utf8');
        } else if (orgNum === 2) {
            connectionProfile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../gateway/connection-org2.yaml')), 'utf8');
        } else {
            throw new Error('Invalid orgNum');
        }

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: identity,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');
        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.medichainnet.medichain smart contract.');
        return await network.getContract('medichain');

    } catch (err) {
        console.error('connectContract() error');
        console.error(err.message);
        throw err;
    } finally {
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();
    }
}

module.exports = {
    connectContract,
};
