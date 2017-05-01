const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const readline = require('readline')
const now = require('now-client')('6FuTYkrAFe6lLFOvMV7CwRQ9')
now.getSecrets()
    .then(secrets => {
        console.log(secrets)
    })
    .catch(error => {
        console.error(error)
    })

exports.dev =
    (
        command = 'next',
        input = path.resolve(process.cwd(), ".env")
    ) => {
        return new Promise((resolve, reject) => {
            let script = ""
            const src = readline.createInterface({
                input: fs.createReadStream(input)
            })

            src.on("line", line => {
                if (line.includes("=")) {
                    if (os.platform() == 'win32') {
                        script += `set `
                    }
                    script += `${line} & `
                }
            })
            src.on("close", () => {
                script += `${command}`
                readline.clearLine(src, 0)
                resolve(script)
            })
        })
    }

exports.deploy =
    (
        token,
        command = 'now',
        input = path.resolve(process.cwd(), ".env")
    ) => {
        return new Promise((resolve, reject) => {
            if(!token)
            {
                reject('Token missing. See https://zeit.co/account/tokens.')
            }
            let script = `${command} `
            const source = readline.createInterface({
                input: fs.createReadStream(input)
            })

            source.on("line", line => {
                if (line.includes("=")) {
                    script += `-e ${line} `
                }
            })
            source.on("close", () => {
                readline.clearLine(source, 0)
                resolve(script)
            })
        })
    }

// exports.createdeploy = async () => {
//     fs.outputFile(path.resolve(__dirname, "deploy.js"),
//         `x`)
// }