import { memo, useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import "./style.scss";

const CategoryDetailPage = () => {
    const [products, setProducts] = useState([]); // Dữ liệu sản phẩm

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/products"); // Gọi API sản phẩm
                const data = await response.json();

                setProducts(data || []); // Toàn bộ sản phẩm
            } catch (error) {
                console.error("Lỗi khi gọi API products:", error);
            }
        };

        fetchProducts(); // Gọi API khi component được render lần đầu
    }, []);
    return (
        <>
            {/* Featured Products */}
            <div className="container">
                {products.length > 0 ? (
                    <div> SẢN PHẨM ABC</div>
                    // renderFeaturedProducts(products)
                ) : (
                    <p>Đang tải sản phẩm...</p>
                )}
            </div>
        </>
    );
};
export default memo(CategoryDetailPage);
