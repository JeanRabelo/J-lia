// rsa_encrypt.js

let encryptedMessageArray = [];

function encryptMessage(message, e, n) {
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = '';
    encryptedMessageArray = [];
    for (let i = 0; i < message.length; i++) {
        let charCode = BigInt(message.charCodeAt(i));
        let encryptedCharCode = modPow(charCode, e, n);
        encryptedMessageArray.push(encryptedCharCode.toString());

        let charContainer = document.createElement('div');
        charContainer.classList.add('char-container');
        let originalSpan = document.createElement('span');
        originalSpan.classList.add('char', 'old-char');
        originalSpan.textContent = message[i];
        let encryptedSpan = document.createElement('span');
        encryptedSpan.classList.add('char', 'new-char');
        encryptedSpan.textContent = encryptedCharCode.toString();
        charContainer.appendChild(originalSpan);
        charContainer.appendChild(encryptedSpan);
        outputElement.appendChild(charContainer);

        setTimeout(() => { encryptedSpan.classList.add('appear'); }, i * 1000);
        setTimeout(() => { originalSpan.classList.add('move-up'); }, i * 1000 + 500);
        setTimeout(() => { encryptedSpan.classList.add('rise-up'); }, i * 1000 + 1000);
        setTimeout(() => {
            originalSpan.classList.add('fade-out');
            setTimeout(() => { charContainer.removeChild(originalSpan); }, 500);
        }, i * 1000 + 1500);
    }
    setTimeout(() => {
        let encryptedText = encryptedMessageArray.join(', ');
        let resultText = document.createElement('p');
        resultText.textContent = "Mensagem Criptografada Completa: " + encryptedText;
        outputElement.appendChild(resultText);
    }, message.length * 1000 + 2000);
    document.getElementById('result').style.display = 'block';
}

function copyToClipboard() {
    const encryptedText = encryptedMessageArray.join(', ');
    navigator.clipboard.writeText(encryptedText).then(() => {
        const copyButton = document.getElementById('copyButton');
        copyButton.classList.add('copied');
        copyButton.textContent = "Copiado!";
        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.textContent = "Copiar para Área de Transferência";
        }, 2000);
    });
}

document.getElementById('encryptButton').addEventListener('click', function() {
    let message = document.getElementById('messageInput').value;
    let publicKey = document.getElementById('publicKey').value.split(',');
    let e = BigInt(publicKey[0].trim());
    let n = BigInt(publicKey[1].trim());
    encryptMessage(message, e, n);
});
