const shell = require('shelljs')
const os = require('os')
const fs = require('fs')

console.log(`You are workin on ${process.platform}
your homedir is: ${os.homedir()}
whereas your tempdir: ${os.tmpdir()}`)

exports.printMsg = () => {
    shell.exec("npm -v")
}

