let shell = require('shelljs')
exports.printMsg = function () {
    console.log("This is a message from the demo package");
    shell.exec("npm -v")
}
console.log("console.log output")