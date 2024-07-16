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
    methods: ["POST", "GET", "PUT", "DELETE"],
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

app.post('/createUser', (req,res) => {
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

app.get('/users', verifyUser, checkRole(1), (req,res) => {
    const q = 'select u.uid as "ID", u.nombre, u.usuario, r.nombre_rol as "Rol" from usuario u join rol r on u.rid_fk = r.rid';
    db.query(q, (err, result) => {
        if(err) return res.json({Error: "Error inside server"});
        return res.json(result);
    })
})

app.get('/users/:id', verifyUser, checkRole(1), (req,res) => {
    const q = 'select * from usuario where uid = ?';
    const id = req.params.id;

    db.query(q, [id], (err, result) => {
        if(err) return res.json({Error: "Error inside server"});
        return res.json(result);
    })
})

app.put('/update/:id', (req, res) =>{
    const id = req.params.id;
    const { name, user, password, rid_fk } = req.body;

    if (!password) {
        // Si la contraseña está vacía, actualiza solo los otros campos
        const q = 'UPDATE usuario SET `nombre` = ?, `usuario` = ?, `rid_fk` = ? WHERE uid = ?';
        const values = [name, user, rid_fk, id];
        db.query(q, values, (err, result) => {
            if (err) return res.json({ Error: "Error inside server" });
            return res.json(result);
        });
    } else {
        // Si hay una contraseña, hashearla y actualizar todos los campos
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) return res.json({ Error: "Error from hashing password" });
            const q2 = 'UPDATE usuario SET `nombre` = ?, `usuario` = ?, `contraseña` = ?, `rid_fk` = ? WHERE uid = ?';
            const values = [name, user, hash, rid_fk, id];
            db.query(q2, values, (err, result) => {
                if (err) return res.json({ Error: "Inserting data error in server" });
                return res.json(result);
            });
        });
    }
})

app.delete('/deleteUser/:id', (req, res) => {
    const q = "delete from usuario where uid = ?"
    const id = req.params.id;
    db.query(q, [id], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
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

