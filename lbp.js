const crypto = require('crypto')

exports.generateSignature = function(nonce, timestamp, method, uri, apiSecret, body) {
    // https://docs-blockchain.line.biz/api-guide/Authentication
    var signTarget = `${nonce}${timestamp}${method}${uri}`

    if(body) {
        if(signTarget.indexOf('?')<0) {
            signTarget += '?'
        }
        const objBody = JSON.parse(body)
        const keyValueList = [] // each element is array of size 2 (0-key, 1-value)
        Object.keys(objBody).forEach(key => {
            keyValueList.push([key, objBody[key]])
        })
        keyValueList.sort((a, b) => {
            if(a[0] === b[0]) return 0
            if(a[0] < b[0]) return -1
            return 1
        })
        console.log('Sorted Flat List : ', keyValueList)
        const bodyPart = keyValueList.map(elem => `${elem[0]}=${elem[1]}`).join('&')
        signTarget += bodyPart
    }
    console.log('Sign target :', signTarget)
    const hmac = crypto.createHmac('sha512', apiSecret)
    const signature = hmac.update(signTarget).digest('base64')
    return signature
}