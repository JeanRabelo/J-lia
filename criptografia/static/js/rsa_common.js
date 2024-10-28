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
