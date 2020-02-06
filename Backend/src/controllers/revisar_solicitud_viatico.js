const pool = require('../database');
//const Utils = require('node-utils');
/*
 * La información se puede sacar de
 * req.body, req.get, req.params
 * respectivamente.
 */
module.exports = {
    solicitudesViaticosPorRevisar:async (req, res) => {
        try {
            //Verificar tipo de usuario
            const existeUsuario = await pool.query('SELECT codigo, tipo_usuario FROM usuario WHERE codigo=?', [req.user.codigo]);
            if (existeUsuario.length < 0) {
                return res.json({ ok: false, mensaje: "Este usuario no existe" });
            }
            //si usuario es A mostrar todas las solocitudes de comison en status 3
            if(existeUsuario[0].tipo_usuario =='A')
            {
                const viaticos = await pool.query('SELECT v.id AS id_viatico, v.status, u.codigo,concat(u.nombres," ",u.apellidos) as nombre, u.area_adscripcion, v.fecha_solicitud, c.nombre_comision FROM solicitud_viatico AS v INNER JOIN usuario as u ON u.codigo=v.id_usuario INNER JOIN solicitud_comision as c ON c.id= v.id_solicitud_comision WHERE v.status =3');
                    if (viaticos.length < 1) res.json({ ok: false, mensaje: "No hay solicitudes de viaticos por aceptar" });
                    
                return res.json({ok:true, body: viaticos});

            }
            else if(existeUsuario[0].tipo_usuario =='S')
            {
                const viaticos = await pool.query('SELECT v.id AS id_viatico, v.status, u.codigo,concat(u.nombres," ",u.apellidos) as nombre, u.area_adscripcion, v.fecha_solicitud, c.nombre_comision FROM solicitud_viatico AS v INNER JOIN usuario as u ON u.codigo=v.id_usuario INNER JOIN solicitud_comision as c ON c.id= v.id_solicitud_comision WHERE v.status =1');
                    if (viaticos.length < 1) res.json({ ok: false, mensaje: "No hay solicitudes de viaticos por aceptar" });
                    
                return res.json({ok:true, body: viaticos});
            }

            res.json({ok: false, mensaje: "Funcion no disponible para tu usuario"});
            
            
        } catch (error) {
            return res.json({ ok: false, mensaje: error });
        }

    },

    aceptarViatico: async(req, res) => {
        //verificar que no este en status cancelado =-1, revision = 1, aceptado por J =3, aceptado por A= 5 o finalizado
        try {
            var sqlViatico = 'SELECT V.id, v.status, u.codigo, v.fecha_solicitud , concat(u.nombres," ",u.apellidos) as nombre, u.tipo_usuario FROM solicitud_viatico AS v INNER JOIN usuario as u ON u.codigo = c.id_usuario WHERE (v.status =1 OR v.status=3)';
            const verificarViatico = await pool.query(sqlViatico);
            if (verificarViatico.length < 1) {
                return res.json({ ok: false, mensaje: "No se puede revisar viatico" });
            }
            const usuario = await pool.query("SELECT CONCAT(u.nombre, ' ' , u.apellidos) as nombre FROM viaticos.usuario as u WHERE codigo = ?",[req.user.codigo]);
                
            var modificarViatico = 'UPDATE solicitud_viatico SET ? WHERE id = ?';
            //si usuario =J modifcar fecha revisado, nombre revisado, comentario rechazo
            //si usuario =A modificar fecha_aceptado, nombre aceptado, comentario rechazo
            if (req.user.tipo_usuario == 'S' && verificarViatico[0].status == 1) {
                pool.query(modificarViatico, [{
                    fecha_modificacion: new Date(),
                    fecha_revisado: new Date(),
                    nombre_revisado: usuario[0].nombre,
                    comentario_rechazo: req.body.comentario_rechazo,
                    status: req.body.status,
                }, req.body.id], (errorModificar, modificarViatico) => {
                    if (errorModificar) return res.json({ ok: false, mensaje: errorModificar });

                });
                return res.json({ ok: true, mensaje: "Viatico verificado" });

            } else if (req.user.tipo_usuario == 'A' && verificarComision[0].status == 3) {
                pool.query(modificarViatico, [{
                    fecha_modificacion: new Date(),
                    fecha_aceptado: new Date(),
                    nombre_aceptado: usuario[0].nombre,
                    comentario_rechazo: req.body.comentario_rechazo,
                    status: req.body.status,
                }, req.body.id], (errorModificar, modificarViatico) => {
                    if (errorModificar) return res.json({ ok: false, mensaje: errorModificar });
                });
                return res.json({ ok: true, mensaje: "Viatico aceptado" });

            }

            res.json({ ok: false, mensaje: "No se hizo la revision correcta" });
        } catch (error) {
            return res.json({ ok: false, mensaje: error });
        }
        
    }
}