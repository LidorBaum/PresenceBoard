const devConfig = require('./dev');
const prodConfig = require('./prod');

const environment = process.env.ENVIRONMENT;
console.log(environment);
function tryRequire(env) {
    try {
        return require(`./${env}`);
    } catch (err) {
        if ('MODULE_NOT_FOUND' === err.code) {
            throw Error(
                'Incorrect ENVIRONMENT variable set, exiting\nAllowed Environments:\n1. dev\n2. prod\n3',
            );
        }
    }
}

const envConfig = tryRequire('./prod');

module.exports = envConfig;
