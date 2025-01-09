// roles permission
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
    const buttonSubmit = document.querySelector("[button-submit]");

    buttonSubmit.addEventListener("click", () => {
        let permissions = [];

        const rows = tablePermission.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");

            if (name == "id") {
                inputs.forEach(item => {
                    permissions.push({
                        id: item.value,
                        permissions: []
                    })
                })
            }
            else {
                inputs.forEach((item, index) => {
                    if (item.checked) {
                        permissions[index].permissions.push(name);
                    }
                })
            }
        })
        console.log(permissions);
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");

            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit();
        }
    })
}
// end roles permission

// permission data default
const dataRecords = document.querySelector("[data-records]")
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));

    const tablePermission = document.querySelector("[table-permissions]");
    records.forEach((record, index) => {
        const permissions = record.PERMISSION;

        permissions.forEach(permission => {
            const row = tablePermission.querySelector(`[data-name=${permission}]`);
            const input = row.querySelectorAll("input")[index];

            input.checked = true;
        })
    })
}
// end permisssion date default