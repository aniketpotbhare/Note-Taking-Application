const express = require ('express');

const app = express();
const path =require ('path');
const fs =require ('fs')

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//   we can connect ejs  /also we find static files ,like css ,js in
app.use(express.static(path.join(__dirname,"public")))


//1 -display list of Files
app.get('/',(req,res)=>{
    // asli logic 
    fs.readdir(`./files` ,function(err,files){ //files folder ko read krega
        if (err) {
            return res.status(500).send('Unable to read files');
        }
        res.render("index", { files: files ,editMode:false});
  })
}) 

//3 get files 
app.get('/file/:filename' ,(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8" ,function(err,filedata) {

        // console.log(filedata)
        
        if(err) {
            return res.status(500).send('Unable to read File');
        }
     res.render('show',{filename: req.params.filename, filedata:filedata});
    })
})



 
//2 post task files
app.post('/create' ,(req,res)=>{
    fs.writeFile(`./files/${req.body.title}.txt`,req.body.content,(err)=>{
        res.redirect('/')
    })
   
})

// 4 
// app.get('edit/:filename' ,(req,res)=>{
//     res.render("edit")

// })
// 4 - Display edit form
// app.get('/edit/:filename', (req, res) => {
//     const filename = decodeURIComponent(req.params.filename);
//     fs.readFile(`./files/${filename}`, "utf-8", (err, filedata) => {
//         if (err) {
//             return res.status(500).send('Unable to read file');
//         }
//         res.render('edit', { filename: filename, filedata: filedata });
//     });
// });





// // Delete a file
// app.get('/delete/:filename', (req, res) => {
//     const filename = decodeURIComponent(req.params.filename);
//     fs.unlink(`./files/${filename}`, (err) => {
//         if (err) {
//             return res.status(500).send('Unable to delete file');
//         }
//         res.redirect('/');
//     });
// });


// 4 - Display edit form
app.get('/edit/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    fs.readFile(`./files/${filename}`, "utf-8", (err, filedata) => {
        if (err) {
            return res.status(500).send('Unable to read file');
        }
        fs.readdir(`./files`, (err, files) => {
            if (err) {
                return res.status(500).send('Unable to read files');
            }
            res.render("index", { files: files, editMode: true, editFile: { filename: filename, filedata: filedata } });
        });
    });
});

// 5 - Update filedata
app.post('/update/:filename', (req, res) => {
    const oldFilename = decodeURIComponent(req.params.filename);
    const newFilename = `${req.body.title}.txt`;
    fs.rename(`./files/${oldFilename}`, `./files/${newFilename}`, (err) => {
        if (err) {
            return res.status(500).send('Unable to rename file');
        }
        fs.writeFile(`./files/${newFilename}`, req.body.content, (err) => {
            if (err) {
                return res.status(500).send('Unable to update file');
            }
            res.redirect('/');
        });
    });
});

// 6 - Delete a file
app.get('/delete/:filename', (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    fs.unlink(`./files/${filename}`, (err) => {
        if (err) {
            return res.status(500).send('Unable to delete file🙃');
        }
        res.redirect('/');
    });
});

const PORT=3000;

app.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`)
})