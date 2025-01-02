const slugify = require('slugify');
const shortid = require('shortid');

function generateSlug(title) {
  const slug = slugify(title, { lower: true });
  return `${slug}-${shortid.generate()}`;
}
// Export hàm để sử dụng ở file khác
module.exports = { generateSlug };
