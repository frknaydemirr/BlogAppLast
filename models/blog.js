const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define("blog", {
  blogid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  baslik: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  altbaslik: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  aciklama: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  anasayfa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  onay: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  categoryid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

async function sync() {
  await Blog.sync({ force: true });
  console.log("Blog tablosu eklendi!");
}

sync();

module.exports = Blog;
