const defaultPath = "/admin/statistics"
const periodSelect = document.querySelector("#period");

const formPeriod = document.querySelector("#form-period");
const formPeriodBranchs = document.querySelector("#form-period-branchs");
const formPeriodDishs = document.querySelector("#form-period-dish");
if (periodSelect) {
    periodSelect.addEventListener('change', () => {
        const selectedOption = periodSelect.options[periodSelect.selectedIndex]; // Lấy option đã chọn
        const selectedValue = selectedOption.value;
        const formDay = document.querySelector(".form-day");
        const formMonth = document.querySelector(".form-month");
        const formQuarter = document.querySelector(".form-quarter");
        const formYear = document.querySelector(".form-year");
        switch (selectedValue) {
            case "day":
                formDay.style.display = "";
                formMonth.style.display = 'none';
                formYear.style.display = 'none';
                if (formPeriod) {
                    formPeriod.action = defaultPath + "/day";
                }
                break;
            case "month":
                formMonth.style.display = "";
                formDay.style.display = 'none';
                formYear.style.display = 'none';

                if (formPeriod) {
                    formPeriod.action = defaultPath + "/month";
                }
                break;
            case "year":
                formYear.style.display = "";
                formDay.style.display = 'none';
                formMonth.style.display = 'none';

                if (formPeriod) {
                    formPeriod.action = defaultPath + "/year";
                }
                break;
            default:
        }
    })
}
