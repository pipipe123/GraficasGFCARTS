import { Router } from "express";
import { createEscuela, readEscuela, readEscuelaxNombre, updateEscuela, deleteEscuela } from "../controllers/escuela.controller.js";
import { createGimnasio, readGimnasio, readGimnasioxNombre, updateGimnasio, deleteGimnasio, readGimnasioxEscuela, getGimnasiosCountByEscuela} from "../controllers/gimnasio.controller.js";
import { updateCompetidorTorneo,createCompetidor, readCompetidor, updateCompetidor, deleteCompetidor, readCompetidoresByGimnasio, getCompetidoresCountByEscuela, getCinturonesNegrosCountByEscuela} from "../controllers/competidor.controller.js";

import { createEvento, readEvento, updateEvento, deleteEvento, ReadEventoxCodigo } from "../controllers/evento.controller.js";
import { readCompetidoresPorTorneo } from "../controllers/grafica.controller.js";
import { EmparejarCompetidores } from "../controllers/emparejamiento.js";
const router=Router();

router.post('/Escuela',createEscuela);
router.get('/Escuela',readEscuela);
router.get('/Escuela/:nombre',readEscuelaxNombre);
router.put('/Escuela',updateEscuela);
router.delete('/Escuela',deleteEscuela);

router.post('/Gimnasio',createGimnasio);
router.get('/Gimnasio',readGimnasio);
router.get('/Gimnasio/:nombre',readGimnasioxNombre);
router.get('/Gimnasio/Escuela/:escuela',readGimnasioxEscuela);
router.put('/Gimnasio',updateGimnasio);
router.delete('/Gimnasio',deleteGimnasio);


router.post('/Competidor',createCompetidor);
router.get('/Competidor',readCompetidor);
router.get('/Competidor/:gimnasio',readCompetidoresByGimnasio);
router.put('/Competidor',updateCompetidor);
router.delete('/Competidor',deleteCompetidor);

router.post('/Evento',createEvento);
router.get('/Evento',readEvento);
router.get('/Evento/:codigo',ReadEventoxCodigo);
router.put('/Evento',updateEvento);
router.delete('/Evento',deleteEvento);

router.get('/Grafica/:codigoTorneo', readCompetidoresPorTorneo);
router.get('/Emparejar/:codigoTorneo', EmparejarCompetidores);



router.get('/competidores/count/:escuela', getCompetidoresCountByEscuela);
router.get('/gimnasios/count/:escuela', getGimnasiosCountByEscuela);
router.get('/competidores/cinturonesNegros/count/:escuela', getCinturonesNegrosCountByEscuela);

router.post('/addCompetidor',updateCompetidorTorneo)

export default router
