const chalk = require('chalk')
const fs = require('fs')
const http = require('http')
const httpProxy = require('http-proxy')
const lbp = require('./lbp')
const log = console.log
const morgan = require('morgan')
const os = require('os')
const path = require('path')

const PORT = 8282
const CONFIG_FILENAME = 'lbp-signing-proxy.json'
const configPath = path.join(os.homedir(), CONFIG_FILENAME)

var config = null

function readConfig() {
    const config = JSON.parse(fs.readFileSync(configPath))
    return config
}

try {
    config = readConfig()
} catch (e) {
    log(`Please ensure [${chalk.green(configPath)}] is valid`)
    const samplePathInGreen = chalk.green(path.join(__dirname, 'lbp-signing-proxy.sample.json'))
    log(`You can copy an example from ${samplePathInGreen}`)
    process.exit(1)
}

const localUrlInBlue = chalk.blue(`http://localhost:${PORT}`)
log(`${chalk.green('Request signing proxy')} on ${localUrlInBlue}`)

const proxy = httpProxy.createProxyServer({
    target: config.endpoint,
    secure: false
})

proxy.on('proxyReq', (pReq, req, res, opts) => {
    const timestamp = new Date().getTime().toString()
    pReq.setHeader('service-api-key', config.apiKey)
    const nonce = timestamp.slice(-8)   // last 8 digits for nonce
    pReq.setHeader('nonce', nonce)
    pReq.setHeader('timestamp', timestamp)
    const uri = req.url // path + query params, if any
    const body = req.rawBody
    const signature = lbp.generateSignature(nonce, timestamp, req.method, uri, config.apiSecret, body)
    pReq.setHeader('signature', signature)
    console.log('Request ', req)
})

const httpLogger = morgan('combined')

http.createServer((req, res) => {
    httpLogger(req, res, err => { if(err) console.error(err) })
    proxy.web(req, res)
}).listen(PORT)