# (**Unofficial**) Signing proxy for LINE Blockchain Platform

A simple HTTP proxy server to automate [request signing](https://docs-blockchain.line.biz/api-guide/Authentication)

## How to run

(assuming you have `Node.js` installed)

### Fill-in `node_modules` (only for first run)

```bash
npm install
```

### Execute

```bash
npm start
```

### Configuration file

`$USER_HOME/lbp-signing-proxy.json` is required.
You can easily copy `lbp-singing-proxy.sample.json` and edit values for like `apiSecret` and `endpoint`

### Notes

- it'll add or override `timestamp`, `signature` and `nonce`
- Use for **development only**. Do not use in production (for stability, performance and safety)
