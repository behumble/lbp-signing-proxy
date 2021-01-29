const _ = require('lodash')
const crypto = require('crypto')

exports.generateSignature = function(nonce, timestamp, method, uri, apiSecret, body) {
    // https://docs-blockchain.line.biz/api-guide/Authentication
    var signTarget = `${nonce}${timestamp}${method}${uri}`

    if(!_.isEmpty(body)) {
        if(signTarget.indexOf('?')<0) {
            signTarget += '?'
        } else {
            signTarget += '&'
        }
        // TODO any way more neat?
        const objBody = body
        const flatPair = {}     // we're going to convert objBody to flatPair
        Object.keys(objBody).forEach(key => {
            const value = objBody[key]
            if(Array.isArray(value)) {
                // scan for all sub-keys
                let allSubKeys = []
                value.forEach(elem => {
                    allSubKeys = _.union(allSubKeys, Object.keys(elem))
                })
                // now we have keys for elements. fill-in flatPair
                value.forEach(elem => { // for each element on the array
                    allSubKeys.forEach(subKey => {
                        const flatKey = `${key}.${subKey}`
                        const flatRawValue = elem[subKey] ? elem[subKey] : ''
                        const prevFlatValue = flatPair[flatKey]
                        const flatValue = prevFlatValue==undefined ? flatRawValue : `${prevFlatValue},${flatRawValue}`
                        flatPair[flatKey] = flatValue
                    })
                })
            } else {
                flatPair[key] = objBody[key]
            }
        })
        const bodyPart = Object.keys(flatPair).sort().map(key => `${key}=${flatPair[key]}`).join('&')
        signTarget += bodyPart
    }
    console.log('Sign target :', signTarget)
    const hmac = crypto.createHmac('sha512', apiSecret)
    const signature = hmac.update(signTarget).digest('base64')
    return signature
}
