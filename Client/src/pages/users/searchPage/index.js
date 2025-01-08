import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { formatter } from "utils/formater";
import "./style.scss";
const SearchPage = () => {
  const location = useLocation(); // Lấy state từ Header
  const searchQuery = location.state?.searchQuery || ""; // Nhận từ khóa tìm kiếm

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) return; // Không gọi API nếu không có từ khóa
      setLoading(true); // Bật trạng thái loading
  
      try {
        console.log("Đang gọi API với từ khóa:", searchQuery);
  
        // Thực hiện fetch API
        const response = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`
        );
  
        if (!response.ok) {
          console.error(`Lỗi HTTP: ${response.status}`);
          return;
        }
  
        // Đảm bảo chỉ gọi response.json() một lần
        const data = await response.json();
        console.log("Kết quả từ API:", data);
  
        setSearchResults(data.products || []); // Cập nhật kết quả tìm kiếm
      } catch (error) {
        console.error("Lỗi khi gọi API tìm kiếm:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };
  
    fetchSearchResults();
  }, [searchQuery]);
  return (
    <div className="container search_page">
      <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>

      {loading && <p>Đang tải dữ liệu...</p>}

      {!loading && searchResults.length === 0 && (
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      )}

      {!loading && searchResults.length > 0 && (
        <div className="search_results">
          {searchResults.map((product) => (
            <div key={product.PRODUCTID} className="search_result_item">
              <img
                src={`/assets/images/${product.THUMBNAIL}`}
                alt={product.TITLE}
                className="search_result_image"
              />
              <p>{product.TITLE}</p>
              <p>{formatter(product.PRICE)} VNĐ</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
