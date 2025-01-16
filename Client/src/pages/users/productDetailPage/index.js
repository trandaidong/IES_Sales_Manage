// trang này dùng để hiển thị trang chủ của người dùng
import { memo, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import cat1Img from "assets/users/images/categories/cat-1.jpg";
import cat2Img from "assets/users/images/categories/cat-2.jpg";
import cat3Img from "assets/users/images/categories/cat-3.jpg";
import {
  AiOutlineCopy,
  AiOutlineEye,
  AiOutlineFacebook,
  AiOutlineLinkedin,
} from "react-icons/ai";
import { formatter } from "utils/formater";
import { ProductCard } from "component";
import { featProducts } from "utils/common";
import Quantity from "component/Quantity";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
const Comment = ({ username, time, content }) => {
  return (
    <div className="comment">
      {/* Avatar, tên và thời gian trên cùng một dòng */}
      <div className="comment-header">
        <div className="comment-avatar">
          <img
            src={`https://i.pravatar.cc/40?u=${username}`}
            alt="avatar"
            className="avatar-img"
          />
          <div className="comment-info">
            <p className="username">{username}</p>
            <p className="time">{time}</p>
          </div>
        </div>
      </div>
      {/* Nội dung bình luận */}
      <p className="comment-content">{content}</p>
    </div>
  );
};

const CommentForm = ({ onAddComment }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() === "") return;
    onAddComment({
      username: "Người dùng mới",
      time: "Vừa xong",
      content,
    });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        className="comment-form__textarea"
        rows="3"
        placeholder="Thêm bình luận..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button type="submit" className="comment-form__button">
        Đăng bình luận
      </button>
    </form>
  );
};

const ProductDetailPage = () => {
  const imgs = [cat1Img, cat2Img, cat3Img];
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState([]); // Dữ liệu sản phẩm
  const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // Định nghĩa navigate
    const [user, setUser] = useState(null);
  // State cho phần bình luận
  const [comments, setComments] = useState([
    {
      username: "Cukak",
      time: "3 ngày trước",
      content: "Sản phẩm rất tốt, mình đã mua và rất hài lòng!",
    },
    {
      username: "ginnoutrais5561",
      time: "1 tuần trước",
      content: "Sản phẩm nhìn đẹp, sẽ cân nhắc đặt mua.",
    },
  ]);
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log(savedUser);
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Lấy thông tin người dùng từ localStorage
    }
    else setUser(null);
  }, []);
  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
  };
  const handleAddToCart = async (_user, product) => {
    if (!_user) {
      navigate(ROUTERS.USER.AUTH); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
      return;
    }
    try {
      const userId = _user.USERID;
      await fetch(`http://localhost:3000/client/carts/create`, { // Gửi token dưới dạng tham số URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, product }),
      });
    } catch (error) {
      console.error("Lỗi khi gọi API người dùng:", error);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/client/products/detail/${id}`); // Gọi API
        const data = await response.json();
        // Cập nhật dữ liệu slider và banner từ products
        setProduct(data.product || []); // Toàn bộ sản phẩm
        setProducts(data.products || []);
      } catch (error) {
        console.error("Lỗi khi gọi API products:", error);
      }
    };

    fetchProducts(); // Gọi API khi component được render lần đầu
  }, []);

  return (
    <>
      {/* <Breadcrumb name="Chi tiết sản phẩm" /> */}
      <div className="container">
        <div className="product_detail_tab">
          <h4> CHI TIẾT SẢN PHẨM</h4>
        </div>

        <div className="row">
          <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_detail_pic">
            <img src={product.THUMBNAIL}></img>
            {/* <img src={cat3Img} alt="product-pic" /> */}
            <div className="main">
              <img src={product.THUMBNAIL} alt="product-pic" key={1} />
              <img src={product.THUMBNAIL} alt="product-pic" key={2} />
              <img src={product.THUMBNAIL} alt="product-pic" key={3} />
              {/* <img src={products.THUMBNAIL}></img> */}
              {/* {imgs.map((item, key) => (
                <img src={item} alt="product-pic" key={key} />
              ))} */}
            </div>
          </div>
          <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_detail_text">
            <h2>{product.TITLE}</h2>
            <div className="seen-icon">
              <AiOutlineEye />
              {`10 (lượt đã xem)`}
            </div>
            <h3>{formatter(product.PRICE)}</h3>
            <p>
              {product.DESCRIPTION}
            </p>
              {user?<Quantity />:<div></div>}
            <ul>
              <li>
                <b>Tình trạng:</b>
                <span>Còn hàng</span>
              </li>
              <li>
                <b>Số lượng:</b>
                <span>{product.QUANTITY}</span>
              </li>
              <li>
                <b>Chia sẻ:</b>{" "}
                <span>
                  <AiOutlineFacebook />
                  <AiOutlineLinkedin />
                  <AiOutlineCopy />
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="product_detail_tab">
          <h4>Thông tin chi tiết</h4>
          <div>
            <ul>
              <li>
                <p>
                  Áo Sơ Mi Cộc Tay Dekace Premium Oxford Thêu LA
                </p>
              </li>
              <li>
                <p>
                  Áo Sơ Mi Cộc Tay Dekace Premium Oxford Thêu LA dày dặn sờ êm tay, có thể giặt máy thoải mái
                </p>
              </li>
              <li>
                <p>
                  Với thiết kế này dễ dàng phối cùng quần jean, kaki, hay đi cùng 1 đôi giày tây, giày sneaker
                </p>
              </li>
              <li>
                <p>
                  Đường may sắc sảo, đẹp mắt, tỉ mỉ trong từng chi tiết
                </p>
              </li>
            </ul>
            <p>
              <br />
              <strong>
                Áo form Regular
                Các bạn xem thêm bảng size có thông số chi tiết chọn cho đúng ý nhé
                Size tương đối: Size S : 55-62kg Size M  :  63-68kg Size L : 69-76 kg Size XL : 77-84 kg
                Vd: Bạn 69kg bạn muốn mặc vừa vặn bạn chọn size M
                Hoặc Bạn INBOX, cung cấp chiều cao, cân nặng để SHOP TƯ VẤN SIZE
              </strong>
            </p>
            <ul>
              <li>
                <p>
                  SHOP CAM KẾT
                  - Uy tín 100%.
                  - Hỗ trợ khách hàng nhiệt nhiệt tình.
                  - Đặt chất lượng sản phẩm lên hàng đầu.
                  - Nếu sản phẩm không đúng, không vừa hãy inbox riêng đến shop để được tư vấn hỗ trợ trả hàng và hoàn tiền nhé !
                </p>
              </li>
              <li>
                <p>
                  Shop tự tin về Sản Phẩm chất lượng cũng như giá Rẻ vì đội ngũ may mặc có tay nghề cao. Có Xưởng sản xuất quy mô lớn nên giá thành thấp để phục vụ cho Khách Hàng.
                  Bạn nào muốn đặt sỉ, đặt áo lớp, áo hội nhóm thì hãy inbox ngay cho shop để nhận ngay giá rẻ. ở đâu rẻ hơn shop sẽ hoàn tiền !!!
                </p>
              </li>
              <li>
                <p>
                  Cách đặt hàng: Nếu bạn muốn mua 2 sản phẩm khác nhau hoặc 2 size khác nhau:
                  -  Bạn chọn từng sản phẩm rồi thêm vào giỏ hàng
                  -  Khi giỏ hàng đã có đầy đủ các sản phẩm cần mua, bạn mới tiến hành ấn nút “ Thanh toán”
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="product-comments mt-6">
          <h4 className="text-xl font-bold mb-4">Bình luận</h4>
          <CommentForm onAddComment={addComment} />

          {comments.map((comment, index) => (
            <Comment
              key={index}
              username={comment.username}
              time={comment.time}
              content={comment.content}
            />
          ))}
        </div>
        <div className="section-title">
          <h2>Sản phẩm tương tự</h2>
        </div>
        <div className="row">
          {products.map((item, key) => (
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12" key={key}>
              <ProductCard
                id={item.PRODUCTID}
                name={item.TITLE}
                img={`${item.THUMBNAIL}`}
                price={item.PRICE}
                onAddToCart={() => handleAddToCart(user, item)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default memo(ProductDetailPage);
