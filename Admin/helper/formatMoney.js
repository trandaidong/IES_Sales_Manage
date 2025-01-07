module.exports = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
}