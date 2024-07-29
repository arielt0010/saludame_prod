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
                req.uid = decode.uid;
                next();
            }

        })
    }
}
const verifyRole = (roles) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ Error: "You are not authenticated" });
        } else {
            jwt.verify(token, "jwt-secret-key", (err, decode) => {
                if (err) {
                    return res.json({ Error: "Token is not valid." });
                } else {
                    if (roles.includes(decode.rid_fk)) {
                        req.rid_fk = decode.rid_fk;
                        next();
                    } else {
                        return res.json({ Error: "You do not have the required role." });
                    }
                }
            });
        }
    };
};

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
                    const uid = data[0].uid;
                    const token = jwt.sign({name, rid_fk, uid}, "jwt-secret-key", {expiresIn: '1h'});
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

/* CONSULTAS USUARIOS */

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

/* CONSULTAS LIBRO DE OBSERVACIONES */

app.get('/libros', (req,res) => {
    const q = 'SELECT lid, colegio, gestion, mes FROM libro_observaciones';
    db.query(q, (err, result) => {
        if(err) 
            return res.json({Error: "Error inside server"});
        else if (result.length > 0){
            return res.json(result);
        } else {
            res.status(404).json({Error: 'No existen datos' });
        }
    })
})

app.get('/libros/filter' ,(req,res) => {
        const { colegio, gestion, mes } = req.query;
        const query = 'SELECT lid FROM libro_observaciones WHERE colegio = ? AND gestion = ? AND mes = ?';
        db.query(query, [colegio, gestion, mes], (err, results) => {
          if (err) {
            console.error('Error fetching libro:', err);
            res.status(500).json({ error: 'Error en el servidor' });
          } else if (results.length > 0) {
            res.json({ lid: results[0].lid });
          } else {
            res.status(404).json({ error: 'Libro no encontrado' });
          }
        });
})

//query para ver todos
app.get('/libros/:lid', verifyUser, checkRole(3), (req,res) => {
    const q = "select d.did as 'Id', u.Nombre as 'Medico', CONCAT(c.nombre, ' ', c.apellidos) as 'Nombre', c.curso, d.fechaAtendido, d.diagnostico, d.tratamiento, d.observaciones from datos_observaciones d join cliente c on d.cid_fk2 = c.cid join usuario u on d.uid_fk3 = u.uid join libro_observaciones l on d.lid_fk1 = l.lid where l.lid = ?;";
    const id = req.params.lid;

    db.query(q, [id], (err, result) => {
        if(err) {return res.json({Error: err});}
        else if (result.length > 0){return res.json(result);}
        else return (res.json({Error: "No existen datos"}))
    })
})

//query para ver solo 1 dato
app.get('/libroOne/:id', (req,res) => {
    const q = 'select * from datos_observaciones where did = ?';
    const id = req.params.lid;

    db.query(q, [id], (err, result) => {
        if(err) return res.json({Error: "Error inside server"});
        return res.json(result);
    })
})

app.put('/updateRegLibro/:id', (req, res) =>{
    const id = req.params.lid;
    const { fechaAtendido, diagnostico, tratamiento, observaciones} = req.body;
    const q = 'UPDATE datos_observaciones SET `fechaAtendido` = ?, `diagnostico` = ?, `tratamiento` = ?, `observaciones` = ? WHERE did = ?';
    const values = [fechaAtendido, diagnostico, tratamiento, observaciones, id];
    db.query(q, values, (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

app.delete('/deleteRegLibro/:id', (req, res) => {
    const q = "delete from datos_observaciones where did = ?"
    const id = req.params.id;
    db.query(q, [id], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

/* CONSULTA DE PAGOS */

//query para ver todos
app.get('/pagos',(req, res) => {
    const q = "select p.pid as 'Id', CONCAT(c.nombre, ' ', c.apellidos) as 'Nombre', c.colegio, c.curso, p.gestion, p.fechaPago, p.monto, p.formaPago, u.usuario, p.fechaAgregado, p.comprobantePago from pagos p join cliente c on p.cid_fk1 = c.cid join usuario u on p.uid_fk2 = u.uid;";
    db.query(q, (err, result) => {
        if(err) return res.json({Error: "Error inside server"});
        else if (result.length > 0) {
            return res.json(result);
        }else{
            res.status(404).json({Error: 'No existen pagos' });
        }
    })
})

//filtrar
app.get('/pagos/filter' ,(req,res) => {
    const { colegio, gestion } = req.query;
    const query = "select p.pid as 'Id', CONCAT(c.nombre, ' ', c.apellidos) as 'Nombre', c.colegio, c.curso, p.gestion, p.fechaPago, p.monto, p.formaPago, u.usuario, p.fechaAgregado, p.comprobantePago from pagos p join cliente c on p.cid_fk1 = c.cid join usuario u on p.uid_fk2 = u.uid where colegio = ? and gestion = ?;";
    db.query(query, [colegio, gestion, mes], (err, results) => {
      if (err) {
        console.error('Error fetching pago:', err);
        res.status(500).json({Error: 'Error en el servidor' });
      } else if (results.length > 0) {
        res.json({ lid: results[0].lid });
      } else {
        res.status(404).json({Error: 'Pago no encontrado' });
      }
    });
})

//eliminar
app.delete('/deletePayment/:id', (req, res) => {
    const q = "delete from pagos where pid = ?"
    const id = req.params.id;
    db.query(q, [id], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

//buscar al cliente para registrar pago
app.get('/searchCliente',(req, res) => {
    const {nombre, apellidos} = req.query;
    const q = "select cid, nombre, apellidos from cliente where nombre = ? and apellidos = ?;";
    db.query(q, [nombre, apellidos], (err, result) => {
        if(err) return res.json({Error: "Error inside server"});
        else if (result.length > 0) {
            return res.json(result);
        }else{
            res.status(404).json({Error: 'No existen pagos' });
        }
    })
})

//insertar pago
app.post('/createPayment', (req, res) => {
    const { gestion, fechaPago, formaPago, monto, cid_fk, uid_fk2} = req.body;

    const fechaAgregado = new Date(); // Fecha actual del sistema
    const query = `
      INSERT INTO pagos (gestion, fechaPago, formaPago, monto, fechaAgregado, cid_fk1, uid_fk2)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [gestion, fechaPago, formaPago, monto, fechaAgregado, cid_fk, uid_fk2], (err, result) => {
      if (err) {
        console.error('Error al insertar el pago:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
        return;
      }
      res.status(201).json({ message: 'Pago insertado correctamente', pagoId: result.insertId });
    });
  });


/* OTRAS CONSULTAS */

//logout
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

