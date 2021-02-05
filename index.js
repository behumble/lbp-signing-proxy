#!/usr/bin/env node

const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
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

const proxy = httpProxy.createProxyServer({
    target: config.endpoint,
    changeOrigin: true,
    secure: false
})

proxy.on('proxyReq', (pReq, req, res, opts) => {
    // referred to https://gist.github.com/NickNaso/96aaad34e305823b9ff6ba3909908f31
    const timestamp = new Date().getTime().toString()
    const nonce = timestamp.slice(-8)   // last 8 digits for nonce
    pReq.setHeader('nonce', nonce)
    pReq.setHeader('timestamp', timestamp)
    const uri = req.url // path + query params, if any
    const body = req.body
    const signature = lbp.generateSignature(nonce, timestamp, req.method, uri, config.apiSecret, body)
    pReq.setHeader('signature', signature)
    let bodyData = JSON.stringify(req.body);
    pReq.setHeader('Content-Type','application/json');
    pReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    pReq.write(bodyData)
})

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use((req, res) => {
    proxy.web(req, res)
})
app.listen(PORT, () => {
    const localUrlInBlue = chalk.blue(`http://localhost:${PORT}`)
    log(`${chalk.green('Request signing proxy')} on ${localUrlInBlue}`)
})
