// rsa_decrypt.js

let decryptedMessage = '';

function decryptMessage(encryptedMessage, d, n) {
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = '';
    decryptedMessage = '';
    for (let i = 0; i < encryptedMessage.length; i++) {
        let encryptedCharCode = BigInt(encryptedMessage[i]);
        let decryptedCharCode = modPow(encryptedCharCode, d, n);
        let char = String.fromCharCode(Number(decryptedCharCode));
        decryptedMessage += char;

        let charContainer = document.createElement('div');
        charContainer.classList.add('char-container');
        let encryptedSpan = document.createElement('span');
        encryptedSpan.classList.add('char', 'old-char');
        encryptedSpan.textContent = encryptedCharCode.toString();
        let decryptedSpan = document.createElement('span');
        decryptedSpan.classList.add('char', 'new-char');
        decryptedSpan.textContent = char;
        charContainer.appendChild(encryptedSpan);
        charContainer.appendChild(decryptedSpan);
        outputElement.appendChild(charContainer);

        setTimeout(() => { decryptedSpan.classList.add('appear'); }, i * 1000);
        setTimeout(() => { encryptedSpan.classList.add('move-down'); }, i * 1000 + 500);
        setTimeout(() => { decryptedSpan.classList.add('fall-down'); }, i * 1000 + 1000);
        setTimeout(() => {
            encryptedSpan.classList.add('fade-out');
            setTimeout(() => { charContainer.removeChild(encryptedSpan); }, 500);
        }, i * 1000 + 1500);
    }
    setTimeout(() => {
        let resultText = document.createElement('p');
        resultText.textContent = "Mensagem Decriptografada Completa: " + decryptedMessage;
        outputElement.appendChild(resultText);
    }, encryptedMessage.length * 1000 + 2000);
    document.getElementById('result').style.display = 'block';
}

function copyToClipboard() {
    navigator.clipboard.writeText(decryptedMessage).then(() => {
        const copyButton = document.getElementById('copyButton');
        copyButton.classList.add('copied');
        copyButton.textContent = "Copiado!";
        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.textContent = "Copiar para Área de Transferência";
        }, 2000);
    });
}

document.getElementById('decryptButton').addEventListener('click', function() {
    let encryptedInput = document.getElementById('encryptedInput').value;
    let encryptedMessage = encryptedInput.split(',').map(s => s.trim());
    let privateKey = document.getElementById('privateKey').value.split(',');
    let d = BigInt(privateKey[0].trim());
    let n = BigInt(privateKey[1].trim());
    decryptMessage(encryptedMessage, d, n);
});
