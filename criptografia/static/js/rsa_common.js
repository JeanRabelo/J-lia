// rsa_common.js

// Modular exponentiation
function modPow(base, exponent, modulus) {
    if (modulus === BigInt(1)) return BigInt(0);
    let result = BigInt(1);
    base = base % modulus;
    while (exponent > BigInt(0)) {
        if (exponent % BigInt(2) === BigInt(1))
            result = (result * base) % modulus;
        exponent = exponent / BigInt(2);
        base = (base * base) % modulus;
    }
    return result;
}

const base64Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

// Function to convert a base 64 string back to base 10 BigInt
function fromBase64BigInt(base64) {
    let num = 0n;
    const base = 64n;
    for (let i = 0; i < base64.length; i++) {
        num = num * base + BigInt(base64Chars.indexOf(base64[i]));
    }
    return num;
}