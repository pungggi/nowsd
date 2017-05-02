const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const readline = require('readline')
const nowClient = require('now-client')
const { findIndex } = require('lodash')

let nowToken = ""
_addSecret = async (name, value) => {
    console.log(` add ${name} as ${value}`)
    let data = await nowClient(nowToken).createSecret(name, value)
}
_resetSecret = async (name, value) => {
    let data = await nowClient(nowToken).deleteSecret(name, value)
    console.log(` add ${name} as ${value}`)
    data = await nowClient(nowToken).createSecret(name, value)
}

exports.dev =
    (
        command = 'next',
        input = path.resolve(process.cwd(), ".secrets")
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

exports.prod =
    (
        token,
        command = 'now',
        input = path.resolve(process.cwd(), ".secrets")
    ) => {
        return new Promise(
            (
                resolve,
                reject
            ) => {
                if (!token) {
                    reject('Token missing. See https://zeit.co/account/tokens.')
                    return
                }
                nowToken = token
                nowClient(nowToken).getSecrets()
                    .then(secrets => {
                        let script = `${command} `
                        let promises = []
                        const source = readline.createInterface({
                            input: fs.createReadStream(input)
                        })
                        // for (let secret of secrets) {
                        //     console.log(secret.name)
                        // }
                        source.on("line", line => {
                            if (line.includes("=")) {
                                let envVar = line.split("=")[0].toLowerCase()
                                let indexFound = findIndex(secrets, ['name', envVar])
                                indexFound == -1 ?
                                    promises.push(_addSecret(envVar, line.split("=")[1])) :
                                    promises.push(_resetSecret(envVar, line.split("=")[1]))
                                script += `-e ${envVar}=@${envVar} `
                            }
                        })
                        source.on("close", () => {
                            readline.clearLine(source, 0)
                            Promise.all(promises)
                            .then( values => {
                                console.log(script)
                                resolve(script)
                            })
                        })
                    })
                    .catch(error => {
                        console.error(error)
                    })
            })
    }

// exports.createdeploy = async () => {
//     fs.outputFile(path.resolve(__dirname, "deploy.js"),
//         `x`)
// }