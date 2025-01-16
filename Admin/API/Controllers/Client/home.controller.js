const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');

//[GET] /
module.exports.index = async (req, res) => {
    let keyword = null;
    let status = null;
    let sortKey = "POSITION";
    let sortValue = "ASC"
    if (req.query.keyword) {
        keyword = `%${req.query.keyword}%`;
    }
    if (req.query.status) {
        status = req.query.status;
    }
    if (req.query.sortKey) {
        sortKey = req.query.sortKey;
    }
    if (req.query.sortValue) {
        sortValue = req.query.sortValue;
    }

    // const filterStatus = filterStatusHelper(req.query);

    try {
        // Start pagination
        const [countProducts] = await sequelize.query(`
            SELECT COUNT(*) AS TOTAL
            FROM TPRODUCT 
            WHERE (TITLE LIKE :keyword OR :keyword IS NULL) AND DELETED = 0
                AND (STATUS = :status OR :status IS NULL)
        `, {
            replacements: {
                keyword,
                status
            },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        // const objectPagination = paginationHelper(
        //     {
        //         currentPage: 1,
        //         limitItems: 10
        //     },
        //     req.query,
        //     countProducts.TOTAL
        // )
        // End pagination
        // const products = await sequelize.query(`
        //     SELECT P.*, A1.FULLNAME AS CREATEDBY,  A2.FULLNAME AS UPDATEDBY
        //     FROM TPRODUCT P
        //     JOIN TADMIN A1 ON P.CREATED->>'$.CREATEDBY' = A1.ADMINID
        //     JOIN TADMIN A2 ON P.UPDATED->>'$.UPDATEDBY' = A2.ADMINID
        //     WHERE (P.TITLE LIKE :keyword OR :keyword IS NULL) AND P.DELETED=0
        //         AND (P.STATUS = :status OR :status IS NULL)
        //     ORDER BY P.${sortKey} ${sortValue}
        //     LIMIT :limit OFFSET :skip
        // `, {
        //     replacements: {
        //         keyword,
        //         status,
        //         limit: objectPagination.limitItems,
        //         skip: objectPagination.skip
        //     },
        //     type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        // });

        const products = await sequelize.query(`
            SELECT P.*, A1.FULLNAME AS CREATEDBY,  A2.FULLNAME AS UPDATEDBY
            FROM TPRODUCT P
            JOIN TADMIN A1 ON P.CREATED->>'$.CREATEDBY' = A1.ADMINID
            JOIN TADMIN A2 ON P.UPDATED->>'$.UPDATEDBY' = A2.ADMINID
            WHERE (P.TITLE LIKE :keyword OR :keyword IS NULL) AND P.DELETED=0
                AND (P.STATUS = :status OR :status IS NULL)
            ORDER BY P.${sortKey} ${sortValue}
            LIMIT 8 OFFSET 0
        `, {
            replacements: {
                keyword,
                status
            },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const categories = await sequelize.query(`
            SELECT *
            FROM TCATEGORY
            WHERE DELETED = 0 AND STATUS = "Active";
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });

        const [setting] = await sequelize.query(`
            SELECT *
            FROM TSETTING
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });

        if (req.query.keyword) {
            keyword = req.query.keyword;
        }
        res.json({
            products,
            categories,
            setting
        });
        // res.render('admin/pages/products/index.pug', {
        //     pageTitle: "Sản phẩm",
        //     keyword: keyword,
        //     sortKey: sortKey,
        //     sortValue: sortValue,
        //     filterStatus: filterStatus,
        //     pagination: objectPagination,
        //     products: products
        // });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}