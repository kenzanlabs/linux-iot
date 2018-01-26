'use strict';

let awsIot = require('aws-iot-device-sdk');
const si = require('systeminformation');
const cmdLineProcess = require('aws-iot-device-sdk/examples/lib/cmdline');

function setTopBoxInit(args) {
    let device = awsIot.device({
        keyPath: args.privateKey,
        certPath: args.clientCert,
        caPath: args.caCert,
        clientId: args.clientId,
        region: args.region,
        baseReconnectTimeMs: args.baseReconnectTimeMs,
        keepalive: args.keepAlive,
        protocol: args.Protocol,
        port: args.Port,
        host: args.Host,
        debug: args.Debug
    });

    process.on('SIGINT', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));

    device
        .on('connect', function () {
            // device.subscribe('topic_1');
            console.log('connect');
            sendMetrics();
        });

    device
        .on('message', function (topic, payload) {
            console.log('message', topic, payload.toString());
        });

    function randomCall() {
        let healthData = generateHealthData(true);
        let randomDelay = getRandomInt(20, 60, 0);
        console.log(`publish delay: ${randomDelay}`);
        setTimeout(() => {

            device.publish('health', healthData, {}, err => {
                if (err) {
                    console.log(`ERROR ${err}`);
                    return process.exit(1);
                }
            });
            return randomCall();
        }, randomDelay);
    }

    function sendMetrics() {
        let randomDelay = getRandomInt(200, 600, 0);

        si.cpuTemperature()
            .then((data => {

            device.publish('health', JSON.stringify(data), {}, err => {
                if (err) {
                    console.log(`ERROR ${err}`);
                    return process.exit(1);
                }
                setTimeout(sendMetrics, randomDelay);
            });

        }));
    }
}

function getRandomInt(min, max, precision = 2) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomNum = Math.random() * (max - min) + min;
    const factor = Math.pow(10, precision);
    const randomPrecision = randomNum * factor;
    return Math.round(randomPrecision) / factor;
}

function generateHealthData(str) {
    // randomly picks a client
    let client = MOCK_CLIENT[getRandomInt(0, MOCK_CLIENT.length - 1, 0)];
    client.upstreamSNR = dataGenerationHelper.upstreamSNR(client);
    client.downstreamSNR = dataGenerationHelper.downstreamSNR(client);
    client.power = dataGenerationHelper.power(client);

    console.log(`health data generated:
    ${JSON.stringify(client)}`);
    return str ? JSON.stringify(client) : client;
}

const MOCK_CLIENT = [
    {
        serialNum: '1234',
        node: 'a1'
    }, {
        serialNum: '1233',
        node: 'a1'
    }, {
        serialNum: '1237',
        node: 'a11'
    }, {
        serialNum: '1423',
        node: 'b1'
    }, {
        serialNum: '1445',
        node: 'c2'
    }, {
        serialNum: '1312',
        node: 'b1'
    }, {
        serialNum: '1432',
        node: 'b1'
    }, {
        serialNum: '1434',
        node: 'c1'
    }, {
        serialNum: '1323',
        node: 'c2'
    }, {
        serialNum: '1434',
        node: 'c1'
    }
];

const dataGenerationHelper = {
    upstreamSNR: client => {
        // upstream SNR is set to fluctuate from 70 to 100 by default
        // if client's node is a1, upstream SNR fluctuates from 40 to 70 (potential issues with node a1 modeled)
        
        switch (client.node) {
            case 'a1':
                return getRandomInt(0, 12);
            default:
                return getRandomInt(17, 33)
        }
    },
    downstreamSNR: client => {
        // downstream SNR is correlated with upstream as per 5 more points
        
        var min = Math.floor(client.upstreamSNR - 5) <= 0 ? 0 : client.upstreamSNR - 5;
        var max = Math.ceil(client.upstreamSNR + 5) >= 100 ? 100 : client.upstreamSNR + 5;

        return getRandomInt(min, max, 1);
    },
    power: client => {
        // by default power fluctuates between 90 and 100, if device Num 1009, power fluctuates from 30 to 50 representing potentially defective device.

        switch (client.serialNum) {
            case '1234':
                return getRandomInt(30, 50, 0);
            default:
                return getRandomInt(90, 100, 0);
        }
    }
};

module.exports = cmdLineProcess;

if (require.main === module) {
    cmdLineProcess('Simulates a Set Top Box Thing',
        process.argv.slice(2), setTopBoxInit);
}
