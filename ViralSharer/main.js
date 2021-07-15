var express = require("express"),
    bp = require("body-parser"),
    fUpd = require("express-fileupload"),
    //nodemailer = require("nodemailer"),
    fs = require("fs"),
    path = require("path");

var app = express();

app.set("view engine", "ejs");
app.use(fUpd());
app.use(bp.urlencoded({extended : true}));
app.use(express.static('./Uploads'));

var date_ob = new Date();

var mails = [];

if(!fs.existsSync("Uploads\\")){    //checking if user folder does exist
    fs.mkdir("Uploads\\", (err) => {
        if(err){
            console.log("Uploads Directory cannot be created!\n" + err);
            return res.redirect('/err');
        }
    });
}

fs.readdir('./Uploads', {withFileTypes: true}, (err, dirs) => { //updating mail list, if any
    if(err){
        console.log("Error on finding directories!");
    }else{
        dirs.forEach(elems => {
            mails.push((elems.name).split(".")[0] + "@" + (elems.name).split(".")[1]) // johndoe@gmail, busted way instead of using replace, but whatever
        });
    }
});

//Set Mail Transporter

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('homepg');
});

app.post('/home', (req, res) => {
    var mail = req.body.mail;

    console.log("[+] @Uploaded file name: " + req.files.upd.name + " By: " + mail + " [+]");
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send("No Files Uploaded");
    }
    
    f = req.files.upd;
    mSplit = mail.split("@");
    dirName = mSplit[0] + "." + mSplit[1].split(".")[0] + "\\";

    if(!fs.existsSync("Uploads\\" + dirName)){    //checking if user folder does exist
        fs.mkdir("Uploads\\" + dirName, (err) => {
            if(err){
                console.log("User Directory cannot be created!\n" + err);
                return res.redirect('/err');
            }
        });
    }

    var time = "[" + date_ob.getHours().toString() + "V" + date_ob.getMinutes().toString() + "V" + date_ob.getSeconds().toString() + "]";
    
    path = "Uploads\\" + dirName + time + f.name;

    f.mv(path, (err) => {
        if(err){
            return res.status(500).send(err);
        }
    });

    //SendMail using transporter
    fmail = mail.split("@")[0] + "@" + mail.split("@")[1].split(".")[0];
    mails.push(fmail);

    res.redirect('/success');
});

app.get('/success', (req, res) => {
    res.render('successpg');
});

app.get('/access', (req, res) => {
    res.render("access", {mail: null});
});

app.post('/access/show', (req, res) => {
    var req_mail = req.body.mail,
        flg = 0;

    req_mail = req_mail.split("@")[0] + "@" + req_mail.split("@")[1].split(".")[0];

    mails.forEach((element, index) => {
        if(element == req_mail){
            flg = 1;

            var prop_mail_name_dir = req_mail.split("@")[0] + "." + req_mail.split("@")[1].split(".")[0] + "\\";

            if(fs.existsSync("Uploads\\" + prop_mail_name_dir)){
                fs.readdir("Uploads\\" + prop_mail_name_dir, {withFileTypes: true}, (err, files) => {
                    if(err){
                        console.log("Error when trying to read directory\n" + err);
                        res.redirect('/err');
                    }else{
                        res.render("access", {mail: req_mail, files: files, index: index});
                    }
                });
            }else{
                console.log("User Folder Not Found!");
                res.redirect('/err');
            }
        }
    });

    if(flg == 0){
        res.send("Given Mail has no profile on our servers.");
    }
});

app.get('/download/:id/:it_ind', (req, res) => {
    var id = req.params.id,
        it_ind = req.params.it_ind;

    if(mails[id] == null){
        res.redirect('/zen');
    }

    var mail = mails[id];

    var base_dir = "Uploads\\" + mail.replace("@", ".") + "\\";

    fs.readdir(base_dir, {withFileTypes: true}, (err, files) => {
        if(err){
            console.log("Error when trying to read directory in download path\n" + err);
            res.redirect('/err');
        }else{
            var flag = 0;
            files.forEach((elems, ind) => {
                if(ind == it_ind){
                    flag = 1;
                    res.sendFile(__dirname + "\\" + base_dir + elems.name);
                }
            });

            if(flag == 0){
                res.redirect('/zen');
            }
        }
    });
});

app.get('/err', (req, res) => {
    res.send("Something Went Wrong!");
});

app.get('/zen', (req, res) => {
    res.send("Nothing to see here :|");
});

app.get('*', (req, res) => {
    res.redirect('/zen');
});

app.listen(8080, () => {
    console.log(`%c
    ██╗░░░██╗██╗██████╗░░█████╗░██╗░░░░░░██████╗██╗░░██╗░█████╗░██████╗░███████╗██████╗░
    ██║░░░██║██║██╔══██╗██╔══██╗██║░░░░░██╔════╝██║░░██║██╔══██╗██╔══██╗██╔════╝██╔══██╗
    ╚██╗░██╔╝██║██████╔╝███████║██║░░░░░╚█████╗░███████║███████║██████╔╝█████╗░░██████╔╝
    ░╚████╔╝░██║██╔══██╗██╔══██║██║░░░░░░╚═══██╗██╔══██║██╔══██║██╔══██╗██╔══╝░░██╔══██╗
    ░░╚██╔╝░░██║██║░░██║██║░░██║███████╗██████╔╝██║░░██║██║░░██║██║░░██║███████╗██║░░██║
    ░░░╚═╝░░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝\n[+] Firing Up Server @ port 8080. DEPLOYED [+]`, "font-family:monospace");
});

/*
Author: Alpha19
Version: 0.1.0
Devmgmt: ViralShellter
*/