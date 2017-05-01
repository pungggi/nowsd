const shell = require('shelljs')
const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const readline = require('readline')

// console.log(`You are workin on ${process.platform}
// your homedir is: ${os.homedir()}
// whereas your tempdir is: ${os.tmpdir()}`)

exports.printMsg = () => {
    shell.exec("npm -v")
}

exports.dev =
    (
        command = 'next',
        input = path.resolve(process.cwd(), ".env")
    ) => {
        return new Promise((resolve, reject) => {
            console.log(input)
            let script = ""
            const dotenv = readline.createInterface({
                input: fs.createReadStream(input)
            })

            dotenv.on("line", line => {
                if (line.includes("=")) {
                    script += `set ${line} \n`
                }
            })
            dotenv.on("close", () => {
                script += `& ${command}`
                // console.log(script)
                shell.exec(script)
                readline.clearLine(dotenv, 0)
                resolve(script)
            })
        })
    }

exports.createdeploy = async () => {
    fs.outputFile(path.resolve(__dirname, "deploy.js"),
        `x`)
}

