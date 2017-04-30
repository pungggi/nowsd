let shell = require('shelljs')
exports.printMsg = () => {
    console.log(`You are workin on ${process.platform}`);
    shell.exec("npm -v")
}