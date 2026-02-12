const express = require("express");
const router = express.Router();
const db = require("../data/db");

// --- BLOG LİSTESİ ---
router.get("/blogs", async function(req, res) {
    try {
        const [blogs] = await db.execute("SELECT blogId, baslik, resim FROM blog");
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        });
    } catch (err) {
        console.log(err);
    }
});

// --- BLOG OLUŞTURMA (GET) ---
router.get("/blogs/create", async function(req, res) {
    try {
        const [categories] = await db.execute("select * from category");
        res.render("admin/blog-create", {
            title: "add blog",
            categories: categories
        });
    } catch (err) {
        console.log(err);
    }
});

// --- BLOG OLUŞTURMA (POST) ---
router.post("/blogs/create", async function(req, res) {
    const { baslik, aciklama, resim, kategori } = req.body;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;

    try {
        await db.execute(
            "INSERT INTO blog(baslik, description, resim, anasayfa, onay, categoryid) VALUES (?,?,?,?,?,?)",
            [baslik, aciklama, resim, anasayfa, onay, kategori]
        );
        res.redirect("/admin/blogs?action=create");
    } catch (err) {
        console.log(err);
        res.status(500).send("Veritabanı hatası");
    }
});

// --- BLOG DÜZENLEME (GET) ---
router.get("/blogs/:blogid", async function(req, res) {
    const blogid = req.params.blogid;
    try {
        const [blogs] = await db.execute("select * from blog where blogId=?", [blogid]);
        const [categories] = await db.execute("select * from category");
        const blog = blogs[0];

        if (blog) {
            return res.render("admin/blog-edit", {
                title: blog.baslik,
                blog: blog,
                categories: categories
            });
        }
        res.redirect("/admin/blogs");
    } catch (err) {
        console.log(err);
    }
});

// --- BLOG GÜNCELLEME (POST) ---
router.post("/blogs/:blogid", async function(req, res) {
    const blogid = req.params.blogid; 
    const { baslik, aciklama, resim, kategori } = req.body;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;

    try {
        await db.execute(
            "UPDATE blog SET baslik=?, description=?, resim=?, anasayfa=?, onay=?, categoryid=? WHERE blogid=?",
            [baslik, aciklama, resim, anasayfa, onay, kategori, blogid]
        );
        res.redirect("/admin/blogs?action=edit&blogid=" + blogid);
    } catch (err) {
        console.log(err);
        res.status(500).send("Güncelleme hatası");
    }
});

// --- KATEGORİ LİSTESİ ---
router.get("/categories", async function(req, res) {
    try {
        const [categories] = await db.execute("SELECT * FROM category");
        res.render("admin/category-list", {
            title: "category list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    } catch (err) {
        console.log(err);
    }
});

// --- KATEGORİ OLUŞTURMA (GET) ---
router.get("/category/create", async function(req, res) {
    res.render("admin/category-create", { title: "add category" });
});

// --- KATEGORİ OLUŞTURMA (POST) ---
router.post("/categories/create", async function(req, res) {
    const name = req.body.name;
    try {
        await db.execute("INSERT INTO category(name) VALUES (?)", [name]);
        res.redirect("/admin/categories?action=create");
    } catch (err) {
        console.log(err);
        res.status(500).send("Hata oluştu");
    }
});

// --- KATEGORİ DÜZENLEME (GET) ---
router.get("/categories/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid;
    try {
        const [categories] = await db.execute("select * from category where categoryid=?", [categoryid]);
        const category = categories[0];

        if (category) {
            return res.render("admin/category-edit", {
                title: category.name,
                category: category
            });
        }
        res.redirect("/admin/categories");
    } catch (err) {
        console.log(err);
        res.redirect("/admin/categories");
    }
});

// --- KATEGORİ GÜNCELLEME (POST) ---
router.post("/categories/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid; 
    const name = req.body.name;
    try {
        await db.execute("UPDATE category SET name=? WHERE categoryid=?", [name, categoryid]);
        res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
    } catch (err) {
        console.log(err);
        res.status(500).send("Güncelleme hatası");
    }
});

// --- KATEGORİ SİLME ONAY SAYFASI (GET) ---
router.get("/categories/delete/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid;
    try {
        const [categories] = await db.execute("select * from category where categoryid=?", [categoryid]);
        const category = categories[0];

        if (category) {
            return res.render("admin/category-delete", {
                title: "category delete",
                category: category
            });
        }
        res.redirect("/admin/categories");
    } catch (err) {
        console.log(err);
        res.redirect("/admin/categories");
    }
});

// --- KATEGORİ SİLME İŞLEMİ (POST) ---
router.post("/categories/delete/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid;
    try {
        await db.execute("delete from category where categoryid=?", [categoryid]);
        res.redirect("/admin/categories?action=delete");
    } catch (err) {
        console.log(err);
        res.status(500).send("Silme işlemi sırasında bir hata oluştu. Bu kategoriye bağlı bloglar olabilir.");
    }
});

module.exports = router;