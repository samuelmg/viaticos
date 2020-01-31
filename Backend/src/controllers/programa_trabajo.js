const pool = require('../database');

/*
* La información se puede sacar de
* req.body, req.get, req.params
* respectivamente.
*/

module.exports = {

    crearPrograma: async(req, res) => {
      var dia = req.body.dia;
      var lugar_estancia = req.body.lugar_estancia;
      var tareas_realizar = req.body.tareas_realizar;
      var id_comision = req.body.id_comision;

      var sqlProgram = "INSERT INTO programa_trabajo SET ?";
      try{
        var valuesProgram = {
          dia: dia,
          lugar_estancia: lugar_estancia,
          tareas_realizar: tareas_realizar,
          id_comision: id_comision
        };
        const resp = await pool.query(sqlProgram, [valuesProgram]);
      }catch (e){
        return res.json({ ok: false, mensaje: e });
      }
      res.json({ ok: true, mensaje: "Programa creado" });
    },

    verPrograma: (req, res) => {
      const {codigo} = req.params;
      try{
        pool.query('SELECT * FROM programa_trabajo WHERE id_comision = ?', [codigo], (errorPrograma, programa) => {
            if (errorPrograma) return res.json(errorPrograma);
            if (programa.length < 1) return res.json({ok:false, mensaje: "no existe programa"});
            let json = {
                id_comision: programa[0].id_comision,
                dia: programa[0].dia,
                lugar_estancia: programa[0].lugar_estancia,
                tareas_realizar: programa[0].tareas_realizar
            };

            res.json({ ok: true, body: json});
        });
      }catch(e){
        return res.json({ ok: false, mensaje: e});
      }
    },

    modificarPrograma: (req, res) => {
      try{
        pool.query('UPDATE programa_trabajo SET ? WHERE id_comision = ?',[{
           dia: req.body.dia,
           lugar_estancia: req.body.lugar_estancia,
           tareas_realizar: req.body.tareas_realizar,
           id_comision: req.body.id_comision,
        },req.body.id_comision],(errorModificar, modificarPrograma) => {
          if(errorModificar) return res.json({ok:false, mensaje: "error al modificar"});
          res.json({ok:true, mensaje: "programa modificado exitosamente"});
        });
      }catch(e){
        return res.json({ ok: false, mensaje: e})
      }
    },

    eliminarPrograma: (req, res) => {
      var idProgram = req.params;
        pool.query('DELETE FROM programa_trabajo WHERE id_comision = ?', [idProgram], (error, results) => {
            if(error) return res.json({ok: false, mensaje: error});
            res.json({ ok: true, results, mensaje: 'Programa eliminado'});
        });
    },
}
