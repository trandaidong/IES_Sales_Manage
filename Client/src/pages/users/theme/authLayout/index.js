// file này dùng để hiển thị layout của trang web
// thêm component Header vào file này
// component Header sẽ hiển thị ở trên cùng của trang web
// componet có chức năng trong javascript giống như function
import { memo } from "react";

const Authlayout = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};
export default memo(Authlayout);
