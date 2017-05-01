const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const readline = require('readline')

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
        command = 'now',
        input = path.resolve(process.cwd(), ".env")
    ) => {
        return new Promise((resolve, reject) => {
            let script = `${command} `
            const src = readline.createInterface({
                input: fs.createReadStream(input)
            })

            src.on("line", line => {
                if (line.includes("=")) {
                    script += `-e ${line} `
                }
            })
            src.on("close", () => {
                readline.clearLine(src, 0)
                resolve(script)
            })
        })
    }

// exports.createdeploy = async () => {
//     fs.outputFile(path.resolve(__dirname, "deploy.js"),
//         `x`)
// }