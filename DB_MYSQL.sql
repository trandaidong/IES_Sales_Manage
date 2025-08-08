DROP DATABASE IF EXISTS SALE_MANAGE;

CREATE DATABASE SALE_MANAGE;
USE SALE_MANAGE;

CREATE TABLE TUSER (
	USERID VARCHAR(100) PRIMARY KEY,
	FULLNAME VARCHAR(100),
	EMAIL VARCHAR(100) NOT NULL UNIQUE,
	PHONE VARCHAR(20),
    AVATAR VARCHAR(255),
	PASSWORD VARCHAR(255),
	STATUS VARCHAR(20) CHECK (STATUS IN ('Active', 'Inactive')),
	DELETED INT DEFAULT 0,
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE TFORGETPASSWORD (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EMAIL VARCHAR(100),
    OTP VARCHAR(10),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT *
FROM TFORGETPASSWORD;
CREATE TABLE TCATEGORY(
	CATEGORYID  VARCHAR(100) PRIMARY KEY,
	TITLE VARCHAR(100),
	DESCRIPTION TEXT,
	POSITION INT,
	THUMBNAIL VARCHAR(255),
	STATUS VARCHAR(20) CHECK (STATUS IN ('Active', 'Inactive')),
    SLUG VARCHAR(255),
	DELETED INT DEFAULT 0,
	-- CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- UPDATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    CREATED JSON,
    UPDATED JSON
);
CREATE TABLE TPRODUCT(
	PRODUCTID VARCHAR(100) PRIMARY KEY,
    CATEGORYID VARCHAR(100),
	TITLE VARCHAR(100),
	PRICE DECIMAL(10),
	DISCOUNT FLOAT,
	THUMBNAIL VARCHAR(255),
    POSITION INT,
	QUANTITY INT,
    DESCRIPTION TEXT,
	STATUS VARCHAR(20) CHECK (STATUS IN ('Active', 'Inactive')),
    SLUG VARCHAR(255),
	DELETED INT DEFAULT 0,
    CREATED JSON,
    UPDATED JSON
);
CREATE TABLE TCART(
	CARTID VARCHAR(100) PRIMARY KEY,
	USERID VARCHAR(100) NOT NULL,
	PRODUCTID VARCHAR(100) NOT NULL,
	QUANTITY INT, 
	STATUS VARCHAR(20) CHECK (STATUS IN ('Active', 'Inactive')),
	DELETED INT DEFAULT 0,
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chưa ổn lắm, cần update lại.
CREATE TABLE TORDER( 
	ORDERID VARCHAR(100) PRIMARY KEY,
	USERID VARCHAR(100) NOT NULL,
	TOTALAMOUNT DECIMAL(10),
	PHONE VARCHAR(20),
	ADDRESS VARCHAR(255),
	FULLNAME VARCHAR(100),
	NOTE TEXT,
    PAYMETHOD VARCHAR(50) CHECK (PAYMETHOD IN ("Cash","Banking")),
	STATUS VARCHAR(20) CHECK (STATUS IN ("Pending","Processing", "Canceled","Delivered")),
	PAID INT, -- 1 ĐÃ TRẢ, 0 CHƯA THANH TOÁN, MẶC ĐỊNH NẾU CASH MÀ DELIVERED LÀ 1
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE TDETAILORDER(
	ORDERID VARCHAR(100),
	PRODUCTID VARCHAR(100),
	QUANTITY INT DEFAULT 1,
	DELETED INT DEFAULT 0,
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(ORDERID, PRODUCTID)
);

CREATE TABLE TADMIN(
	ADMINID VARCHAR(100) PRIMARY KEY,
	FULLNAME VARCHAR(100),
	PASSWORD VARCHAR(255),
	PHONE VARCHAR(20),
	STATUS VARCHAR(20) CHECK (STATUS IN ('Active', 'Inactive')),
	EMAIL VARCHAR(100) NOT NULL UNIQUE,
	AVATAR VARCHAR(255),
    ROLEID VARCHAR(100),
	DELETED INT DEFAULT 0,
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE TPERMISSION(
	PERMISSION VARCHAR(100) PRIMARY KEY,
    ROLEID VARCHAR(100),
	TITLE VARCHAR(100),
	DESCRIPTION TEXT,
	DELETED INT DEFAULT 0
);
CREATE TABLE TROLE(
	ROLEID VARCHAR(100) PRIMARY KEY,
    TITLE VARCHAR(100),
    PERMISSION JSON,
    DESCRIPTION TEXT,
    DELETED INT DEFAULT 0,
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE TCHAT(
	CHATID VARCHAR(100) PRIMARY KEY,
	ADMINID VARCHAR(100),
    USERID VARCHAR(100),
    CONTENT TEXT,
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE TCOMMENT(
	COMMENTID VARCHAR(100) PRIMARY KEY,
    PRODUCTID VARCHAR(100) NOT NULL,
	ADMINID VARCHAR(100),
    USERID VARCHAR(100),
    CONTENT TEXT,
	CREATEDAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE TSETTING(
	SETTINGID VARCHAR(100) PRIMARY KEY CHECK (SETTINGID = "SETTING"),
	WEBNAME VARCHAR(100),
	LOGO VARCHAR(100),
	PHONE VARCHAR(20),
	EMAIL VARCHAR(100),
    TITLE VARCHAR(100),
	ADDRESS VARCHAR(255),
	COPYRIGHT VARCHAR(100)
);
INSERT INTO TSETTING
VALUES("SETTING","Digital Nomod", "logo.com","0356314937","daidong.tran15@gmail.com", "Miễn phí đơn hàng từ 200.00đ", "KTX Khu B, ĐHQG TP.HCM", "daidong.tran" );
-------- KHOA NGOAI   --
-- TUSER
-- TFORGETPASSWORD --
-- ALTER TABLE TFORGETPASSWORD
-- ADD CONSTRAINT FK_FORGETPASSWORD_USER
-- FOREIGN KEY (ACCOUNTID)
-- REFERENCES TUSER(USERID);

-- ALTER TABLE TFORGETPASSWORD
-- ADD CONSTRAINT FK_FORGETPASSWORD_ADMIN
-- FOREIGN KEY (ADMINID)
-- REFERENCES TADMIN(ADMINID);
-- CATEGORY
-- PRODUCT --
ALTER TABLE TPRODUCT
ADD CONSTRAINT FK_PRODUCT_CATEGORY
FOREIGN KEY (CATEGORYID)
REFERENCES TCATEGORY(CATEGORYID);

-- CART --
ALTER TABLE TCART
ADD CONSTRAINT FK_CART_USER
FOREIGN KEY (USERID)
REFERENCES TUSER(USERID);

ALTER TABLE TCART
ADD CONSTRAINT FK_CART_PRODUCT
FOREIGN KEY (PRODUCTID)
REFERENCES TPRODUCT(PRODUCTID);

-- ORDER ---
ALTER TABLE TORDER
ADD CONSTRAINT FK_ORDER_USER
FOREIGN KEY (USERID)
REFERENCES TUSER(USERID);


-- ORDER DETAIL --
ALTER TABLE TDETAILORDER
ADD CONSTRAINT FK_DETAILORDER_ORDER
FOREIGN KEY (ORDERID)
REFERENCES TORDER(ORDERID);

ALTER TABLE TDETAILORDER
ADD CONSTRAINT FK_DETAILORDER_PRODUCT
FOREIGN KEY (PRODUCTID)
REFERENCES TPRODUCT(PRODUCTID);

-- ADMIN
ALTER TABLE TADMIN
ADD CONSTRAINT FK_ADMIN_ROLE
FOREIGN KEY (ROLEID)
REFERENCES TROLE(ROLEID);

-- COMMENT
ALTER TABLE TCOMMENT
ADD CONSTRAINT FK_COMMENT_USER
FOREIGN KEY (USERID)
REFERENCES TUSER(USERID);

ALTER TABLE TCOMMENT
ADD CONSTRAINT FK_COMMENT_ADMIN
FOREIGN KEY (ADMINID)
REFERENCES TADMIN(ADMINID);

ALTER TABLE TCOMMENT
ADD CONSTRAINT FK_COMMENT_PRODUCT
FOREIGN KEY (PRODUCTID)
REFERENCES TPRODUCT(PRODUCTID);

-- CHAT --
ALTER TABLE TCHAT
ADD CONSTRAINT FK_CHAT_USER
FOREIGN KEY (USERID)
REFERENCES TUSER(USERID);

ALTER TABLE TCHAT
ADD CONSTRAINT FK_CHAT_ADMIN
FOREIGN KEY (ADMINID)
REFERENCES TADMIN(ADMINID);

SELECT *
FROM TADMIN;
-- ------------------------ INSERT DATA ---------------------------------
INSERT INTO TUSER (USERID, FULLNAME, EMAIL, PHONE, AVATAR, PASSWORD, STATUS) VALUES
('U001', 'Nguyen Van A', 'nguyenvana@example.com', '0912345678', null, 'password123', 'Active'),
('U002', 'Tran Thi B', 'tranthib@example.com', '0923456789', null, 'password456', 'Inactive'),
('U003', 'Le Van C', 'levanc@example.com', '0934567890', null, 'password789', 'Active'),
('U004', 'Pham Thi D', 'phamthid@example.com', '0945678901', null, 'password111', 'Active'),
('U005', 'Do Van E', 'dovane@example.com', '0956789012', null, 'password222', 'Inactive'),
('U006', 'Hoang Thi F', 'hoangthif@example.com', '0967890123', null, 'password333', 'Active'),
('U007', 'Bui Van G', 'buivang@example.com', '0978901234', null, 'password444', 'Active'),
('U008', 'Vu Thi H', 'vuthih@example.com', '0989012345',null, 'password555', 'Inactive'),
('U009', 'Nguyen Van I', 'nguyenvani@example.com', '0990123456',null, 'password666', 'Active'),
('U010', 'Tran Thi J', 'tranthij@example.com', '0901234567', null, 'password777', 'Inactive');


INSERT INTO TCATEGORY (CATEGORYID, TITLE, DESCRIPTION, POSITION, THUMBNAIL, STATUS, SLUG, CREATED, UPDATED) VALUES
('C001', 'Áo Sơ Mi', 'Danh mục các loại áo sơ mi thời trang cho nam và nữ.', 1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m09qz5aypi3x6d.webp', 'Active', 'ao-so-mi', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('C002', 'Quần Jean', 'Danh mục quần jean đa dạng kiểu dáng và màu sắc.', 2, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3bwi2udz3fl82.webp', 'Active', 'quan-jean', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('C003', 'Áo Thun', 'Tổng hợp các mẫu áo thun thời trang, cá tính.', 3, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ls3nw2tjhcjobd.webp', 'Active', 'ao-thun', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('C004', 'Váy Đầm', 'Danh mục váy đầm cao cấp, phong cách.', 4, 'https://down-vn.img.susercontent.com/file/cn-11134207-7ras8-m3r88q4h5sne53.webp', 'Inactive', 'vay-dam', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('C005', 'Phụ Kiện Thời Trang', 'Các loại phụ kiện như mũ, túi xách, kính mát.', 5, 'https://down-vn.img.susercontent.com/file/cn-11134207-7ras8-m2dcfvxy147291.webp', 'Active', 'phu-kien-thoi-trang', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')));

SELECT *
FROM TCATEGORY;
INSERT INTO TPRODUCT (PRODUCTID, CATEGORYID, TITLE, PRICE, DISCOUNT, THUMBNAIL, POSITION, QUANTITY, DESCRIPTION, STATUS, SLUG, CREATED, UPDATED) VALUES
-- Sản phẩm cho danh mục "Áo Sơ Mi" (C001)
('P001', 'C001', 'Áo Sơ Mi Trắng', 250000, 0.1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lf96yzqqr4ay63.webp', 1, 100, 'Áo sơ mi trắng thanh lịch, phù hợp cho công sở.', 'Active', 'ao-so-mi-trang', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P002', 'C001', 'Áo Sơ Mi Kẻ Sọc', 300000, 0.15, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lh32revbhp2qed.webp', 6, 80, 'Áo sơ mi kẻ sọc trẻ trung, thoải mái.', 'Active', 'ao-so-mi-ke-soc', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P003', 'C001', 'Áo Sơ Mi Denim', 400000, 0.2, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-2vjaqvbzmwovee@resize_w450_nl.webp', 11, 50, 'Áo sơ mi chất liệu denim phong cách.', 'Active', 'ao-so-mi-denim', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P004', 'C001', 'Áo Sơ Mi Tay Ngắn', 200000, 0.05, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-likxhotwetjg13.webp', 16, 120, 'Áo sơ mi tay ngắn thoáng mát.', 'Active', 'ao-so-mi-tay-ngan', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P005', 'C001', 'Áo Sơ Mi Lụa', 500000, 0.1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwaaw1mtvrh74e.webp', 21, 30, 'Áo sơ mi lụa cao cấp.', 'Inactive', 'ao-so-mi-lua', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),

-- Sản phẩm cho danh mục "Quần Jean" (C002)
('P006', 'C002', 'Quần Jean Slim Fit', 350000, 0.1, 'https://down-vn.img.susercontent.com/file/22b1b72be28b9cd9d34a5c8b873b7c3c.webp', 2, 60, 'Quần jean slim fit dành cho người trẻ trung.', 'Active', 'quan-jean-slim-fit', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P007', 'C002', 'Quần Jean Rách', 400000, 0.2, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz7ghkwezeld4c.webp', 7, 50, 'Quần jean rách phong cách cá tính.', 'Active', 'quan-jean-rach', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P008', 'C002', 'Quần Jean Trơn', 300000, 0.05, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lws3synopcyj10.webp', 12, 100, 'Quần jean thiết kế đơn giản, dễ phối đồ.', 'Active', 'quan-jean-tron', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P009', 'C002', 'Quần Jean Ống Rộng', 450000, 0.15, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m0cib6flid1r4b.webp', 17, 40, 'Quần jean ống rộng thời trang.', 'Active', 'quan-jean-ong-rong', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P010', 'C002', 'Quần Jean Cạp Cao', 380000, 0.1, 'https://down-vn.img.susercontent.com/file/vn-11134201-23020-zybs095o43nvff.webp', 22, 70, 'Quần jean cạp cao tôn dáng.', 'Inactive', 'quan-jean-cap-cao', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),

-- Sản phẩm cho danh mục "Áo Thun" (C003)
('P011', 'C003', 'Áo Thun Basic', 150000, 0.05, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m337i87cwb8w4d.webp', 3, 200, 'Áo thun cơ bản, dễ dàng phối đồ.', 'Active', 'ao-thun-basic', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P012', 'C003', 'Áo Thun In Hình', 200000, 0.1, 'https://down-vn.img.susercontent.com/file/1a69e0fa6b262711c62b35ca609d5600.webp', 8, 150, 'Áo thun in hình độc đáo.', 'Active', 'ao-thun-in-hinh', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P013', 'C003', 'Áo Thun Oversize', 180000, 0.05, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsmjzk6bh6zdba.webp', 13, 120, 'Áo thun dáng rộng phù hợp giới trẻ.', 'Active', 'ao-thun-oversize', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P014', 'C003', 'Áo Thun Polo', 250000, 0.1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3yichmfn44ofd.webp', 18, 90, 'Áo thun có cổ phong cách lịch lãm.', 'Active', 'ao-thun-polo', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P015', 'C003', 'Áo Thun Cotton', 220000, 0.08, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3a50fk3ll4176.webp', 23, 100, 'Áo thun chất liệu cotton thoáng mát.', 'Inactive', 'ao-thun-cotton', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),

-- Sản phẩm cho danh mục "Váy Đầm" (C004)
('P016', 'C004', 'Đầm Dạ Hội', 700000, 0.2, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-m05ad4ibjr7z35.webp', 4, 20, 'Đầm dạ hội cao cấp.', 'Active', 'dam-da-hoi', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P017', 'C004', 'Đầm Maxi', 500000, 0.15, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m23wse96c2vv78.webp', 9, 30, 'Đầm maxi thướt tha, nữ tính.', 'Active', 'dam-maxi', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P018', 'C004', 'Đầm Công Sở', 600000, 0.1, 'https://down-vn.img.susercontent.com/file/e1d96ce70a30dd93a526a3f7d1d5c151.webp', 14, 40, 'Đầm công sở thanh lịch.', 'Active', 'dam-cong-so', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P019', 'C004', 'Đầm Bodycon', 550000, 0.12, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rffk-m3vjfw5c23vf79.webp', 19, 25, 'Đầm bodycon tôn dáng.', 'Inactive', 'dam-bodycon', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P020', 'C004', 'Đầm Hoa', 450000, 0.1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rep4-m1s3q9spegg99b.webp', 24, 50, 'Đầm hoa họa tiết nổi bật.', 'Active', 'dam-hoa', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),

-- Sản phẩm cho danh mục "Phụ Kiện Thời Trang" (C005)
('P021', 'C005', 'Túi Xách Da', 800000, 0.15, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m29atdt1uj04c8@resize_w450_nl.webp', 5, 50, 'Túi xách da sang trọng.', 'Active', 'tui-xach-da', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P022', 'C005', 'Mũ Lưỡi Trai', 150000, 0.1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lhn62mgb45vl21.webp', 10, 150, 'Mũ lưỡi trai phong cách.', 'Active', 'mu-luoi-trai', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P023', 'C005', 'Kính Mát', 250000, 0.2, 'https://down-vn.img.susercontent.com/file/9f5ecc3fd813710944213d43c6a6db19.webp', 15, 80, 'Kính mát thời trang.', 'Active', 'kinh-mat', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P024', 'C005', 'Thắt Lưng Da', 300000, 0.1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgtepr0mzfoyca.webp', 20, 70, 'Thắt lưng da cao cấp.', 'Active', 'that-lung-da', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))),
('P025', 'C005', 'Khăn Quàng Cổ', 200000, 0.08, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1y9nr8o7ixn8e.webp', 25, 60, 'Khăn quàng cổ ấm áp.', 'Inactive', 'khan-quang-co', JSON_OBJECT('CREATEDBY', 'AD000000', 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')), JSON_OBJECT('UPDATEDBY', 'AD000000', 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')));


INSERT INTO TORDER (ORDERID, USERID, TOTALAMOUNT, PHONE, ADDRESS, FULLNAME, NOTE, PAYMETHOD, STATUS, PAID, CREATEDAT, UPDATEDAT) VALUES
('OD001', 'U001', 480000, '0945678912', '456 JKL Street', 'Trần Đại Đồng', 'Gọi trước khi giao', 'Banking', 'Pending', 0, '2025-01-07 12:00:00', '2025-01-07 12:30:00'),
('OD002', 'U002', 1355000, '0971234567', '456 DEF Street', 'Le Thi B', 'Gọi trước khi giao', 'Banking', 'Pending', 1, '2025-01-02 09:30:00', '2025-01-02 09:30:00'),
('OD003', 'U003', 450000, '0912345678', '789 GHI Street', 'Tran Van C', NULL, 'Cash', 'Delivered', 1, '2025-01-03 15:00:00', '2025-01-03 15:30:00'),
('OD004', 'U004', 780000, '0938765432', '321 JKL Street', 'Pham Thi D', 'Giao gấp trong ngày', 'Banking', 'Processing', 1, '2025-01-04 12:45:00', '2025-01-04 13:00:00'),
('OD005', 'U005', 560000, '0923456789', '654 MNO Street', 'Nguyen Van E', 'Không giao vào buổi sáng', 'Cash', 'Canceled', 0, '2025-01-05 08:15:00', '2025-01-05 09:00:00'),
('OD006', 'U006', 2400000, '0945678901', '987 PQR Street', 'Bui Thi F', NULL, 'Banking', 'Delivered', 1, '2025-01-06 18:20:00', '2025-01-06 19:00:00'),
('OD007', 'U007', 360000, '0901234567', '159 STU Street', 'Hoang Van G', 'Giao hàng vào buổi tối', 'Cash', 'Pending', 0, '2025-01-07 10:00:00', '2025-01-07 10:00:00'),
('OD008', 'U008', 1120000, '0981112223', '753 VWX Street', 'Vu Thi H', 'Giao hàng cuối tuần', 'Banking', 'Processing', 1, '2025-01-08 14:30:00', '2025-01-08 14:45:00'),
('OD009', 'U009', 500000, '0969998888', '369 YZA Street', 'Do Van I', 'Không giao quá 19h', 'Cash', 'Delivered', 1, '2025-01-09 16:00:00', '2025-01-09 16:30:00');
INSERT INTO TORDER (ORDERID, USERID, TOTALAMOUNT, PHONE, ADDRESS, FULLNAME, NOTE, PAYMETHOD, STATUS, PAID, CREATEDAT, UPDATEDAT) VALUES
('OD010', 'U010', 910000, '0953334444', '123 BCD Avenue', 'Ly Thi J', 'Hẹn giờ giao trước 30 phút', 'Banking', 'Processing', 1, '2025-01-10 11:00:00', '2025-01-10 11:15:00'),
('OD011', 'U001', 750000, '0945556666', '456 EFG Boulevard', 'Nguyen Van K', 'Giao hàng sau 13h', 'Cash', 'Pending', 0, '2025-01-11 09:00:00', '2025-01-11 09:00:00'),
('OD012', 'U002', 1230000, '0937778888', '789 HIJ Crescent', 'Pham Thi L', NULL, 'Banking', 'Canceled', 0, '2025-01-12 08:00:00', '2025-01-12 08:30:00'),
('OD013', 'U003', 890000, '0929997777', '321 KLM Drive', 'Le Van M', 'Giao hàng đúng giờ', 'Cash', 'Delivered', 1, '2025-01-13 17:45:00', '2025-01-13 18:00:00'),
('OD014', 'U004', 640000, '0914445555', '654 NOP Lane', 'Tran Thi N', 'Không giao giờ cao điểm', 'Banking', 'Processing', 1, '2025-01-14 10:30:00', '2025-01-14 10:45:00'),
('OD015', 'U005', 780000, '0902223333', '987 QRS Parkway', 'Bui Van O', NULL, 'Cash', 'Pending', 0, '2025-01-15 13:15:00', '2025-01-15 13:15:00'),
('OD016', 'U001', 2667000, '0987654321', '123 ABC Street', 'Nguyen Van A', 'Giao hàng giờ hành chính', 'Cash', 'Processing', 0, '2025-01-01 10:00:00', '2025-01-01 10:00:00'),
('OD017', 'U002', 3643600, '0912345678', '456 XYZ Avenue', 'Tran Thi B', 'Yêu cầu giao buổi sáng', 'Banking', 'Delivered', 1, '2025-01-02 09:00:00', '2025-01-02 11:00:00'),
('OD018', 'U003', 1222500, '0978123456', '789 DEF Road', 'Le Van C', 'Hủy do sai sản phẩm', 'Cash', 'Canceled', 0, '2025-01-03 08:30:00', '2025-01-03 09:00:00'),
('OD019', 'U004', 2975000, '0901234567', '123 GHI Lane', 'Pham Thi D', NULL, 'Cash', 'Delivered', 1, '2025-01-04 15:00:00', '2025-01-04 17:00:00');
INSERT INTO TORDER (ORDERID, USERID, TOTALAMOUNT, PHONE, ADDRESS, FULLNAME, NOTE, PAYMETHOD, STATUS, PAID, CREATEDAT, UPDATEDAT) VALUES
('OD020', 'U005', 2866500, '0945678912', '456 JKL Street', 'Vu Van E', 'Gọi trước khi giao', 'Banking', 'Processing', 0, '2025-01-05 12:00:00', '2025-01-05 12:30:00'),
('OD021', 'U001', 2866500, '0945678912', 'KTX Khu B', 'Dang Thanh C', 'Gọi trước khi giao', 'Banking', 'Processing', 0, '2025-01-05 12:00:00', '2025-01-05 12:30:00'),
('OD022', 'U002', 1355000, '0971234567', '456 DEF Street', 'Le Thi B', 'Gọi trước khi giao', 'Banking', 'Pending', 1, '2025-01-02 09:30:00', '2025-01-02 09:30:00'),
('OD023', 'U003', 450000, '0912345678', '789 GHI Street', 'Tran Van C', NULL, 'Cash', 'Delivered', 1, '2025-01-03 15:00:00', '2025-01-03 15:30:00'),
('OD024', 'U004', 780000, '0938765432', '321 JKL Street', 'Pham Thi D', 'Giao gấp trong ngày', 'Banking', 'Processing', 1, '2025-01-04 12:45:00', '2025-01-04 13:00:00'),
('OD025', 'U005', 560000, '0923456789', '654 MNO Street', 'Nguyen Van E', 'Không giao vào buổi sáng', 'Cash', 'Canceled', 0, '2025-01-05 08:15:00', '2025-01-05 09:00:00'),
('OD026', 'U006', 2400000, '0945678901', '987 PQR Street', 'Bui Thi F', NULL, 'Banking', 'Delivered', 1, '2025-01-06 18:20:00', '2025-01-06 19:00:00'),
('OD027', 'U007', 360000, '0901234567', '159 STU Street', 'Hoang Van G', 'Giao hàng vào buổi tối', 'Cash', 'Pending', 0, '2025-01-07 10:00:00', '2025-01-07 10:00:00'),
('OD028', 'U008', 1120000, '0981112223', '753 VWX Street', 'Vu Thi H', 'Giao hàng cuối tuần', 'Banking', 'Processing', 1, '2025-01-08 14:30:00', '2025-01-08 14:45:00'),
('OD029', 'U009', 500000, '0969998888', '369 YZA Street', 'Do Van I', 'Không giao quá 19h', 'Cash', 'Delivered', 1, '2025-01-09 16:00:00', '2025-01-09 16:30:00'),
('OD030', 'U010', 910000, '0953334444', '123 BCD Avenue', 'Ly Thi J', 'Hẹn giờ giao trước 30 phút', 'Banking', 'Processing', 1, '2025-01-10 11:00:00', '2025-01-10 11:15:00'),
('OD031', 'U001', 750000, '0945556666', '456 EFG Boulevard', 'Nguyen Van K', 'Giao hàng sau 13h', 'Cash', 'Pending', 0, '2025-01-11 09:00:00', '2025-01-11 09:00:00'),
('OD032', 'U002', 1230000, '0937778888', '789 HIJ Crescent', 'Pham Thi L', NULL, 'Banking', 'Canceled', 0, '2025-01-12 08:00:00', '2025-01-12 08:30:00');
INSERT INTO TORDER (ORDERID, USERID, TOTALAMOUNT, PHONE, ADDRESS, FULLNAME, NOTE, PAYMETHOD, STATUS, PAID, CREATEDAT, UPDATEDAT) VALUES
('OD033', 'U003', 890000, '0929997777', '321 KLM Drive', 'Le Van M', 'Giao hàng đúng giờ', 'Cash', 'Delivered', 1, '2025-01-13 17:45:00', '2025-01-13 18:00:00'),
('OD034', 'U004', 640000, '0914445555', '654 NOP Lane', 'Tran Thi N', 'Không giao giờ cao điểm', 'Banking', 'Processing', 1, '2025-01-14 10:30:00', '2025-01-14 10:45:00'),
('OD035', 'U005', 780000, '0902223333', '987 QRS Parkway', 'Bui Van O', NULL, 'Cash', 'Pending', 0, '2025-01-15 13:15:00', '2025-01-15 13:15:00'),
('OD036', 'U006', 670000, '0978887777', '100 ABC Road', 'Tran Van P', 'Giao sau 17h', 'Banking', 'Delivered', 1, '2023-01-20 14:00:00', '2023-01-20 14:30:00'),
('OD037', 'U007', 450000, '0965554444', '200 DEF Street', 'Nguyen Thi Q', NULL, 'Cash', 'Processing', 0, '2023-02-15 09:45:00', '2023-02-15 10:00:00'),
('OD038', 'U008', 890000, '0951113333', '300 GHI Avenue', 'Hoang Van R', 'Gọi trước khi giao', 'Banking', 'Pending', 1, '2023-03-18 10:00:00', '2023-03-18 10:15:00'),
('OD039', 'U009', 1200000, '0947776666', '400 JKL Lane', 'Le Thi S', 'Giao vào buổi chiều', 'Cash', 'Delivered', 1, '2023-04-12 16:30:00', '2023-04-12 17:00:00'),
('OD040', 'U005', 330000, '0933332222', '500 MNO Road', 'Bui Van T', 'Không giao ngày lễ', 'Banking', 'Canceled', 0, '2023-05-25 11:20:00', '2023-05-25 11:30:00'),
('OD041', 'U001', 760000, '0925556666', '600 PQR Street', 'Pham Thi U', NULL, 'Cash', 'Pending', 0, '2023-06-30 08:00:00', '2023-06-30 08:00:00'),
('OD042', 'U002', 510000, '0912224444', '700 STU Boulevard', 'Tran Van V', 'Giao nhanh trong 1 giờ', 'Banking', 'Processing', 1, '2023-07-15 13:45:00', '2023-07-15 14:00:00'),
('OD043', 'U003', 640000, '0906665555', '800 VWX Avenue', 'Vu Thi W', 'Không giao sau 20h', 'Cash', 'Delivered', 1, '2023-08-10 19:30:00', '2023-08-10 20:00:00'),
('OD044', 'U004', 890000, '0985554444', '900 YZA Lane', 'Do Van X', NULL, 'Banking', 'Processing', 1, '2023-09-22 14:00:00', '2023-09-22 14:30:00'),
('OD045', 'U005', 720000, '0977778888', '100 BCD Crescent', 'Nguyen Thi Y', 'Hẹn giờ giao trước', 'Cash', 'Delivered', 1, '2023-10-05 10:30:00', '2023-10-05 11:00:00'),
('OD046', 'U006', 760000, '0968887777', '200 EFG Parkway', 'Le Van Z', 'Giao vào sáng sớm', 'Banking', 'Pending', 0, '2023-11-19 07:15:00', '2023-11-19 07:15:00'),
('OD047', 'U007', 855000, '0954443333', '300 HIJ Drive', 'Pham Van AA', 'Không giao ngày Chủ Nhật', 'Cash', 'Canceled', 0, '2023-12-28 16:30:00', '2023-12-28 16:45:00');

SELECT *
FROM TORDER;
INSERT INTO TDETAILORDER (ORDERID, PRODUCTID, QUANTITY, DELETED, CREATEDAT, UPDATEDAT) VALUES
('OD001', 'P001', 2, 0, '2025-01-01 10:00:00', '2025-01-01 10:00:00'),
('OD001', 'P002', 1, 0, '2025-01-01 10:00:00', '2025-01-01 10:00:00'),
('OD002', 'P003', 5, 0, '2025-01-02 09:00:00', '2025-01-02 09:00:00'),
('OD002', 'P004', 3, 0, '2025-01-02 09:00:00', '2025-01-02 09:00:00'),
('OD003', 'P005', 1, 0, '2025-01-03 08:30:00', '2025-01-03 08:30:00'),
('OD003', 'P006', 2, 0, '2025-01-03 08:30:00', '2025-01-03 08:30:00'),
('OD004', 'P007', 4, 0, '2025-01-04 15:00:00', '2025-01-04 15:00:00'),
('OD004', 'P008', 1, 0, '2025-01-04 15:00:00', '2025-01-04 15:00:00'),
('OD005', 'P009', 3, 0, '2025-01-05 12:00:00', '2025-01-05 12:00:00'),
('OD005', 'P010', 2, 0, '2025-01-05 12:00:00', '2025-01-05 12:00:00'),
('OD003', 'P011', 1, 0, '2025-01-06 10:00:00', '2025-01-06 10:00:00'),
('OD002', 'P012', 1, 0, '2025-01-06 10:00:00', '2025-01-06 10:00:00'),
('OD001', 'P013', 2, 0, '2025-01-07 09:30:00', '2025-01-07 09:30:00'),
('OD005', 'P014', 1, 0, '2025-01-07 09:30:00', '2025-01-07 09:30:00'),
('OD002', 'P015', 4, 0, '2025-01-08 11:00:00', '2025-01-08 11:00:00'),
('OD004', 'P016', 1, 0, '2025-01-08 11:00:00', '2025-01-08 11:00:00'),
('OD004', 'P017', 2, 0, '2025-01-09 10:00:00', '2025-01-09 10:00:00'),
('OD001', 'P018', 3, 0, '2025-01-09 10:00:00', '2025-01-09 10:00:00'),
('OD002', 'P019', 1, 0, '2025-01-10 12:30:00', '2025-01-10 12:30:00'),
('OD005', 'P020', 2, 0, '2025-01-10 12:30:00', '2025-01-10 12:30:00'),
('OD006', 'P001', 1, 0, '2025-01-09 10:00:00', '2025-01-09 10:00:00'),
('OD006', 'P002', 1, 0, '2025-01-10 12:30:00', '2025-01-10 12:30:00');

INSERT INTO TDETAILORDER (ORDERID, PRODUCTID, QUANTITY, DELETED, CREATEDAT, UPDATEDAT) VALUES
-- Details for OD007
('OD007', 'P003', 2, 0, '2025-01-07 10:00:00', '2025-01-07 10:00:00'),
('OD007', 'P015', 1, 0, '2025-01-07 10:00:00', '2025-01-07 10:00:00'),
-- Details for OD008
('OD008', 'P009', 1, 0, '2025-01-08 14:30:00', '2025-01-08 14:45:00'),
('OD008', 'P021', 2, 0, '2025-01-08 14:30:00', '2025-01-08 14:45:00'),
-- Details for OD009
('OD009', 'P005', 1, 0, '2025-01-09 16:00:00', '2025-01-09 16:30:00'),
('OD009', 'P012', 1, 0, '2025-01-09 16:00:00', '2025-01-09 16:30:00'),
-- Details for OD010
('OD010', 'P020', 1, 0, '2025-01-10 11:00:00', '2025-01-10 11:15:00'),
('OD010', 'P017', 2, 0, '2025-01-10 11:00:00', '2025-01-10 11:15:00'),
-- Details for OD011
('OD011', 'P002', 1, 0, '2025-01-11 09:00:00', '2025-01-11 09:00:00'),
-- Details for OD012
('OD012', 'P014', 2, 0, '2025-01-12 08:00:00', '2025-01-12 08:30:00'),
-- Details for OD013
('OD013', 'P007', 1, 0, '2025-01-13 17:45:00', '2025-01-13 18:00:00'),
('OD013', 'P025', 1, 0, '2025-01-13 17:45:00', '2025-01-13 18:00:00'),
-- Details for OD014
('OD014', 'P008', 2, 0, '2025-01-14 10:30:00', '2025-01-14 10:45:00'),
-- Details for OD015
('OD015', 'P011', 1, 0, '2025-01-15 13:15:00', '2025-01-15 13:15:00'),
('OD015', 'P016', 1, 0, '2025-01-15 13:15:00', '2025-01-15 13:15:00'),
-- Details for OD016
('OD016', 'P018', 2, 0, '2025-01-01 10:00:00', '2025-01-01 10:00:00'),
-- Details for OD017
('OD017', 'P001', 1, 0, '2025-01-02 09:00:00', '2025-01-02 11:00:00'),
('OD017', 'P010', 1, 0, '2025-01-02 09:00:00', '2025-01-02 11:00:00'),
-- Details for OD018
('OD018', 'P004', 1, 0, '2025-01-03 08:30:00', '2025-01-03 09:00:00'),
-- Details for OD019
('OD019', 'P006', 1, 0, '2025-01-04 15:00:00', '2025-01-04 17:00:00'),
('OD019', 'P022', 2, 0, '2025-01-04 15:00:00', '2025-01-04 17:00:00'),
-- Details for OD020
('OD020', 'P013', 1, 0, '2025-01-05 12:00:00', '2025-01-05 12:30:00'),
-- Details for OD021
('OD021', 'P019', 2, 0, '2025-01-05 12:00:00', '2025-01-05 12:30:00'),
-- Details for OD022
('OD022', 'P023', 1, 0, '2025-01-02 09:30:00', '2025-01-02 09:30:00'),
-- Details for OD023
('OD023', 'P024', 1, 0, '2025-01-03 15:00:00', '2025-01-03 15:30:00'),
-- Details for OD024
('OD024', 'P003', 2, 0, '2025-01-04 12:45:00', '2025-01-04 13:00:00'),
-- Details for OD025
('OD025', 'P005', 1, 0, '2025-01-05 08:15:00', '2025-01-05 09:00:00'),
-- Details for OD026
('OD026', 'P020', 1, 0, '2025-01-06 18:20:00', '2025-01-06 19:00:00'),
('OD026', 'P007', 2, 0, '2025-01-06 18:20:00', '2025-01-06 19:00:00'),
-- Details for OD027
('OD027', 'P009', 1, 0, '2025-01-07 10:00:00', '2025-01-07 10:00:00'),
('OD027', 'P021', 1, 0, '2025-01-07 10:00:00', '2025-01-07 10:00:00'),
-- Details for OD028
('OD028', 'P012', 2, 0, '2025-01-08 14:30:00', '2025-01-08 14:45:00'),
-- Details for OD029
('OD029', 'P015', 1, 0, '2025-01-09 16:00:00', '2025-01-09 16:30:00'),
-- Details for OD030
('OD030', 'P017', 1, 0, '2025-01-10 11:00:00', '2025-01-10 11:15:00'),
-- Details for OD031
('OD031', 'P014', 2, 0, '2025-01-11 09:00:00', '2025-01-11 09:00:00'),
-- Details for OD032
('OD032', 'P001', 1, 0, '2025-01-12 08:00:00', '2025-01-12 08:30:00'),
-- Details for OD033
('OD033', 'P019', 2, 0, '2025-01-13 17:45:00', '2025-01-13 18:00:00'),
-- Details for OD034
('OD034', 'P025', 1, 0, '2025-01-14 10:30:00', '2025-01-14 10:45:00'),
-- Details for OD035
('OD035', 'P003', 1, 0, '2025-01-15 13:15:00', '2025-01-15 13:15:00'),
('OD035', 'P011', 1, 0, '2025-01-15 13:15:00', '2025-01-15 13:15:00'),
-- Details for OD036
('OD036', 'P022', 1, 0, '2023-01-20 14:00:00', '2023-01-20 14:30:00');

INSERT INTO TDETAILORDER (ORDERID, PRODUCTID, QUANTITY, DELETED, CREATEDAT, UPDATEDAT) VALUES
('OD037', 'P007', 2, 0, '2023-02-15 09:45:00', '2023-02-15 10:00:00'),
('OD037', 'P015', 1, 0, '2023-02-15 09:45:00', '2023-02-15 10:00:00'),

('OD038', 'P003', 1, 0, '2023-03-18 10:00:00', '2023-03-18 10:15:00'),
('OD038', 'P021', 2, 0, '2023-03-18 10:00:00', '2023-03-18 10:15:00'),

('OD039', 'P008', 1, 0, '2023-04-12 16:30:00', '2023-04-12 17:00:00'),
('OD039', 'P017', 2, 0, '2023-04-12 16:30:00', '2023-04-12 17:00:00'),

('OD040', 'P002', 1, 0, '2023-05-25 11:20:00', '2023-05-25 11:30:00'),
('OD040', 'P014', 1, 0, '2023-05-25 11:20:00', '2023-05-25 11:30:00'),

('OD041', 'P019', 2, 0, '2023-06-30 08:00:00', '2023-06-30 08:00:00'),
('OD041', 'P005', 1, 0, '2023-06-30 08:00:00', '2023-06-30 08:00:00'),

('OD042', 'P006', 1, 0, '2023-07-15 13:45:00', '2023-07-15 14:00:00'),
('OD042', 'P024', 2, 0, '2023-07-15 13:45:00', '2023-07-15 14:00:00'),

('OD043', 'P010', 2, 0, '2023-08-10 19:30:00', '2023-08-10 20:00:00'),
('OD043', 'P012', 1, 0, '2023-08-10 19:30:00', '2023-08-10 20:00:00'),

('OD044', 'P013', 1, 0, '2023-09-22 14:00:00', '2023-09-22 14:30:00'),
('OD044', 'P018', 2, 0, '2023-09-22 14:00:00', '2023-09-22 14:30:00'),

('OD045', 'P004', 1, 0, '2023-10-05 10:30:00', '2023-10-05 11:00:00'),
('OD045', 'P022', 2, 0, '2023-10-05 10:30:00', '2023-10-05 11:00:00'),

('OD046', 'P016', 1, 0, '2023-11-19 07:15:00', '2023-11-19 07:15:00'),
('OD046', 'P023', 1, 0, '2023-11-19 07:15:00', '2023-11-19 07:15:00'),

('OD047', 'P001', 2, 0, '2023-12-28 16:30:00', '2023-12-28 16:45:00'),
('OD047', 'P020', 1, 0, '2023-12-28 16:30:00', '2023-12-28 16:45:00');

SET SQL_SAFE_UPDATES = 0;

UPDATE TORDER AS o
SET TOTALAMOUNT = (
    SELECT SUM(d.QUANTITY * p.PRICE * (1-p.DISCOUNT))
    FROM TDETAILORDER AS d
    JOIN TPRODUCT AS p ON d.PRODUCTID = p.PRODUCTID
    WHERE d.ORDERID = o.ORDERID
)
WHERE EXISTS (
    SELECT 1
    FROM TDETAILORDER AS d
    JOIN TPRODUCT AS p ON d.PRODUCTID = p.PRODUCTID
    WHERE d.ORDERID = o.ORDERID
);
SET SQL_SAFE_UPDATES = 1;
INSERT INTO TROLE(ROLEID, TITLE, PERMISSION, DESCRIPTION)
VALUE ('R000', 'Quản Trị Viên',
JSON_ARRAY('categories_view','categories_create','categories_update','categories_delete',
			'products_view','products_create','products_update','products_delete',
            'orders_view','orders_update',
            'accounts_view','accounts_create','accounts_update','accounts_delete',
            'customers_view','customers_create','customers_update','customers_delete',
            'statistics_view',
            'roles_view','roles_create','roles_update','roles_delete','roles_permission',
            'settings_view','settings_update'
),
'Chủ sở hữu của cửa hàng, có toàn quyền');
INSERT INTO TROLE(ROLEID, TITLE, PERMISSION, DESCRIPTION)
VALUE ('R001', 'Quản lý nội dung',
JSON_ARRAY('categories_view','categories_update',
			'products_view','products_create','products_update','products_delete'
),
'Nhân viên có quyền thao tác với sản phẩm');


-- ----------------------------------------LOGIC XỬ LÝ CHO CHỨC NĂNG KHI TẠO MỚI SAU X PHÚT SẼ XÓA RECORD ----------------------------------------
SET GLOBAL event_scheduler = ON;

CREATE EVENT delete_expired_records
ON SCHEDULE EVERY 1 MINUTE
DO
DELETE FROM TFORGETPASSWORD
WHERE TIMESTAMPDIFF(MINUTE, CREATED_AT, NOW()) >= 2;
-- ------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------- FUNCTION ----------------------------------------
DROP FUNCTION IF EXISTS GenerateNextId;
DELIMITER $$
CREATE FUNCTION GenerateNextId(input_id VARCHAR(255)) 
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    DECLARE prefix VARCHAR(255) DEFAULT '';
    DECLARE numeric_part INT DEFAULT 0;
    DECLARE next_numeric_part INT DEFAULT 0;
    DECLARE next_numeric_str VARCHAR(255);
    DECLARE i INT DEFAULT 1;
    DECLARE len INT;
    DECLARE numeric_length INT;
    -- Tìm chiều dài của chuỗi
    SET len = LENGTH(input_id);
    -- Tìm phần chữ (prefix) - duyệt từ đầu đến khi gặp số
    WHILE i <= len AND MID(input_id, i, 1) REGEXP '[A-Za-z]' DO
        SET prefix = CONCAT(prefix, MID(input_id, i, 1));
        SET i = i + 1;
    END WHILE;
    -- Kiểm tra nếu không có phần chữ hoặc không có phần số
    IF prefix = '' OR i > len THEN
        RETURN NULL; -- Trả về NULL nếu không có chữ hoặc không có số
    END IF;
    -- Tách phần số sau phần chữ
    SET numeric_part = CAST(SUBSTRING(input_id, i) AS UNSIGNED);
    -- Kiểm tra nếu phần số không hợp lệ
    IF numeric_part IS NULL THEN
        RETURN NULL; -- Trả về NULL nếu phần số không hợp lệ
    END IF;
    -- Tính toán số tiếp theo
    SET next_numeric_part = numeric_part + 1;
    -- Xác định độ dài phần số trong ID ban đầu
    SET numeric_length = len - i + 1;
    -- Chuyển số tiếp theo thành chuỗi và làm đầy với số 0 nếu cần
    SET next_numeric_str = LPAD(next_numeric_part, numeric_length, '0');
    -- Trả về ID tiếp theo
    RETURN CONCAT(prefix, next_numeric_str);
END $$
DELIMITER ;
-- ---------------------------------------- STORED ----------------------------------------
-- ---------------------------------------- USER ----------------------------------------
DROP PROCEDURE IF EXISTS INSERT_TUSER;
DELIMITER $$
CREATE PROCEDURE INSERT_TUSER (
    IN _FULLNAME VARCHAR(100),
    IN _EMAIL VARCHAR(100),
    IN _PHONE VARCHAR(20),
    IN _AVATAR VARCHAR(255),
    IN _PASSWORD VARCHAR(255),
    IN _STATUS VARCHAR(20)
)
BEGIN
	DECLARE PREID VARCHAR(100);
	DECLARE NEXTID VARCHAR(100);
    
    -- Kiểm tra nếu EMAIL đã tồn tại
    IF EXISTS (SELECT 1 FROM TUSER WHERE EMAIL = _EMAIL) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'EMAIL đã tồn tại.';
    ELSE
		SELECT MAX(USERID) INTO PREID -- LẤY ID LỚN NHẤT
		FROM TUSER;

		SET NEXTID = GenerateNextId(PREID); -- SINH ID TIẾP THEO
        
        -- Thực hiện chèn dữ liệu
        INSERT INTO TUSER (USERID, FULLNAME, EMAIL, PHONE, AVATAR, PASSWORD, STATUS) 
        VALUES (NEXTID, _FULLNAME, _EMAIL, _PHONE, _AVATAR, _PASSWORD, _STATUS);

        -- Trả về thông báo thành công
        SELECT 'Thêm khách hàng thành công!' AS Result;
    END IF;
END$$
DELIMITER ;
-- UPDATE USER
DROP PROCEDURE IF EXISTS UPDATE_TUSER;
DELIMITER $$
CREATE PROCEDURE UPDATE_TUSER(
	IN _USERID VARCHAR(100),
    IN _FULLNAME VARCHAR(100),
    IN _EMAIL VARCHAR(100),
    IN _PHONE VARCHAR(100),
    IN _AVATAR VARCHAR(255),
    IN _PASSWORD VARCHAR(255),
    IN _STATUS VARCHAR(20)
)
BEGIN
	UPDATE TUSER
    SET 
		FULLNAME=_FULLNAME,
        EMAIL=_EMAIL,
        PHONE=_PHONE,
        AVATAR=_AVATAR,
        PASSWORD=_PASSWORD,
        STATUS=_STATUS
	WHERE USERID=_USERID;
END $$
DELIMITER ;
-- ---------------------------------------- ADMIN ----------------------------------------
DROP PROCEDURE IF EXISTS INSERT_TADMIN;
DELIMITER $$
CREATE PROCEDURE INSERT_TADMIN(
    IN _FULLNAME VARCHAR(100),
    IN _PASSWORD VARCHAR(255),
    IN _PHONE VARCHAR(20),
    IN _STATUS VARCHAR(20),
    IN _EMAIL VARCHAR(100),
    IN _AVATAR VARCHAR(255),
    IN _ROLEID VARCHAR(100)
)
BEGIN
	DECLARE PREID VARCHAR(100);
	DECLARE NEXTID VARCHAR(100);
    -- Kiểm tra nếu EMAIL đã tồn tại
    IF EXISTS (SELECT 1 FROM TADMIN WHERE EMAIL = _EMAIL) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'EMAIL đã tồn tại.';
    ELSE
		SELECT MAX(ADMINID) INTO PREID -- LẤY ID LỚN NHẤT
		FROM TADMIN;
        
		SET NEXTID = GenerateNextId(PREID); -- SINH ID TIẾP THEO
		
		INSERT INTO TADMIN (ADMINID, FULLNAME, PASSWORD, PHONE, STATUS, EMAIL, AVATAR, ROLEID)
		VALUES (NEXTID, _FULLNAME, _PASSWORD, _PHONE, _STATUS, _EMAIL, _AVATAR, _ROLEID);

        -- Trả về thông báo thành công
        SELECT 'Thêm admin thành công!' AS Result;
    END IF;
END$$
DELIMITER ;
-- UPDATE ADMIN
SELECT *
FROM TADMIN;
DROP PROCEDURE IF EXISTS UPDATE_TADMIN;
DELIMITER $$
CREATE PROCEDURE UPDATE_TADMIN(
	IN _ADMINID VARCHAR(100),
    IN _FULLNAME VARCHAR(100),
    IN _EMAIL VARCHAR(100),
    IN _PHONE VARCHAR(100),
    IN _AVATAR VARCHAR(255),
    IN _PASSWORD VARCHAR(255),
    IN _STATUS VARCHAR(20),
    IN _ROLEID VARCHAR(100)
)
BEGIN
	UPDATE TADMIN
    SET 
		FULLNAME=_FULLNAME,
        EMAIL=_EMAIL,
        PHONE=_PHONE,
        AVATAR=_AVATAR,
        PASSWORD=_PASSWORD,
        STATUS=_STATUS,
        ROLEID= _ROLEID
	WHERE ADMINID=_ADMINID;
END $$
DELIMITER ;
INSERT INTO TADMIN(ADMINID, FULLNAME, PASSWORD, PHONE, STATUS, EMAIL, AVATAR, ROLEID)
VALUES ('AD000000','Trần Đại Đồng',
 '827ccb0eea8a706c4c34a16891f84e7b', 
 '0376410832', 
 'Active', 
 'daidong.tran15@gmail.com', 
 'https://th.bing.com/th/id/OIP.5X5mJHdAdVpngropYGuKVQHaHa?rs=1&pid=ImgDetMain',
 'R000');
-- ---------------------------------------- PRODUCT ----------------------------------------
DROP PROCEDURE IF EXISTS INSERT_TPRODUCT;
DELIMITER $$
CREATE PROCEDURE INSERT_TPRODUCT(
    IN _CATEGORYID VARCHAR(100),
    IN _TITLE VARCHAR(100),
    IN _PRICE DECIMAL(10),
    IN _DISCOUNT FLOAT,
    IN _THUMBNAIL VARCHAR(255),
    IN _POSITION INT,
    IN _QUANTITY INT,
    IN _DESCRIPTION TEXT,
    IN _STATUS VARCHAR(20),
    IN _SLUG VARCHAR(255),
    IN _CREATEDBY VARCHAR(100)
)
BEGIN
	DECLARE PREID VARCHAR(100);
    DECLARE NEXTID VARCHAR(100);

    SELECT MAX(PRODUCTID) INTO PREID -- LẤY ID LỚN NHẤT
    FROM TPRODUCT;

    SET NEXTID = GenerateNextId(PREID); -- SINH ID TIẾP THEO
    
    INSERT INTO TPRODUCT (PRODUCTID, CATEGORYID, TITLE, PRICE, DISCOUNT, THUMBNAIL, POSITION, QUANTITY, DESCRIPTION, STATUS, SLUG, CREATED, UPDATED) 
    VALUES (NEXTID, _CATEGORYID, _TITLE, _PRICE, _DISCOUNT, _THUMBNAIL, _POSITION, _QUANTITY, _DESCRIPTION, _STATUS, _SLUG, JSON_OBJECT('CREATEDBY', _CREATEDBY, 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')),JSON_OBJECT('UPDATEDBY', _CREATEDBY, 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')));
END $$
DELIMITER ;

-- UPDATE PRODUCT
DROP PROCEDURE IF EXISTS UPDATE_TPRODUCT;
DELIMITER $$
CREATE PROCEDURE UPDATE_TPRODUCT(
	IN _PRODUCTID VARCHAR(100),
    IN _CATEGORYID VARCHAR(100),
    IN _TITLE VARCHAR(100),
    IN _PRICE DECIMAL(10),
    IN _DISCOUNT FLOAT,
    IN _THUMBNAIL VARCHAR(255),
    IN _POSITION INT,
    IN _QUANTITY INT,
    IN _DESCRIPTION TEXT,
    IN _STATUS VARCHAR(20),
    IN _UPDATEDBY VARCHAR(100)
)
BEGIN
	UPDATE TPRODUCT
    SET 
		CATEGORYID=_CATEGORYID,
        TITLE=_TITLE,
        PRICE=_PRICE,
        DISCOUNT=_DISCOUNT,
        THUMBNAIL=_THUMBNAIL,
        POSITION=_POSITION,
        QUANTITY=_QUANTITY,
        DESCRIPTION=_DESCRIPTION,
        STATUS=_STATUS,
        UPDATED =JSON_SET(
			UPDATED,
            '$.UPDATEDBY',_UPDATEDBY,
            '$.UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))
	WHERE PRODUCTID=_PRODUCTID;
END $$
DELIMITER ;
-- ---------------------------------------- CATEGORY ----------------------------------------
DROP PROCEDURE IF EXISTS INSERT_TCATEGORY;
DELIMITER $$
CREATE PROCEDURE INSERT_TCATEGORY(
	IN _TITLE VARCHAR(100),
    IN _DESCRIPTION TEXT,
    IN _THUMBNAIL VARCHAR(255),
    IN _POSITION INT,
    IN _STATUS VARCHAR(20),
    IN _SLUG VARCHAR(255),
    IN _CREATEDBY VARCHAR(100)
)
BEGIN
	DECLARE PREID VARCHAR(100);
    DECLARE NEXTID VARCHAR(100);

    SELECT MAX(CATEGORYID) INTO PREID -- LẤY ID LỚN NHẤT
    FROM TCATEGORY;

    SET NEXTID = GenerateNextId(PREID); -- SINH ID TIẾP THEO
    
    INSERT INTO TCATEGORY (CATEGORYID, TITLE, DESCRIPTION, POSITION, THUMBNAIL, STATUS, SLUG, CREATED, UPDATED) 
    VALUES (NEXTID, _TITLE, _DESCRIPTION, _POSITION, _THUMBNAIL, _STATUS, _SLUG, JSON_OBJECT('CREATEDBY', _CREATEDBY, 'CREATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')),JSON_OBJECT('UPDATEDBY', _CREATEDBY, 'UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')));
END $$
DELIMITER ;

-- UPDATE PRODUCT
DROP PROCEDURE IF EXISTS UPDATE_TCATEGORY;
DELIMITER $$
CREATE PROCEDURE UPDATE_TCATEGORY(
    IN _CATEGORYID VARCHAR(100),
	IN _TITLE VARCHAR(100),
    IN _DESCRIPTION TEXT,
    IN _THUMBNAIL VARCHAR(255),
    IN _POSITION INT,
    IN _STATUS VARCHAR(20),
    IN _UPDATEDBY VARCHAR(100)
)
BEGIN
	UPDATE TCATEGORY
    SET 
        TITLE=_TITLE,
		DESCRIPTION=_DESCRIPTION,
        THUMBNAIL=_THUMBNAIL,
        POSITION=_POSITION,
        STATUS=_STATUS,
        UPDATED =JSON_SET(
			UPDATED,
            '$.UPDATEDBY',_UPDATEDBY,
            '$.UPDATEDAT', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))
	WHERE CATEGORYID=_CATEGORYID;
END $$
DELIMITER ;

-- ---------------------------------------- SETTING ----------------------------------------
-- UPDATE PRODUCT
DROP PROCEDURE IF EXISTS UPDATE_TSETTING;
DELIMITER $$
CREATE PROCEDURE UPDATE_TSETTING(
	IN _WEBNAME VARCHAR(100),
	IN _LOGO VARCHAR(100),
	IN _PHONE VARCHAR(20),
	IN _EMAIL VARCHAR(100),
    IN _TITLE VARCHAR(100),
	IN _ADDRESS VARCHAR(255),
	IN _COPYRIGHT VARCHAR(100)
)
BEGIN
	UPDATE TSETTING
    SET 
        WEBNAME=_WEBNAME,
		LOGO=_LOGO,
        PHONE=_PHONE,
        EMAIL=_EMAIL,
        TITLE=_TITLE,
        ADDRESS=_ADDRESS,
        COPYRIGHT =_COPYRIGHT
	WHERE SETTINGID="SETTING";
END $$
DELIMITER ;
-- ---------------------------------------- ROLE ----------------------------------------
DROP PROCEDURE IF EXISTS INSERT_TROLE;
DELIMITER $$
CREATE PROCEDURE INSERT_TROLE(
    IN _TITLE VARCHAR(100),
    IN _DESCRIPTION TEXT
)
BEGIN
	DECLARE PREID VARCHAR(100);
    DECLARE NEXTID VARCHAR(100);

    SELECT MAX(ROLEID) INTO PREID -- LẤY ID LỚN NHẤT
    FROM TROLE;

    SET NEXTID = GenerateNextId(PREID); -- SINH ID TIẾP THEO
    
    INSERT INTO TROLE (ROLEID, TITLE , DESCRIPTION) 
    VALUES (NEXTID, _TITLE,_DESCRIPTION);
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS UPDATE_TROLE;
DELIMITER $$
CREATE PROCEDURE UPDATE_TROLE(
    IN _ROLEID VARCHAR(100),         -- ID của vai trò cần cập nhật
    IN _TITLE VARCHAR(100),          -- Tiêu đề mới (nếu có)
    IN _PERMISSION JSON,             -- Mảng quyền mới (JSON)
    IN _DESCRIPTION TEXT             -- Mô tả mới (nếu có)
)
BEGIN
    -- Kiểm tra xem vai trò có tồn tại không
    IF EXISTS (SELECT 1 FROM TROLE WHERE ROLEID = _ROLEID) THEN
        -- Tiến hành cập nhật
        UPDATE TROLE
        SET 
            TITLE = _TITLE,
            PERMISSION = _PERMISSION,
            DESCRIPTION = _DESCRIPTION
        WHERE ROLEID = _ROLEID;
    END IF;
END $$
DELIMITER ;
-- ---------------------------------------- CART ----------------------------------------
SELECT *
FROM TCART;
DROP PROCEDURE IF EXISTS INSERT_TCART;
DELIMITER $$
CREATE PROCEDURE INSERT_TCART(
    IN _USERID VARCHAR(100),
    IN _PRODUCTID VARCHAR(100),
    IN _QUANTITY INT
)
BEGIN
	DECLARE PREID VARCHAR(100);
    DECLARE NEXTID VARCHAR(100);

    SELECT MAX(CARTID) INTO PREID -- LẤY ID LỚN NHẤT
    FROM TCART;

    SET NEXTID = GenerateNextId(PREID); -- SINH ID TIẾP THEO
    
    INSERT INTO TCART (CARTID, USERID , PRODUCTID, QUANTITY, STATUS) 
    VALUES (NEXTID, _USERID,_PRODUCTID,_QUANTITY,"Active");
END $$
DELIMITER ;
-- ---------------------------------------- CART ----------------------------------------
-- ---------------------------------------- ORDER ----------------------------------------
DROP PROCEDURE IF EXISTS INSERT_TORDER;
DELIMITER $$
CREATE PROCEDURE INSERT_TORDER(
    IN _USERID VARCHAR(100),
    IN _TOTALAMOUNT DECIMAL(10),
    IN _PHONE VARCHAR(20),
    IN _ADDRESS VARCHAR(255),
    IN _FULLNAME VARCHAR(100),
    IN _NOTE TEXT,
    OUT _ORDERID VARCHAR(100)
)
BEGIN
	DECLARE PREID VARCHAR(100);
    DECLARE NEXTID VARCHAR(100);

    SELECT MAX(ORDERID) INTO PREID -- LẤY ID LỚN NHẤT
    FROM TORDER;

    SET NEXTID = GenerateNextId(PREID); -- SINH ID TIẾP THEO

    INSERT INTO TORDER (ORDERID, USERID , TOTALAMOUNT, PHONE, ADDRESS, FULLNAME, NOTE,PAYMETHOD, STATUS,PAID) 
    VALUES (NEXTID, _USERID,_TOTALAMOUNT,_PHONE,_ADDRESS,_FULLNAME,_NOTE,"Cash","Pending",0);
    
	SET _ORDERID = NEXTID;
END $$
DELIMITER ;
-- ---------------------------------------- ORDER DETAIL ----------------------------------------
