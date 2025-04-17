const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class dashboard {
    async clientestop(idcia) {
        try {
            var query = `SELECT a.*, ifnull(b.nombre,'Sin Información') categoria,
                case a.tipo
                    when 1 then 'Simple'
                    when 2 then 'Variado'
                    when 3 then 'Grupo'
                    when 4 then 'Servicio'
                    when 5 then 'Virtual'
                end as tipop    
                FROM productos a 
                left join categorias b on a.idcat=b.id
                where a.idcia = ?
                order by id desc`

            const [rows] = await db.query(query, [idcia]);
            return rows[0];
        } catch (error) {
            console.error('Error al obtener alojamiento:', error);
            throw error;
        }
    }

    async cotizaciones(idcia, est) {
        try {
            var query = `SELECT a.*, ifnull(b.nombre,'Sin Información') categoria,
                case a.tipo
                    when 1 then 'Simple'
                    when 2 then 'Variado'
                    when 3 then 'Grupo'
                    when 4 then 'Servicio'
                    when 5 then 'Virtual'
                end as tipop    
                FROM productos a 
                left join categorias b on a.idcat=b.id
                where a.idcia = ?
                order by id desc`

            const [rows] = await db.query(query, [idcia, est]);
            return rows[0];
        } catch (error) {
            console.error('Error al obtener alojamiento:', error);
            throw error;
        }
    }

    async cotizaasesor(id, est) {
        try {
            var query = `SELECT a.*, ifnull(b.nombre,'Sin Información') categoria,
                case a.tipo
                    when 1 then 'Simple'
                    when 2 then 'Variado'
                    when 3 then 'Grupo'
                    when 4 then 'Servicio'
                    when 5 then 'Virtual'
                end as tipop    
                FROM productos a 
                left join categorias b on a.idcat=b.id
                where a.idcia = ?
                order by id desc`

            const [rows] = await db.query(query, [id, est]);
            return rows[0];
        } catch (error) {
            console.error('Error al obtener alojamiento:', error);
            throw error;
        }
    }

}

module.exports = dashboard;
