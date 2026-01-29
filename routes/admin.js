const express = require("express");
const router = express.Router();
const db = require("../data/db");


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

// --- BLOG SİLME ONAY SAYFASI (GET) ---
router.get("/blogs/delete/:blogid", async function(req, res) {
    const blogid = req.params.blogid;
    try {
       const [blogs] = await db.execute("select * from blog where blogid=?", [blogid]);
       const blog = blogs[0];
       
       if (blog) {
           res.render("admin/blog-delete", {
               title: "blog delete",
               blog: blog
           });
       } else {
           res.redirect("/admin/blogs");
       }
    } catch (err) {
        console.log(err);
        res.redirect("/admin/blogs");
    }
});

// --- BLOG SİLME İŞLEMİ (POST) ---
router.post("/blogs/delete/:blogid", async function(req, res) {
    const blogid = req.params.blogid;
    try {
       await db.execute("delete from blog where blogid=?", [blogid]);
       res.redirect("/admin/blogs?action=delete");
    } catch (err) {
        console.log(err);
        res.status(500).send("Silme sırasında hata oluştu.");
    }
});

// --- BLOG OLUŞTURMA (POST) ---
router.post("/blogs/create", async function(req, res) {
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.body.resim;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const kategori = req.body.kategori;

    try {
        await db.execute(
            "INSERT INTO blog(baslik, description, resim, anasayfa, onay, categoryid) VALUES (?,?,?,?,?,?)",
            [baslik, aciklama, resim, anasayfa, onay, kategori]
        );
        res.redirect("/admin/blogs?action=create");
    } catch (err) {
        console.log("Hata oluştu:", err);
        res.status(500).send("Veritabanı hatası oluştu.");
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
    } catch (err) {
        console.log("Hata oluştu:", err);
    }
    res.redirect("/admin/blogs");
});






// --- BLOG GÜNCELLEME (POST) ---
router.post("/blogs/:blogid", async function(req, res) {
    const blogid = req.params.blogid; 
    
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.body.resim;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const kategoriid = req.body.kategori;

    try {
        await db.execute(
            "UPDATE blog SET baslik=?, description=?, resim=?, anasayfa=?, onay=?, categoryid=? WHERE blogid=?",
            [baslik, aciklama, resim, anasayfa, onay, kategoriid, blogid]
        );
        res.redirect("/admin/blogs/?action=edit&&blogid=" + blogid);
    } catch (err) {
        console.log(err);
        res.status(500).send("Güncelleme sırasında hata oluştu.");
    }
});

//req.body -> dersek formdan gelir:
// --- BLOG LİSTESİ (GET) ---
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

module.exports = router;