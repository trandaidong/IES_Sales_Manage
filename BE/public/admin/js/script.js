// buttonstatus
const buttonStatus = document.querySelectorAll("[button-status]");// Nếu là thuộc tính tự viét => thêm [] lúc truy vấn
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href); // sử dụng new URL ta có thể sử dụng các hàm như set, remove

    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set('status', status); // searchParams.set thiết lập 1 param mới nếu chưa có
            }
            else
                url.searchParams.delete('status');

            window.location.href = url.href;// thiết lập chuyển hướng url mới
        })
    })
}
//end button status


//Form search
const formsearch = document.querySelector("#form-search");
if (formsearch) {
    let url = new URL(window.location.href);
    formsearch.addEventListener(("submit"), (e) => {
        // e là event trả ra toàn bộ sự kiện ( value của input)

        e.preventDefault();// mặc định khi nhấn submit thì nó reload lại trang hoặc link sang trang khác 
        // khi đó ta cần có cú pháp này để duy trì param

        const keyword = e.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    })
}

// End form search

//pagination

const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    const url = new URL(window.location.href);
    buttonPagination.forEach(index => {
        index.addEventListener('click', () => {
            const page = index.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url.href;
        })
    })
}
// end pagination

// checkbox
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector('input[name="checkall"]');
    const inputsID = checkBoxMulti.querySelectorAll("input[name='id']")
    inputCheckAll.addEventListener(('click'), () => {
        if (inputCheckAll.checked) {
            inputsID.forEach(item => {
                item.checked = true;// đã đánh dấu
            })
        }
        else {
            inputsID.forEach(item => {
                item.checked = false; // chưa đánh dấu
            })
        }
    })
    inputsID.forEach(item => {
        item.addEventListener('click', () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;// nhung o input da danh dau
            if (countChecked == inputsID.length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;
            }
        })// why can't use every????
    })
}

// endcheckbox


// form change multi
const formChangeMuili = document.querySelector("[form-change-multi]")
if (formChangeMuili) {
    formChangeMuili.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;
        if (typeChange == 'delete-all') {
            const isConfirm = confirm("Delete?");
            if (!isConfirm) {
                return;
            }
        }
        if (inputChecked.length > 0) {
            let ids = [];

            const inputCeil = formChangeMuili.querySelector("input[name='ids']");

            inputChecked.forEach(item => {
                let id = item.value;
                if (typeChange === "change-position") {

                    // closest có chức năng tìm phần tử cha
                    const position = item.closest("tr").querySelector("input[name='position']").value;
                    id = `${id}-${position}`;
                }
                console.log(id);
                ids.push(id);// vì đây là thuộc tính sẵn của input nên có thể gọi như object ngược lại thì getAttribute
            })
            inputCeil.value = ids.join(", ");
            formChangeMuili.submit();
        }
        else alert("error");
    })
}
// end form change mult

// alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = document.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
}
// end alert

// upload preview
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadPreviewInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    uploadPreviewInput.addEventListener("change", (e) => { // e.target luôn luôn là cái ô input

        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);// tạo đường dẫn ảnh tạm
        }
    })
}
// end upload preview

// sort
const sort = document.querySelector("[sort]");
if (sort) {
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    const url = new URL(window.location.href);
    //sort
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    })
    //end sort

    // clear
    // sortClear.addEventListener("click", () => {
    //     url.searchParams.delete("sortKey");
    //     url.searchParams.delete("sortValue");

    //     window.location.href = url.href;
    // })
    // end clear

    // thêm selected cho option
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        const optionSelected = sortSelect.querySelector(`option[value=${sortKey}-${sortValue}]`);
        optionSelected.selected = true;
    }
}
// end sort

// delete item
const buttonDeleteItem = document.querySelectorAll("[button-delete-item]");
if (buttonDeleteItem.length) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDeleteItem.forEach(button => {
        button.addEventListener('click', () => {
            const isConfirm = confirm("Delete?");
            if (isConfirm) {
                const id = button.getAttribute("button-id");
                const action = path + `/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}
// end delete item