const express = require("express");
const router = express.Router();

const db=require("../data/db");

// router.use yerine router.get kullanımı
router.get("/blogs/create", async function(req, res) {
    try{
        //ilki sorgu, 2. column bilgisi:
        const[categories,] = await db.execute("select * from category");
    res.render("admin/blog-create", {
        title: "add blog",
        categories:categories
    }); 
    }catch(err){
        console.log(err);
    }

});



router.post("/blogs/create", async function(req, res) {
    // Formdan gelen verileri terminaldeki isimlere göre alıyoruz
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama; // req.body.description olan yeri düzelttik
    const resim = req.body.resim;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const kategori = req.body.kategori;

    try {
        // SQL tarafında sütun adın 'description', ama gönderdiğin değişken 'aciklama'
        await db.execute(
            "INSERT INTO blog(baslik, description, resim, anasayfa, onay, categoryid) VALUES (?,?,?,?,?,?)",
            [baslik, aciklama, resim, anasayfa, onay, kategori]
        );
        res.redirect("/admin/blogs"); // Veri başarıyla eklenirse ana sayfaya yönlendirir
    } catch (err) {
        console.log("Hata oluştu:", err);
        res.status(500).send("Veritabanı hatası oluştu.");
    }
});






router.get("/blogs/:blogid", async function(req, res) {
    // 1. Params bir objedir, nokta notasyonu ile erişiyoruz
    const blogid = req.params.blogid; 

    try {
        // 2. Görsele göre sütun adını 'blogId' olarak güncelledik
        const [blogs] = await db.execute("select * from blog where blogId=?", [blogid]);
        
        // 3. Kategorileri dizi olarak parçalayarak alıyoruz
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
    // Blog bulunamazsa veya hata olursa listeye atar
    res.redirect("/admin/blogs");
});





router.get("/blogs",  async function(req, res) {

    try{
        const [blogs,] = await db.execute("SELECT blogId,baslik,resim  FROM blog");
          res.render("admin/blog-list",{
            title:"blog list",
            blogs:blogs
          });
    }
    catch(err){
        console.log(err);
    }




});

module.exports = router;