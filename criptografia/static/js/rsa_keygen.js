// rsa_keygen.js

// Function to generate a random prime number (using small primes for simplicity)
function generatePrime(bits) {
    const min = BigInt(2) ** BigInt(bits - 1);
    const max = BigInt(2) ** BigInt(bits) - BigInt(1);
    while (true) {
        let p = BigInt(Math.floor(Math.random() * Number(max - min)) + Number(min));
        if (isProbablyPrime(p)) {
            return p;
        }
    }
}

// Miller-Rabin primality test
function isProbablyPrime(n, k = 5) {
    if (n === BigInt(2) || n === BigInt(3)) return true;
    if (n < BigInt(2) || n % BigInt(2) === BigInt(0)) return false;

    let s = BigInt(0);
    let d = n - BigInt(1);
    while (d % BigInt(2) === BigInt(0)) {
        d /= BigInt(2);
        s += BigInt(1);
    }

    WitnessLoop:
    for (let i = 0; i < k; i++) {
        let a = BigInt(Math.floor(Math.random() * Number(n - BigInt(4))) + 2); // Random integer in [2, n-2]
        let x = modPow(a, d, n);
        if (x === BigInt(1) || x === n - BigInt(1)) continue;
        for (let r = 1n; r < s; r++) {
            x = modPow(x, BigInt(2), n);
            if (x === BigInt(1)) return false;
            if (x === n - BigInt(1)) continue WitnessLoop;
        }
        return false;
    }
    return true;
}

// Compute GCD
function gcd(a, b) {
    while (b != BigInt(0)) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// Extended Euclidean Algorithm
function egcd(a, b) {
    let s = BigInt(0), old_s = BigInt(1);
    let t = BigInt(1), old_t = BigInt(0);
    let r = b, old_r = a;

    while (r != BigInt(0)) {
        let quotient = old_r / r;
        [old_r, r] = [r, old_r - quotient * r];
        [old_s, s] = [s, old_s - quotient * s];
        [old_t, t] = [t, old_t - quotient * t];
    }
    return {gcd: old_r, x: old_s, y: old_t};
}

// Modular inverse
function modInverse(e, phi) {
    let result = egcd(e, phi);
    if (result.gcd != BigInt(1)) {
        throw new Error('e e phi não são coprimos');
    } else {
        return (result.x % phi + phi) % phi;
    }
}

// Copy both keys to clipboard
function copyAllToClipboard() {
    const publicKey = document.getElementById('publicKey').textContent;
    const privateKey = document.getElementById('privateKey').textContent;
    const keys = `Chave Pública (e, n): ${publicKey}\nChave Privada (d, n): ${privateKey}`;

    navigator.clipboard.writeText(keys).then(() => {
        const copyButton = document.getElementById('copyButton');
        copyButton.classList.add('copied');
        copyButton.textContent = "Copiado!";

        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.textContent = "Copiar Chaves";
        }, 2000);
    });
}

document.getElementById('generateButton').addEventListener('click', function() {
    let bits = 16; // Using small bits for demonstration
    // Generate two distinct primes p and q
    let p = generatePrime(bits);
    let q;
    do {
        q = generatePrime(bits);
    } while (q === p);

    let n = p * q;
    let phi = (p - BigInt(1)) * (q - BigInt(1));

    // Choose e
    let e = BigInt(65537); // Commonly used prime exponent
    if (gcd(e, phi) !== BigInt(1)) {
        // Find another e
        e = BigInt(3);
        while (gcd(e, phi) !== BigInt(1)) {
            e += BigInt(2);
        }
    }

    // Compute d
    let d = modInverse(e, phi);

    // Display the keys
    document.getElementById('publicKey').textContent = `(${toBase64BigInt(e)}, ${toBase64BigInt(n)})`;
    document.getElementById('privateKey').textContent = `(${toBase64BigInt(d)}, ${toBase64BigInt(n)})`;

    document.getElementById('result').style.display = 'block';
});

// Copy specific key to clipboard
function copyToClipboard(keyId) {
    const keyText = document.getElementById(keyId).textContent;
    // Remove parentheses and split by comma
    const key = keyText.replace(/[()]/g, '');

    navigator.clipboard.writeText(key).then(() => {
        const copyButton = keyId === 'publicKey' ? document.getElementById('copyPublicKeyButton') : document.getElementById('copyPrivateKeyButton');
        copyButton.classList.add('copied');
        copyButton.textContent = "Copiado!";

        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyButton.textContent = keyId === 'publicKey' ? "Copiar Chave Pública" : "Copiar Chave Privada";
        }, 2000);
    });
}

// Function to convert a BigInt from base 10 to base 64
function toBase64BigInt(num) {
    if (num === 0n) return base64Chars[0];
    let base64 = "";
    const base = 64n;
    while (num > 0n) {
        const remainder = num % base;
        base64 = base64Chars[Number(remainder)] + base64;
        num = num / base;
    }
    return base64;
}
