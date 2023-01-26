const express = require('express')
const app= express()
const mysql=require('mysql2')
const cors =require('cors')

const {encrypt, decrypt} = require('./EncryptionHandler');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user:'root',
    host: 'localhost',
    password: 'Atul@786',
    database: 'passwordmanager',
});

app.post("/addpassword", (req,res)=>{
    const {password,title}=req.body;
    const hashedPassword= encrypt(password);
    

    db.query("INSERT INTO passwords (password,title,iv) VALUES (?,?,?)", 
    [hashedPassword.password,title,hashedPassword.iv],
    (err, result) => {
        if(err){
            console.log(err);
        } else{
            res.send("SUCCESS");
        }
    }
    )
})

app.get('/showpasswords', (req,res) => {
    db.query("SELECT * FROM passwords;", (err,result) => {
        if(err){
            console.log(err);
        } else{
            res.send(result);
        }
    })
})

app.post('/decryptpassword', (req,res) => {
    res.send(decrypt(req.body))
})
const PORT = 3001
app.listen(PORT , ()=>{
    console.log(`Server is running ${PORT}`);
});