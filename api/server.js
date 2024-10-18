import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import multer from 'multer';

const salt = 10; 
const MAX_INTENTOS = 3;
const TIEMPO_BLOQUEO = 10 * 60 * 1000; // 10 minutos

const app = express();
app.use(express());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

const upload = multer({ storage: storage });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "saludame_prod"
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(403).json({Error: "No estás autenticado"});
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
    const q = "SELECT * FROM usuario WHERE usuario = ? AND estado = 1";
    const s = req.body.user;

    db.query(q, s, (err, data) => {
        if (err) return res.json({ Error: "Error en el servidor" });
        if (data.length > 0) {
            const ahora = new Date();
            const usuario = data[0];

            // Verificar si el usuario está bloqueado
            if (usuario.tiempoBloqueo && ahora < new Date(usuario.tiempoBloqueo)) {
                return res.json({ Error: "Cuenta bloqueada. Inténtelo más tarde." });
            }

            bcrypt.compare(req.body.password, usuario.contraseña, (err, response) => {
                if (err) return res.json({ Error: "Error en el servidor" });

                if (response) {
                    // Verificar si necesita cambiar la contraseña
                    if (usuario.necesitaContraseña) {
                        const token = jwt.sign({ uid: usuario.uid }, "jwt-secret-key", { expiresIn: '1h' });
                        res.cookie('token', token);  // Guarda el token en una cookie
                        return res.json({ Status: "PasswordChangeRequired" });  // Enviar respuesta indicando que debe cambiar la contraseña
                    }

                    // Resetear intentos fallidos si el inicio de sesión es exitoso
                    const resetIntentos = "UPDATE usuario SET intentosFallidos = 0, tiempoBloqueo = NULL WHERE uid = ?";
                    db.query(resetIntentos, [usuario.uid], (err) => {
                        if (err) return res.json({ Error: "Error en el servidor" });
                    });

                    const name = usuario.nombre;
                    const ridFK = usuario.ridFK;
                    const uid = usuario.uid;
                    const token = jwt.sign({ name, ridFK, uid }, "jwt-secret-key", { expiresIn: '1h' });

                    res.cookie('token', token);
                    return res.json({ Status: "Success" });

                } else {
                    // Incrementar intentos fallidos si la contraseña es incorrecta
                    let intentosFallidos = usuario.intentosFallidos + 1;
                    let tiempoBloqueo = null;

                    if (intentosFallidos >= MAX_INTENTOS) {
                        intentosFallidos = 0;
                        tiempoBloqueo = new Date(ahora.getTime() + TIEMPO_BLOQUEO);
                    }

                    const updateIntentos = "UPDATE usuario SET intentosFallidos = ?, tiempoBloqueo = ? WHERE uid = ?";
                    db.query(updateIntentos, [intentosFallidos, tiempoBloqueo, usuario.uid], (err) => {
                        if (err) return res.json({ Error: "Error en el servidor" });
                    });

                    return res.json({ Error: "Error: usuario y/o contraseña incorrecto" });
                }
            });
        } else {
            return res.json({ Error: "Error: usuario y/o contraseña incorrecto" });
        }
    });
});

//que el usuario cambie su contraseña
app.post('/change-password', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ Error: "No autenticado" });

    // Verificar el token JWT
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) return res.json({ Error: "Token inválido" });

        const { newPassword } = req.body;

        if (!newPassword) {
            return res.json({ Error: "La nueva contraseña es requerida" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, salt);  // Hashear la nueva contraseña

        const updatePassword = "UPDATE usuario SET contraseña = ?, necesitaContraseña = 0 WHERE uid = ?";
        db.query(updatePassword, [hashedPassword, decoded.uid], (err) => {
            if (err) return res.json({ Error: "Error al actualizar la contraseña" });

            // Eliminar el token para evitar que se reutilice
            res.clearCookie('token');
            return res.json({ Status: "PasswordChanged" });
        });
    });
});

//que el usuario solicite restablecer su contraseña
app.put('/reset-password/', (req, res) => {
    const { user } = req.body;
    const q = "UPDATE usuario SET solicitudRestablecimiento = 1 WHERE usuario = ? and estado = 1";
    
    db.query(q, [user], (err, data) => {
      if (err) return res.json({ Error: "Error en el servidor" });
      return res.json({ Status: "Solicitud enviada" });
    });
  });

//pagina inicial
app.get('/start', verifyUser, (req, res) => {
    return res.json({Status: "Success", name:req.name});
})

/* CONSULTAS USUARIOS */

app.get('/users', verifyUser, checkRole(1), (req,res) => {
    const q = 'select u.uid as "ID", u.nombre, u.apellidoPaterno, u.apellidoMaterno,'+
    ' u.usuario, r.nombreRol as "Rol", ' +
    'case when u.estado = 1 then "Activo" else "Inactivo" end as "Estado" '+
    'from usuario u join rol r on u.ridFK = r.rid';
    db.query(q, (err, result) => {
        if(err) return res.json({Error: "Error inside server"});
        return res.json(result);
    })
})

app.delete('/deleteUser/:id', verifyUser, checkRole(1), (req, res) => {
    const q = "delete from usuario where uid = ?"
    const id = req.params.id;
    db.query(q, [id], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
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
            const q2 = 'UPDATE usuario SET `nombre` = ?, `usuario` = ?, `contraseña` = ?, `ridFK` = ? , `estado` = ?, `apellidoPaterno` = ?, `apellidoMaterno` = ? , `solicitudRestablecimiento` = 0, `necesitaContraseña` = 1 WHERE uid = ?';
            const values = [name, user, hash, ridFK, estado, apellidoPaterno, apellidoMaterno, id];
            db.query(q2, values, (err, result) => {
                if (err) return res.json({ Error: "Inserting data error in server" });
                return res.json(result);
            });
        });
    }
})


/* CONSULTAS LIBRO DE OBSERVACIONES */

//obtener nombre colegio para filtrar libros si ridFK = 3
app.get('/getColegioInfo/:uid', (req, res) => {
    const q = "select col.nombre from colegio col where col.usuarioAsignado = ?";
    const uid = req.params.uid;
    db.query(q, [uid], (err, result) => {
        if (err) return res.status(500).json({ Error: "Error inside server" });
        else if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            res.status(404).json({ Error: 'No existen datos' });
        }
    });
});

//obtener colegio, gestion y mes para filtrar libros
app.get('/libros', verifyUser,(req,res) => {
    const q = 'select l.lid, col.nombre, l.gestion, l.mes from libro_consulta l join colegio col on l.colegioFK2 = col.cid;';
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

//libros filtrados por colegio, gestion y mes
app.get('/libros/filter' ,(req,res) => {
    const { colegio, gestion, mes } = req.query;
    const query = 'select l.lid from libro_consulta l join colegio col on l.colegioFK2 = col.cid where col.nombre = ? and l.gestion = ? and l.mes = ?';
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

app.get('/libros/:lid', (req,res) => {
    const q = "select d.did as Id, c.nombre as Nombre, CONCAT(c.apellidoPaterno, ' ', c.apellidoMaterno) as Apellidos, c.curso as 'Curso', CONCAT(u.nombre,' ',u.apellidoPaterno, ' ', u.apellidoMaterno) as 'Médico', d.fechaAtendido, d.diagnostico as 'Diagnóstico', d.tratamiento as 'Tratamiento', d.observaciones as 'Observaciones' from consulta_medica d join cliente c on d.cidFK2 = c.cid join usuario u on d.uidFK3 = u.uid join libro_consulta l on d.lidFK1 = l.lid where lid=? order by d.fechaAtendido desc";
    const id = req.params.lid;

    db.query(q, [id], (err, result) => {
        if(err) {return res.json({Error: err});}
        else if (result.length > 0){return res.json(result);}
        else return (res.json({Error: "No existen datos"}))
    })
})

//filtrar por asegurado
app.get('/anotherLibro/filter', verifyUser, (req, res) => {
    const { lid, nombre, apellidoPaterno, apellidoMaterno, cedula, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Condiciones de búsqueda
    const conditions = [];
    const params = [lid];

    // Si se busca por nombre completo
    if (nombre || apellidoPaterno || apellidoMaterno) {
        if (nombre) {
            conditions.push(`c.nombre = ?`);
            params.push(nombre);
        }
        if (apellidoPaterno) {
            conditions.push(`c.apellidoPaterno = ?`);
            params.push(apellidoPaterno);
        }
        if (apellidoMaterno) {
            conditions.push(`c.apellidoMaterno = ?`);
            params.push(apellidoMaterno);
        }
    }

    // Si se busca por cédula
    if (cedula) {
        conditions.push(`c.carnetIdentidad = ?`);
        params.push(cedula);
    }

    const whereClause = conditions.length > 0 ? `AND (${conditions.join(' OR ')})` : '';

    const query = `SELECT c.nombre as Nombre, CONCAT(c.apellidoPaterno, ' ', c.apellidoMaterno) as Apellidos, c.curso as 'Curso', 
                   CONCAT(u.nombre,' ',u.apellidoPaterno, ' ', u.apellidoMaterno) as Medico, d.fechaAtendido, 
                   d.diagnostico as 'Diagnóstico', d.tratamiento as 'Tratamiento', d.observaciones as 'Observaciones'
                   FROM consulta_medica d 
                   JOIN cliente c ON d.cidFK2 = c.cid 
                   JOIN usuario u ON d.uidFK3 = u.uid 
                   JOIN libro_consulta l ON d.lidFK1 = l.lid 
                   WHERE lid=? ${whereClause} 
                   ORDER BY d.fechaAtendido DESC LIMIT ? OFFSET ?`;
    
    const countQuery = `SELECT COUNT(*) as total 
                        FROM consulta_medica d 
                        JOIN cliente c ON d.cidFK2 = c.cid 
                        JOIN usuario u ON d.uidFK3 = u.uid 
                        JOIN libro_consulta l ON d.lidFK1 = l.lid 
                        WHERE lid=? ${whereClause}`;

    // Contar resultados
    db.query(countQuery, params, (err, countResult) => {
        if (err) {
            console.error('Error counting results:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const total = countResult[0].total;
        db.query(query, [...params, parseInt(limit), parseInt(offset)], (err, result) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return res.status(500).json({ error: "Error en el servidor" });
            }
            if (result.length > 0) {
                return res.json({
                    data: result,
                    total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: parseInt(page)
                });
            } else {
                return res.json({ error: "No existen datos" });
            }
        });
    });
});


app.get('/getColegioIdLibro/:lid', (req, res) => {
  const q = "select * from libro_consulta where lid = ?";
  const lid = req.params.lid;
  db.query(q, [lid], (err, result) => {
      if(err) return res.status(500).json({Error: "Error inside server"});
      else if (result.length > 0){return res.status(200).json(result);}
      else return (res.status(404).json({Error: "No existen datos" }))
  });
});

//buscar cliente para crear datos libro de observaciones
app.get('/searchClienteLibro', (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, cedula, colegioId} = req.query;
    let q = "SELECT cid, nombre, apellidoPaterno, apellidoMaterno FROM cliente WHERE ";
    const params = [];

    if (cedula) {
        q += "carnetIdentidad = ?";
        params.push(cedula);
    } else {
        if (nombre) {
            q += "nombre = ?";
            params.push(nombre);
        }
        if (apellidoPaterno) {
            q += " AND apellidoPaterno = ?";
            params.push(apellidoPaterno);
        }
        if (apellidoMaterno) {
            q += " AND apellidoMaterno = ?";
            params.push(apellidoMaterno);
        }
    }
    q += " and colegio = ?";
    params.push(colegioId);
    db.query(q, params, (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        else if (result.length > 0) {
            return res.json(result);
        } else {
            res.status(404).json({ Error: 'No existen asegurados' });
        }
    });
});

//crear datos libro de observaciones
app.post('/createRegistro/:lid', verifyUser, (req, res) => {
    const q = "INSERT INTO consulta_medica (`fechaAtendido`, `diagnostico`, `tratamiento`, `observaciones`, `"
    + "cidFK2`, `uidFK3`, `lidFK1`)VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [req.body.fechaAtendido, req.body.diagnostico, req.body.tratamiento, req.body.observaciones, 
        req.body.cidFK2, req.body.uidFK3, req.body.lidFK1];
    db.query(q, values, (err, result) => {
        if (err) {
            console.error('Error insertando datos:', err);
            return res.json({ Error: "Inserting data error in server" });
        }
        return res.json({ Status: "Success" });
    });
})


/* CONSULTA DE PAGOS */

//query para ver todos
app.get('/pagos', verifyUser, (req, res) => {
    const limit = parseInt(req.query.limit) || 15;  // Tamaño de página
    const page = parseInt(req.query.page) || 1;  // Página actual
    const offset = (page - 1) * limit;  // Desplazamiento

    const q = `SELECT  
                      p.pid as Id,
                      CONCAT(c.nombre, ' ', c.apellidoPaterno, ' ', c.apellidoMaterno) AS 'Nombre',
                      col.nombre AS Colegio, 
                      c.curso AS Curso, 
                      p.gestion AS Gestion,  
                      p.fechaPago, 
                      p.monto, 
                      f.nombrePago AS 'formaPago', 
                      u.usuario, 
                      p.fechaAgregado, 
                      CASE 
                          WHEN p.estado = 1 THEN 'Aprobado' 
                          ELSE 'Por aprobar' 
                      END AS 'Estado' 
               FROM pago p
               JOIN cliente c ON p.cidFK1 = c.cid 
               JOIN usuario u ON p.uidFK2 = u.uid 
               JOIN colegio col ON c.colegio = col.cid 
               JOIN forma_pago f ON p.formaPago = f.fid 
               ORDER BY fechaAgregado DESC 
               LIMIT ? OFFSET ?`;

    db.query(q, [limit, offset], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        else if (result.length > 0) {
            // Obtener el número total de registros para calcular el total de páginas
            const countQuery = `SELECT COUNT(*) AS total FROM pago`;
            db.query(countQuery, (err, countResult) => {
                if (err) return res.json({ Error: "Error fetching total count" });

                const totalItems = countResult[0].total;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).json({
                    items: result,       // Datos de la página actual
                    totalPages: totalPages,  // Total de páginas
                    currentPage: page    // Página actual
                });
            });
        } else {
            res.status(404).json({ Error: 'No existen pagos' });
        }
    });
});

app.get('/pagosFiltrados', verifyUser, (req, res) => {
    const limit = parseInt(req.query.limit) || 15;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    
    const tipoFiltro = req.query.tipo || '';
    const valorFiltro = req.query.valor || '';

    let q = `
        SELECT  
            p.pid as Id,
            CONCAT(c.nombre, ' ', c.apellidoPaterno, ' ', c.apellidoMaterno) AS 'Nombre',
            col.nombre AS Colegio, 
            c.curso AS Curso, 
            p.gestion AS Gestion,  
            p.fechaPago, 
            p.monto, 
            f.nombrePago AS 'formaPago', 
            u.usuario, 
            p.fechaAgregado, 
            CASE 
                WHEN p.estado = 1 THEN 'Aprobado' 
                ELSE 'Por aprobar' 
            END AS 'Estado' 
        FROM pago p
        JOIN cliente c ON p.cidFK1 = c.cid 
        JOIN usuario u ON p.uidFK2 = u.uid 
        JOIN colegio col ON c.colegio = col.cid 
        JOIN forma_pago f ON p.formaPago = f.fid `;

    if (tipoFiltro === 'nombre') {
        q += `WHERE CONCAT(c.nombre, ' ', c.apellidoPaterno, ' ', c.apellidoMaterno) LIKE ? `;
    } else if (tipoFiltro === 'ci') {
        q += `WHERE c.carnetIdentidad LIKE ? `;
    }

    q += `ORDER BY fechaAgregado DESC LIMIT ? OFFSET ?`;

    const valor = `%${valorFiltro}%`;

    db.query(q, [valor, limit, offset], (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        else if (result.length > 0) {
            const countQuery = `SELECT COUNT(*) AS total FROM pago p JOIN cliente c ON p.cidFK1 = c.cid`;
            let countCondition = '';

            if (tipoFiltro === 'nombre') {
                countCondition = `WHERE CONCAT(c.nombre, ' ', c.apellidoPaterno, ' ', c.apellidoMaterno) LIKE ?`;
            } else if (tipoFiltro === 'ci') {
                countCondition = `WHERE c.carnetIdentidad LIKE ?`;
            }

            db.query(countQuery + ' ' + countCondition, [valor], (err, countResult) => {
                if (err) return res.json({ Error: "Error fetching total count" });

                const totalItems = countResult[0].total;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).json({
                    items: result,
                    totalPages: totalPages,
                    currentPage: page
                });
            });
        } else {
            res.status(404).json({ Error: 'No existen pagos' });
        }
    });
});


//buscar al cliente para registrar pago 
app.get('/searchCliente', (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, cedula } = req.query;
    let q = "SELECT cid, nombre, apellidoPaterno, apellidoMaterno FROM cliente WHERE ";
    const params = [];

    if (cedula) {
        q += "carnetIdentidad = ?";
        params.push(cedula);
    } else {
        if (nombre) {
            q += "nombre = ?";
            params.push(nombre);
        }
        if (apellidoPaterno) {
            q += " AND apellidoPaterno = ?";
            params.push(apellidoPaterno);
        }
        if (apellidoMaterno) {
            q += " AND apellidoMaterno = ?";
            params.push(apellidoMaterno);
        }
    }

    db.query(q, params, (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        else if (result.length > 0) {
            return res.json(result);
        } else {
            res.status(404).json({ Error: 'No existen pagos' });
        }
    });
});


//insertar pago
app.post('/createPayment', verifyUser, (req, res) => {
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
 
  //aprobar pago
  app.put('/aprobarPago/:id', verifyUser, (req, res) =>{
    const id = req.params.id;
    const q = 'UPDATE pago SET `estado`= 1 WHERE pid = ?';
    const values = [id];
    db.query(q, values, (err, result) => {
        if (err) return res.json({ Error: "Error inside server" });
        return res.json(result);
    });
})

  /* CONSULTAS PAGOS SEGURO */

//verificar el estado de los pagos de un cliente
app.get('/check-payment-status/:clientId', (req, res) => {
    const clientId = req.params.clientId;
    const currentYear = new Date().getFullYear();

    const checkPaymentQuery = "SELECT p.gestion FROM pago p join cliente c on p.cidFK1 = c.cid WHERE c.cid = ? AND p.gestion = ?";
    
    db.query(checkPaymentQuery, [clientId, currentYear], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error en el servidor" });
        }
        if (results.length > 0) {
            return res.status(204).json({ message: "El cliente no tiene deudas pendientes" });
        } else { 
            return res.status(200).json({ message: "El cliente tiene deudas pendientes" });
        }
    });
});

//select colegio para mostrar imagen de comprobante
app.get('/getColegio/:cid', (req, res) => {
  const q = "select col.nombre, col.precio from colegio col join cliente c on col.cid = c.colegio where c.cid=? and precio > 0";
  const cid = req.params.cid;
  db.query(q, [cid], (err, result) => {
      if(err) return res.status(500).json({Error: "Error inside server"});
      else if (result.length > 0){return res.status(200).json(result);}
      else return (res.status(404).json({Error: "No existen datos" }))
  });
});

//insertar pago desde cliente
app.post('/createClientPayment', (req, res) => {
    const gestion = req.body.gestion;
    const fecha = new Date();
    const monto = req.body.monto;
    const cid = req.body.cid;
    const uid = req.body.uid;

    const query = `
      INSERT INTO pago (gestion, fechaPago, formaPago, monto, fechaAgregado, cidFK1, uidFK2, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [gestion, fecha, 2, monto, fecha, cid, uid, 0], (err, result) => {
      if (err) {
        console.error('Error al insertar el pago:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
        return;
      }
      res.status(201).json({ message: 'Pago insertado correctamente', pagoId: result.insertId });
    });
  });

//subir imagen de comprobante
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const { cid } = req.body;
      const imagePath = req.file.path;
  
      const sql = 'UPDATE pago set comprobantePago = ? where cidFK1 = ?';
      db.query(sql, [imagePath, cid], (err, result) => {
        if (err) {
          console.error('Error al actualizar el comprobante:', err);
          res.status(500).json({ error: 'Error en la base de datos' });
        }else{
          res.status(200).json({ message: 'Imagen subida correctamente', imagePath });
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Error subiendo la imagen' });
    }
  });

app.post('/uploadDatosTutor',  (req, res) => {
    const { nombre, telefono, cid } = req.body;
    const sql = 'UPDATE cliente set nombreTutor = ?, nroTelefonoTutor = ? where cid = ?';
    db.query(sql, [nombre, telefono, cid], (err, result) => {
        if (err) {
            console.error('Error al actualizar el dato:', err);
            res.status(500).json({ error: 'Error en la base de datos' });
        }else{
            res.status(200).json({ message: 'Datos actualizados correctamente', datosActualizados: res.affectedRows });
        }
    })
});

/* OTRAS CONSULTAS */

app.get('/getColegios', (req, res) => {
    const q = "SELECT cid, nombre FROM colegio";

    db.query(q, (err, results) => {
        if (err) return res.status(500).json({ Error: "Error en el servidor" });
        return res.status(200).json(results);
    });
});

//insertar cliente
app.post('/createClient', (req, res) => {
    const { nombre, apellidoPaterno, apellidoMaterno, ci, fechaNacimiento, colegio, curso, uidFK1} = req.body;
    const q = "INSERT INTO cliente (nombre, apellidoPaterno, apellidoMaterno, carnetIdentidad, fechaNacimiento, colegio, curso, tipoAsegurado, uidFK1, estado) VALUES (?, ?, ?, ?, ?, ?, ?, 'Asegurado', ?, '1')";
    db.query(q, [nombre, apellidoPaterno, apellidoMaterno, ci, fechaNacimiento, colegio, curso, uidFK1], (err, result) => {
        if (err) {
            console.error('Error al insertar el cliente:', err);
            res.status(500).json({ error: 'Error en la base de datos' });
            return;
        }
        res.status(201).json({ message: 'Cliente insertado correctamente', clientId: result.insertId });
    });
  });

//logout
app.get('/logout', (req,res) => {
    res.clearCookie('token');
    return res.status(200).json({Status: "Success"});
})

app.get('/admin-route', verifyUser, verifyRole, checkRole([1,3]), (req, res) => {
    res.status(403).json({Error: "Access denied"});
  });

app.listen(8081, () => {
    console.log("Backend connected.");
})

