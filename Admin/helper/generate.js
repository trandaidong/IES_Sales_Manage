module.exports.generateRandomString = (length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuwxyz0123456789";
    var result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
module.exports.generateRandomNumber = (length) => {
    const characters =
        "0123456789";
    var result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}