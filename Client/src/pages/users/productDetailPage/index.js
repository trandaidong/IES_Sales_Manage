// trang này dùng để hiển thị trang chủ của người dùng
import { memo,useState } from "react";
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

  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  return (
    <>
      <Breadcrumb name="Chi tiết sản phẩm" />
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_detail_pic">
            <img src={cat3Img} alt="product-pic" />
            <div className="main">
              {imgs.map((item, key) => (
                <img src={item} alt="product-pic" key={key} />
              ))}
            </div>
          </div>
          <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_detail_text">
            <h2>Resilience</h2>
            <div className="seen-icon">
              <AiOutlineEye />
              {`10 (lượt đã xem)`}
            </div>
            <h3>{formatter(2000000)}</h3>
            <p>
              Learning is not the mere accumulation of knowledge but the
              transformation of the mind and spirit. It is a journey that
              demands curiosity, persistence, and humility. True learning occurs
              when we challenge our assumptions, explore new perspectives, and
              embrace mistakes as stepping stones to growth.
            </p>
            <Quantity />
            <ul>
              <li>
                <b>Tình trạng:</b>
                <span>Còn hàng</span>
              </li>
              <li>
                <b>Số lượng:</b>
                <span>20</span>
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
                  Happiness is a choice, not a result. It comes from within, not
                  from circumstances
                </p>
              </li>
              <li>
                <p>
                  Kindness is a language the deaf can hear and the blind can see
                </p>
              </li>
              <li>
                <p>
                  Success is not the key to happiness. Happiness is the key to
                  success
                </p>
              </li>
            </ul>
            <p>
              <br />
              <strong>
                In the middle of every difficulty lies opportunity. Challenges
                are not there to stop you but to make you stronger. Embrace
                them, for they are the stepping stones to greatness
              </strong>
            </p>
            <ul>
              <li>
                <p>
                  Time is a precious resource. Spend it wisely, not just chasing
                  goals, but creating memories, nurturing relationships, and
                  finding joy in the little things.
                </p>
              </li>
              <li>
                <p>
                  The journey of a thousand miles begins with a single step.
                  Never underestimate the power of starting, no matter how small
                  the step may seem
                </p>
              </li>
              <li>
                <p>
                  The past is a lesson, not a life sentence. Every mistake,
                  every failure, and every challenge carries a hidden gift: the
                  opportunity to grow. Instead of dwelling on regrets, focus on
                  the wisdom gained and use it to build a brighter future. Life
                  moves forward, and so should you
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
          {featProducts.all.products.map((item, key) => (
            <div key={key} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
              <ProductCard img={item.img} name={item.name} price={item.price} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default memo(ProductDetailPage);
