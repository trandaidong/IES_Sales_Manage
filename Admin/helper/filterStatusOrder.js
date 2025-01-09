module.exports = (query) => {
    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Đang chờ",
            status: "pending",
            class: ""
        },
        {
            name: "Đang xử lý",
            status: "processing",
            class: ""
        },
        {
            name: "Đã hủy",
            status: "canceled",
            class: ""
        },
        {
            name: "Đã giao",
            status: "delivered",
            class: ""
        }
    ];

    if (query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = 'active';
    } else {//status thì trả về undefined
        filterStatus[0].class = 'active';
    }

    return filterStatus;
}