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
        return res.json({Error: "No estás autenticado"});
    }else{
        jwt.verify(token, "jwt-secret-key", (err, decode) => {
            if(err){
                return res.json({Error: "Token no válido."});
            }else{
                req.name = decode.name;
                req.ridFK = decode.ridFK;
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
            return res.json({ Error: "No estás autenticado" });
        } else {
            jwt.verify(token, "jwt-secret-key", (err, decode) => {
                if (err) {
                    return res.json({ Error: "Token no válido." });
                } else {
                    if (roles.includes(decode.ridFK)) {
                        req.ridFK = decode.ridFK;
                        next();
                    } else {
                        return res.json({ Error: "No tienes el rol necesario." });
                    }
                }
            });
        }
    };
};

//verificar rol de usuario
const checkRole = (role) => (req, res, next) => {
    if (req.ridFK !== role) {
      return res.status(403).json('Access denied');
    }
    next();
  };

app.post('/login', (req, res) => {
    const q  = "select * from usuario where usuario = ? and estado = 1";
    const s = req.body.user;
    db.query(q, s, (err, data) => {
        if(err) return res.json({Error: "Error en el servidor"});
        if(data.length > 0) {
            bcrypt.compare(req.body.password, data[0].contraseña, (err, response) => {
                if(err) return res.json({Error: "Error en el servidor"});
                if(response){
                    const name = data[0].nombre;
                    const ridFK = data[0].ridFK;
                    const uid = data[0].uid;
                    const token = jwt.sign({name, ridFK, uid}, "jwt-secret-key", {expiresIn: '1h'});
                    res.cookie('token', token);
                    return res.json({Status: "Success"});
                }else {
                    return res.json({Error: "Error: usuario y/o contraseña incorrecto"})
                }
            })
        }else{
            return res.json({Error: "Error: usuario y/o contraseña incorrecto"});
        }
    }) 
})

app.get('/start', verifyUser, (req, res) => {
    return res.json({Status: "Success", name:req.name});
})

/* CONSULTAS USUARIOS */

app.get('/users', verifyUser, checkRole(1), (req,res) => {
    const q = 'select u.uid as "ID", u.nombre, u.apellidoPaterno, u.apellidoMaterno, u.usuario, r.nombreRol as "Rol", case when u.estado = 1 then "Activo" else "Inactivo" end as "Estado" from usuario u join rol r on u.ridFK = r.rid';
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

app.post('/createUser', verifyUser, checkRole(1), (req, res) => {
    const q = "INSERT INTO usuario(`nombre`, `apellidoPaterno`, `apellidoMaterno`, `usuario`, `contraseña`, `ridFK`, `estado`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.json({ Error: "Error from hashing password" });
        }
        const values = [req.body.name, req.body.apellidoPaterno, req.body.apellidoMaterno, req.body.user, hash, req.body.ridFK, req.body.estado];
        db.query(q, values, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.json({ Error: "Inserting data error in server" });
            }
            return res.json({ Status: "Success" });
        });
    });
})

app.put('/update/:id', verifyUser,checkRole(1), (req, res) =>{
    const id = req.params.id;
    const { name, user, password, ridFK, estado, apellidoPaterno, apellidoMaterno } = req.body;

    if (!password) {
        // Si la contraseña está vacía, actualiza solo los otros campos
        const q = 'UPDATE usuario SET `nombre` = ?, `usuario` = ?, `ridFK` = ?, `estado` = ?, `apellidoPaterno` = ?, `apellidoMaterno` = ? WHERE uid = ?';
        const values = [name, user, ridFK, estado, apellidoPaterno, apellidoMaterno, id];
        db.query(q, values, (err, result) => {
            if (err) return res.json({ Error: "Error inside server" });
            return res.json(result);
        });
    } else {
        // Si hay una contraseña, hashearla y actualizar todos los campos
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) return res.json({ Error: "Error from hashing password" });
            const q2 = 'UPDATE usuario SET `nombre` = ?, `usuario` = ?, `contraseña` = ?, `ridFK` = ? , `estado` = ?, `apellidoPaterno` = ?, `apellidoMaterno` = ? WHERE uid = ?';
            const values = [name, user, hash, ridFK, estado, apellidoPaterno, apellidoMaterno, id];
            db.query(q2, values, (err, result) => {
                if (err) return res.json({ Error: "Inserting data error in server" });
                return res.json(result);
            });
        });
    }
})
app.delete('/deleteUser/:id', verifyUser, checkRole(1), (req, res) => {
    const q = "delete from usuario where uid = ?"
    const id = req.params.id;
    db.query(q, [id], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

/* CONSULTAS LIBRO DE OBSERVACIONES */

app.get('/libros', (req,res) => {
    const q = 'select l.lid, col.nombre, l.gestion, l.mes from libro_observacion l join colegio col on l.colegioFK2 = col.cid;';
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
        const query = 'select l.lid from libro_observacion l join colegio col on l.colegioFK2 = col.cid where col.nombre = ? and l.gestion = ? and l.mes = ?';
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
app.get('/libros/:lid', verifyUser, (req,res) => {
    const q = "select d.did as Id, c.nombre as Nombre, CONCAT(c.apellidoPaterno, ' ', c.apellidoMaterno) as Apellidos, c.curso, CONCAT(u.nombre,' ',u.apellidoPaterno, ' ', u.apellidoMaterno) as Medico, d.fechaAtendido as 'Fecha atendido', d.diagnostico as 'Diagnóstico', d.tratamiento as 'Tratamiento', d.observaciones as 'Observaciones' from datos_observacion d join cliente c on d.cidFK2 = c.cid join usuario u on d.uidFK3 = u.uid join libro_observacion l on d.lidFK1 = l.lid where lid=?";
    const id = req.params.lid;

    db.query(q, [id], (err, result) => {
        if(err) {return res.json({Error: err});}
        else if (result.length > 0){return res.json(result);}
        else return (res.json({Error: "No existen datos"}))
    })
})

//query para ver solo 1 dato
app.get('/libroOne/:id', (req,res) => {
    const q = 'select * from datos_observacion where did = ?';
    const lid = req.params.lid;
    console.log(lid)

    db.query(q, [lid], (err, result) => {
        if(err) return res.json({Error: "Error inside server"});
        return res.json(result);
    })
})

//crear datos libro de observaciones
app.post('/createRegistro/:lid', (req, res) => {
    const q = "INSERT INTO datos_observacion (`fechaAtendido`, `diagnostico`, `tratamiento`, `observaciones`, `cidFK2`, `uidFK3`, `lidFK1`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [req.body.fechaAtendido, req.body.diagnostico, req.body.tratamiento, req.body.observaciones, req.body.cidFK2, req.body.uidFK3, req.body.lidFK1];
    db.query(q, values, (err, result) => {
        if (err) {
            console.error('Error insertando datos:', err);
            return res.json({ Error: "Inserting data error in server" });
        }
        return res.json({ Status: "Success" });
    });
})
//actualizar datos libro de observaciones
app.put('/updateRegLibro/:id', (req, res) =>{
    const id = req.params.lid;
    const { fechaAtendido, diagnostico, tratamiento, observaciones} = req.body;
    const q = 'UPDATE datos_observacion SET `fechaAtendido` = ?, `diagnostico` = ?, `tratamiento` = ?, `observaciones` = ? WHERE did = ?';
    const values = [fechaAtendido, diagnostico, tratamiento, observaciones, id];
    db.query(q, values, (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

//eliminar datos libro de observaciones
app.delete('/deleteRegLibro/:id', (req, res) => {
    const q = "delete from datos_observacion where did = ?"
    const id = req.params.id;
    db.query(q, [id], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

/* CONSULTA DE PAGOS */

//query para ver todos
app.get('/pagos',(req, res) => {
    const q = "select p.pid as 'Id', CONCAT(c.nombre, ' ', c.apellidoPaterno, ' ', c.apellidoMaterno) as 'Nombre', col.nombre as Colegio, c.curso as Curso, p.gestion as Gestion,  p.fechaPago , p.monto, f.nombrePago as 'formaPago', u.usuario, p.fechaAgregado from pago p join cliente c on p.cidFK1 = c.cid join usuario u on p.uidFK2= u.uid join colegio col on c.colegio = col.cid join forma_pago f on p.formaPago = f.fid"; 
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
    const query = "select p.pid as 'Id', CONCAT(c.nombre, ' ', c.apellidoPaterno, ' ', c.apellidoMaterno) as 'Nombre', col.nombre as Colegio, c.curso as Curso, p.gestion as Gestion,  p.fechaPago , p.monto, f.nombrePago as 'formaPago', u.usuario, p.fechaAgregado from pago p join cliente c on p.cidFK1 = c.cid join usuario u on p.uidFK2= u.uid join colegio col on c.colegio = col.cid join forma_pago f on p.formaPago = f.fid where col.nombre = ? and p.gestion = ?";
    db.query(query, [colegio, gestion], (err, results) => {
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
    const q = "delete from pago where pid = ?"
    const id = req.params.id;
    db.query(q, [id], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

//buscar al cliente para registrar pago y registrar datos libro de observaciones
app.get('/searchCliente',(req, res) => {
    const {nombre, apellidoPaterno, apellidoMaterno} = req.query;
    const q = "select cid, nombre, apellidoPaterno, apellidoMaterno from cliente where nombre = ? and apellidoPaterno = ? and apellidoMaterno = ?;";
    db.query(q, [nombre, apellidoPaterno, apellidoMaterno], (err, result) => {
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
      INSERT INTO pago (gestion, fechaPago, formaPago, monto, fechaAgregado, cidFK1, uidFK2)
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

