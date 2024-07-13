import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const salt = 10; 

const app = express();
app.use(express());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT"],
    credentials: true
}));
app.use(cookieParser());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "saludame_prod"
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "You are not authenticated"});
    }else{
        jwt.verify(token, "jwt-secret-key", (err, decode) => {
            if(err){
                return res.json({Error: "Token is not valid."});
            }else{
                req.name = decode.name;
                req.rid_fk = decode.rid_fk;
                next();
            }

        })
    }
}
const verifyRole = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "You are not authenticated"});
    }else{
        jwt.verify(token, "jwt-secret-key", (err, decode) => {
            if(err){
                return res.json({Error: "Token is not valid."});
            }else{
                req.rid_fk = decode.rid_fk;
                next();
            }

        })
    }
}

const checkRole = (role) => (req, res, next) => {
    if (req.rid_fk !== role) {
      return res.status(403).send('Access denied');
    }
    next();
  };

app.post('/register', (req,res) => {
    const q = "insert into usuario(`nombre`,`usuario`,`contraseña`,`rid_fk`) values (?)";
    bcrypt.hash(req.body.password, salt, (err, hash) => {
        if(err) return res.json({Error: "Error from hashing passsword"});
        const values = [req.body.name, req.body.user, hash, req.body.rid_fk];
        db.query(q, [values], (err, result) => {
            if(err) return res.json({Error: "Inserting data error in server"});
            return res.json({Status: "Success"});
        })
    }); 
})

app.post('/login', (req, res) => {
    const q  = "select * from usuario where usuario = ?";
    const s = req.body.user;
    db.query(q, s, (err, data) => {
        if(err) return res.json({Error: "Login error in server"});
        if(data.length > 0) {
            bcrypt.compare(req.body.password, data[0].contraseña, (err, response) => {
                if(err) return res.json({Error: "Password compare error"});
                if(response){
                    const name = data[0].nombre;
                    const rid_fk = data[0].rid_fk;
                    const token = jwt.sign({name, rid_fk}, "jwt-secret-key", {expiresIn: '1h'});
                    res.cookie('token', token);
                    return res.json({Status: "Success"});
                }else {
                    return res.json({Error: "Password not matched"})
                }
            })
        }else{
            return res.json({Error: "No username found"});
        }
    }) 
})

app.get('/start', verifyUser, (req, res) => {
    return res.json({Status: "Success", name:req.name});
})

app.get('/logout', (req,res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.get('/admin-route', verifyUser, verifyRole, checkRole(1), (req, res) => {
    res.json({Error: "Access denied"});
  });

app.listen(8081, () => {
    console.log("Backend connected.");
})

