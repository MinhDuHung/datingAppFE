import CryptoJS from 'crypto-js';

export const sha256Hash = (data) => {
    const hash = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
  };