class EduChain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.createBlock(1, '0');
    }

    createBlock(proof, previousHash) {
        const block = {
            index: this.chain.length + 1,
            timestamp: new Date().toUTCString(),
            transactions: this.pendingTransactions,
            proof: proof,
            previous_hash: previousHash,
        };
        this.pendingTransactions = [];
        this.chain.push(block);
        return block;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(sender, receiver, amount) {
        if (!sender || !receiver || amount <= 0) {
            alert("❌ Invalid transaction.");
            return;
        }
        this.pendingTransactions.push({ sender, receiver, amount });
        alert("✅ Transaction added.");
    }

    proofOfWork(previousProof) {
        let proof = 1;
        while (true) {
            const hashOperation = sha256((proof ** 2 - previousProof ** 2).toString());
            if (hashOperation.substring(0, 4) === '0000') {
                return proof;
            }
            proof++;
        }
    }

    hash(block) {
        return sha256(JSON.stringify(block));
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curr = this.chain[i];
            const prev = this.chain[i - 1];

            if (curr.previous_hash !== this.hash(prev)) {
                return false;
            }

            const hashOperation = sha256((curr.proof ** 2 - prev.proof ** 2).toString());
            if (hashOperation.substring(0, 4) !== '0000') {
                return false;
            }
        }
        return true;
    }
}

const blockchain = new EduChain();

function addTransaction() {
    const sender = prompt("Sender:");
    const receiver = prompt("Receiver:");
    const amount = parseFloat(prompt("Amount:"));

    if (isNaN(amount)) {
        alert("❌ Invalid amount.");
        return;
    }

    blockchain.addTransaction(sender, receiver, amount);
}

function mineBlock() {
    const previousProof = blockchain.getLastBlock().proof;
    const proof = blockchain.proofOfWork(previousProof);
    const previousHash = blockchain.hash(blockchain.getLastBlock());
    blockchain.createBlock(proof, previousHash);
    alert("⛏️ Block mined successfully!");
}

function showChain() {
    document.getElementById('output').style.display = 'none';

    const container = document.getElementById('blockchain-visual');
    container.innerHTML = '';

    document.getElementById('chain-length').textContent = blockchain.chain.length;

    blockchain.chain.forEach((block, index) => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        blockDiv.innerHTML = `
            <span>Block #${block.index}</span><br>
            <small>Time: ${block.timestamp}</small><br>
            <small>Proof: ${block.proof}</small><br>
            <small>PrevHash: ${block.previous_hash.slice(0, 10)}...</small>
        `;
        container.appendChild(blockDiv);

        if (index !== blockchain.chain.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'arrow';
            container.appendChild(arrow);
        }
    });
}

function validateChain() {
    if (blockchain.isChainValid()) {
        alert("✅ Blockchain is valid.");
    } else {
        alert("❌ Blockchain is NOT valid.");
    }
}

function sha256(ascii) {
    return CryptoJS.SHA256(ascii).toString();
}