const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const app = express();
const cors = require("cors");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");


app.use(cors());
app.use(express.json());

const balances = {
  "04d438fe65ac895627c8e134aaf82252456dfe57546592ac79d320160103523540e47671cb30dc54eb7ee685d3d8b25eebfd49127a21fd2b30442050bd999cc1be": 100,
  "04b4836b5f69d0ceb0acfd3e5be1c2945ab784f68fba8d030966d6751090c5ac0884b9a06a511cbf2688c423476b0af42eedbcf4d8ac8aa1f1da2a2d774f2c67fd": 50,
  "04813007c0865830f2bacef0f6c3e978642da38a544a87a3abd9078464592599b94906afdbc36138e3f9741034eee479d9197fe3c0a4472c1b29ef233a573b53d2": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, messageHash } = req.body;
  const isSigned = secp.verify(signature, messageHash, sender)
  if (!isSigned) {
    res.status(400).send({message: "Signature not verified"});
  }
  else {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
