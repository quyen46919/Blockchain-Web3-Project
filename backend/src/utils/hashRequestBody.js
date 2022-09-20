// const md5 = require('md5');
const CryptoJS = require('crypto-js');

const passwordKey = '1SA2sf2@dfkla!asadlw';

/**
 * Convert string to md5 hash
 * @param {Array} array
 * @returns {String}
 */
// const hashRequestBody = (identify, description, images) => {
//   if (!identify || !description || !images) return;
//   let hashString = `${md5(identify)}-${md5(description)}`;

//   images.forEach((imageUrl) => {
//     const hashedImage = md5(imageUrl);
//     hashString = `${hashString}-${hashedImage}`;
//   });

//   return md5(hashString);
// };

/**
 * Convert string to CryptoJS hash
 * @param {Array} array
 * @returns {String}
 */
const encryptRequestBody = (identify, description, images) => {
  let hashString = `${identify}--${description}`;
  images.forEach((imageUrl) => {
    hashString = `${hashString}--${imageUrl}`;
  });
  const encrypted = CryptoJS.AES.encrypt(hashString, passwordKey).toString();
  return encrypted;
};

/**
 * Decrypt hashed string to original string
 * @param {String} hashedString
 * @returns {String}
 */

const decryptHashedString = (hashedString) => {
  if (!hashedString || typeof hashedString !== 'string') return;

  const bytes = CryptoJS.AES.decrypt(hashedString, passwordKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  const listInfo = originalText.split('--');
  const returnObject = {
    identify: listInfo[0],
    description: listInfo[1],
    images: listInfo.splice(2, listInfo.length - 1),
  };
  return returnObject;
};

module.exports = {
  // hashRequestBody,
  encryptRequestBody,
  decryptHashedString,
};
