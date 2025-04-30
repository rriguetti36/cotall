const db = require('../config/db');  // Si tienes un archivo de configuración para la DB

class dashboard {
    async cotizacionesdatos(idcia) {
        console.log("idcia en modelo dashboard: " + idcia);
        try {
            var query = `select 
                        sum(case when b.estado=1 then 1 else 0 end) cotizados,
                        sum(case when b.estado=2 then 1 else 0 end) enviados,
                        sum(case when b.estado=3 then 1 else 0 end) ventas,
                        sum(case when b.estado=4 then 1 else 0 end) rechazados
                        from cotizacion_cab a JOIN estados_cot b on a.id=b.idcot
                        where a.idcia=?`

            const [rows] = await db.query(query, [idcia]);
            return rows[0];
        } catch (error) {
            console.error('Error al obtener alojamiento:', error);
            throw error;
        }
    }

    async productostop(idcia) {
        try {
            var query = `select nombre, tot, (tot / totcot) * 100 prc from (
                        select a.idcia,d.nombre nombre, count(b.idprod) tot 
                        from cotizacion_cab a join cotizacion_det b on a.id=b.idcot 
                        join productos d on b.idprod=d.id group by a.idcia,d.nombre 
                        union all 
                        select a.idcia, d.titulo, count(b.idprod) tot 
                        from cotizacion_cab a join cotizacion_det b on a.id=b.idcot 
                        join productovariantes d on b.idprod=d.id group by a.idcia,d.titulo) a
                        join (
                            select a.idcia, sum(tot) totcot from (
                                select a.idcia, count(*) tot
                                from cotizacion_cab a join cotizacion_det b on a.id=b.idcot 
                                join productos d on b.idprod=d.id group by a.idcia
                                union all 
                                select a.idcia, count(*)
                                from cotizacion_cab a join cotizacion_det b on a.id=b.idcot 
                                join productovariantes d on b.idprod=d.id group by a.idcia
                            ) a group by a.idcia
                        ) e on a.idcia=e.idcia
                        where a.idcia=?
                        order by 2 desc
                        limit 5`

            const [rows] = await db.query(query, [idcia]);
            return rows;
        } catch (error) {
            console.error('Error al obtener alojamiento:', error);
            throw error;
        }
    }

    async asesores(idcia) {
        try {
            var query = `select concat(b.nombres,b.apellidos) nombres, count(*) tot
                        from cotizacion_cab a join users b on a.iduser=b.id and a.idcia=b.idcia
                        where a.idcia=?
                        group by b.nombres, b.apellidos`

            const [rows] = await db.query(query, [idcia]);
            return rows[0];
        } catch (error) {
            console.error('Error al obtener alojamiento:', error);
            throw error;
        }
    }

    async clientestop(idcia){
        try {
            var query = `select d.cottot, b.razonsocial nombres, c.estado , count(*) tot
                        from cotizacion_cab a 
                        join clientes b on a.idcli=b.id and a.idcia=b.idcia
                        join estados_cot c on a.id=c.idcot
                        join (
                            select a.idcia, count(*) cottot
                            from cotizacion_cab a 
                            join clientes b on a.idcli=b.id and a.idcia=b.idcia
                            group by a.idcia
                        ) d on a.idcia=d.idcia
                        where a.idcia=? and c.estado in (1,3)
                        group by d.cottot, b.razonsocial, c.estado
                        order by 1 desc`

            const [rows] = await db.query(query, [idcia]);
            return rows;
        } catch (error) {
            
            console.error('Error al obtener alojamiento:', error);
            throw error;
        }
    }
}

module.exports = dashboard;
