const express = require("express");
const router = express.Router();

const db = require("../data/db");

router.use("/blogs/category/:categoryid", async function(req,res) {
    const id = req.params.categoryid;
    try {
        const [blogs, ] = await db.execute(
            "select BlogId, Baslik, Description, Resim, Onay, Anasayfa from blog where categoryid=? and Onay=1", 
            [id]
        );
        const [categories, ] = await db.execute("select * from category");
        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory:id
        });
    }
    catch(err) {
        console.log(err);
    }
});

router.use("/blogs/:blogid", async function(req, res) {
    const id = req.params.blogid;
    try {
        const [blogs, ] = await db.execute(
            "select BlogId, Baslik, Description, Resim, Onay, Anasayfa from blog where BlogId=?", 
            [id]
        );
        const blog = blogs[0];

        if(blog) {
            return res.render("users/blog-details", {
                title: blog.Baslik,  
                blog: blog           
            });
        }
        else {
            res.redirect("/");
        }
    }
    catch(err) {
        console.log(err);
    }
});

router.use("/blogs", async function(req, res) {
    try {
        const [blogs, ] = await db.execute(
            "select BlogId, Baslik, Description, Resim, Onay, Anasayfa from blog where Onay=1"
        );
        const [categories, ] = await db.execute("select * from category");

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
             selectedCategory:null
        });
    }
    catch(err) {
        console.log(err);
    }
});

router.use("/", async function(req, res) {
    try {
        const [blogs, ] = await db.execute(
            "select BlogId, Baslik, Description, Resim, Onay, Anasayfa from blog where Onay=1 and Anasayfa=1"
        );
        const [categories, ] = await db.execute("select * from category");

        res.render("users/index", {
            title: "Popüler Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory:null
        });
    }
    catch(err) {
        console.log(err);
    }
});
 
module.exports = router;