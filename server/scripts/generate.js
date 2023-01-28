const secp =  require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");


const privateKey = secp.utils.randomPrivateKey();

const publicKey = secp.getPublicKey(privateKey);

console.log(toHex(publicKey))
console.log(toHex(privateKey))
/*
private key :- 
1. fc85c59a5ca3f79c22c889d0f928603e13adef6ff4cff53058fba6d0caf74d98
2. ba85c03df951cac92f0fc2b4f7968eab97fbbdc7d2dae72dc0eaf48d8e838918
3. d20382734c1c681b91a1ba9c3e2e38bd0e2e7d3f190ad70f69350ed48186203f

*/