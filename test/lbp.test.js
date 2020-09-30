const assert = require('assert')
const lbp = require('../lbp')

// https://docs-blockchain.line.biz/api-guide/Authentication

describe('Example 1:Request Path Only', () => {
    it('should result in an expected signature', () => {
        const nonce = 'Bp0IqgXE'
        const timestamp = '1581850266351'
        const method = 'GET'
        const uri = '/v1/wallets'
        const apiSecret = '9256bf8a-2b86-42fe-b3e0-d3079d0141fe'
        const sig = lbp.generateSignature(nonce, timestamp, method, uri, apiSecret, null)
        assert.strictEqual('2LtyRNI16y/5/RdoTB65sfLkO0OSJ4pCuz2+ar0npkRbk1/dqq1fbt1FZo7fueQl1umKWWlBGu/53KD2cptcCA==', sig)
    })
})

describe('Example 2:Request path and query parameter', () => {
    it('should result in an expected signature', () => {
        const nonce = 'Bp0IqgXE'
        const timestamp = '1581850266351'
        const method = 'GET'
        const uri = '/v1/wallets/tlink1fr9mpexk5yq3hu6jc0npajfsa0x7tl427fuveq/transactions?page=2&msgType=coin/MsgSend'
        const apiSecret = '9256bf8a-2b86-42fe-b3e0-d3079d0141fe'
        const sig = lbp.generateSignature(nonce, timestamp, method, uri, apiSecret, null)
        assert.strictEqual('fasfnqKVVClFam+Dov+YN+rUfOo/PMZfgKx8E36YBtPh7gB2C+YJv4Hxl0Ey3g8lGD0ErEGnD0gqAt85iEhklQ==', sig)
    })
})

describe('Example 3:Request path and request body (no arrays)', () => {
    // https://docs-blockchain.line.biz/api-guide/Authentication
    it('should result in an expected signature', () => {
        const nonce = 'Bp0IqgXE'
        const timestamp = '1581850266351'
        const method = 'PUT'
        const uri = '/v1/item-tokens/61e14383/non-fungibles/10000001/00000001'
        const apiSecret = '9256bf8a-2b86-42fe-b3e0-d3079d0141fe'
        const body = `{
            "ownerAddress": "tlink1fr9mpexk5yq3hu6jc0npajfsa0x7tl427fuveq", 
            "ownerSecret": "uhbdnNvIqQFnnIFDDG8EuVxtqkwsLtDR/owKInQIYmo=", 
            "name": "NewName"
        }`
        const sig = lbp.generateSignature(nonce, timestamp, method, uri, apiSecret, body)
        assert.strictEqual('4L5BU0Ml/ejhzTg6Du12BDdElv8zoE7XD/iyOaZ2BHJIJG0SUOuCZWXu0YaF4i4C2CFJhjZoJFsje4CJn/wyyw==', sig)
    })
})

describe('Example 4:Request path and request body (with arrays)', () => {
    it('should result in an expected signature', () => {
        const nonce = 'Bp0IqgXE'
        const timestamp = '1581850266351'
        const method = 'POST'
        const uri = '/v1/item-tokens/61e14383/non-fungibles/multi-mint'
        const apiSecret = '9256bf8a-2b86-42fe-b3e0-d3079d0141fe'
        const body = `{
            "ownerAddress": "tlink1fr9mpexk5yq3hu6jc0npajfsa0x7tl427fuveq",
            "ownerSecret": "uhbdnNvIqQFnnIFDDG8EuVxtqkwsLtDR/owKInQIYmo=",
            "toAddress": "tlink18zxqds28mmg8mwduk32csx5xt6urw93ycf8jwp",
            "mintList": [
                {
                  "tokenType": "10000001",
                  "name": "NewNFT"
                },
                {
                  "tokenType": "10000003",
                  "name": "NewNFT2",
                  "meta": "New nft 2 meta information"
                }
            ]
        }`
        const sig = lbp.generateSignature(nonce, timestamp, method, uri, apiSecret, body)
        assert.strictEqual('4L5BU0Ml/ejhzTg6Du12BDdElv8zoE7XD/iyOaZ2BHJIJG0SUOuCZWXu0YaF4i4C2CFJhjZoJFsje4CJn/wyyw==', sig)
    })
})
