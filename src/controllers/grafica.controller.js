import Competidor from "../models/competidor.model.js";
import Evento from "../models/evento.model.js";

// Define una clase para los competidores con los campos necesarios
class CompetidorSimplificado {
    constructor({ nombre, edad, cinta, peso, estatura, gimnasio, escuela, modalidad }) {
        this.nombre = nombre;
        this.edad = edad;
        this.cinta = cinta;
        this.peso = peso;
        this.estatura = estatura;
        this.gimnasio = gimnasio;
        this.escuela = escuela;
        this.modalidad = modalidad;
    }
}
const ordenarCinturonesNegros = (arr) => {
    return arr.slice().sort((a, b) => {
        if (a.peso !== b.peso) {
            return b.peso - a.peso;
        }
        return a.anioNacimiento - b.anioNacimiento;
    });
};
const ordenarPorCintaEdadImc = (arr) => {
    return arr.slice().sort((a, b) => {
        if (a.grado !== b.grado) {
            return b.grado - a.grado;
        }
        if (a.anioNacimiento !== b.anioNacimiento) {
            return a.anioNacimiento - b.anioNacimiento;
        }
        return a.imc - b.imc;
    });
};
// Función para intercalar competidores de diferentes gimnasios
const intercalarCompetidores = (competidoresPorGimnasio) => {
    const result = [];
    let index = 0;
    let totalCompetidores = competidoresPorGimnasio.reduce((acc, gimnasio) => acc + gimnasio.length, 0);

    while (totalCompetidores > 0) {
        for (let i = 0; i < competidoresPorGimnasio.length; i++) {
            if (competidoresPorGimnasio[i][index]) {
                result.push(competidoresPorGimnasio[i][index]);
                totalCompetidores--;
            }
        }
        index++;
    }

    return result;
};

// Función que ordena y agrupa competidores por gimnasio
const agruparCompetidoresPorGimnasio = (competidores) => {
    const competidoresPorGimnasio = {};

    competidores.forEach(competidor => {
        const { gimnasio } = competidor;
        if (!competidoresPorGimnasio[gimnasio]) {
            competidoresPorGimnasio[gimnasio] = [];
        }
        competidoresPorGimnasio[gimnasio].push(competidor);
    });

    return Object.values(competidoresPorGimnasio);
};

export const readCompetidoresPorTorneo = async (req, res) => {
    const { codigoTorneo } = req.params;

    try {
        const competidores = await Competidor.find({ torneo: codigoTorneo });

        if (competidores.length === 0) {
            return res.status(404).send('No se encontraron competidores para este torneo');
        }

        const competidoresPorGimnasio = agruparCompetidoresPorGimnasio(competidores);
        const competidoresIntercalados = intercalarCompetidores(competidoresPorGimnasio);

        // Crear estructuras iniciales para "Formas" y "Combate" organizadas por cintas y cinturones negros
        const estructuraInicial = {
            formas: {
                todasLasCintas: {
                    femenil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    },
                    varonil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    }
                },
                cintasNegras: {
                    femenil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    },
                    varonil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    }
                }
            },
            combate: {
                todasLasCintas: {
                    femenil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    },
                    varonil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    }
                },
                cintasNegras: {
                    femenil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    },
                    varonil: {
                        Infantil: [],
                        Juvenil: [],
                        Adultos: []
                    }
                }
            }
        };

        const formas = JSON.parse(JSON.stringify(estructuraInicial.formas));
        const combate = JSON.parse(JSON.stringify(estructuraInicial.combate));

        // Añadir competidores intercalados a "Formas" y "Combate" según sexo y modalidad
        competidoresIntercalados.forEach(c => {
            const esCintaNegra = c.grado === "0";
            const esFemenil = c.sexo === 'Femenil';
            const modalidad = c.modalidad;

            const destinoFormas = esCintaNegra ? formas.cintasNegras : formas.todasLasCintas;
            const destinoCombate = esCintaNegra ? combate.cintasNegras : combate.todasLasCintas;

            const grupo = c.categoria === 'Infantil' || c.categoria === 'Cadetes' ? 'Infantil' :
                          c.categoria === 'Junior' ? 'Juvenil' : 'Adultos';

            const competidorData = {
                nombre: c.nombre,
                edad: new Date().getFullYear() - c.anioNacimiento,
                cinta: c.cinta,
                peso: c.peso,
                estatura: c.estatura,
                gimnasio: c.gimnasio,
                escuela: c.escuela,
                grado: c.grado,
                modalidad: c.modalidad,
                imc: c.peso / ((c.estatura / 100) ** 2)
            };

            const nuevoCompetidor = new Competidor(competidorData);

            // Asegurarse de que el grupo existe antes de añadir el competidor
            if (destinoFormas && destinoFormas[esFemenil ? 'femenil' : 'varonil'] && destinoFormas[esFemenil ? 'femenil' : 'varonil'][grupo]) {
                if (modalidad.includes('formas')) {
                    destinoFormas[esFemenil ? 'femenil' : 'varonil'][grupo].push(nuevoCompetidor);
                }
            }

            if (destinoCombate && destinoCombate[esFemenil ? 'femenil' : 'varonil'] && destinoCombate[esFemenil ? 'femenil' : 'varonil'][grupo]) {
                if (modalidad.includes('combate')) {
                    destinoCombate[esFemenil ? 'femenil' : 'varonil'][grupo].push(nuevoCompetidor);
                }
            }
        });

        // Ordenar los competidores en "Formas" y "Combate"
        const ordenarEstructura = (estructura, ordenarFn) => ({
            todasLasCintas: {
                femenil: {
                    Infantil: ordenarFn(estructura.todasLasCintas.femenil.Infantil),
                    Juvenil: ordenarFn(estructura.todasLasCintas.femenil.Juvenil),
                    Adultos: ordenarFn(estructura.todasLasCintas.femenil.Adultos)
                },
                varonil: {
                    Infantil: ordenarFn(estructura.todasLasCintas.varonil.Infantil),
                    Juvenil: ordenarFn(estructura.todasLasCintas.varonil.Juvenil),
                    Adultos: ordenarFn(estructura.todasLasCintas.varonil.Adultos)
                }
            },
            cintasNegras: {
                femenil: {
                    Infantil: ordenarCinturonesNegros(estructura.cintasNegras.femenil.Infantil),
                    Juvenil: ordenarCinturonesNegros(estructura.cintasNegras.femenil.Juvenil),
                    Adultos: ordenarCinturonesNegros(estructura.cintasNegras.femenil.Adultos)
                },
                varonil: {
                    Infantil: ordenarCinturonesNegros(estructura.cintasNegras.varonil.Infantil),
                    Juvenil: ordenarCinturonesNegros(estructura.cintasNegras.varonil.Juvenil),
                    Adultos: ordenarCinturonesNegros(estructura.cintasNegras.varonil.Adultos)
                }
            }
        });

        const resultado = {
            formas: ordenarEstructura(formas, ordenarPorCintaEdadImc),
            combate: ordenarEstructura(combate, ordenarPorCintaEdadImc)
        };

        console.log(resultado);

        // Actualizar el evento con el resultado
        const evento = await Evento.findOneAndUpdate(
            { codigo: codigoTorneo },
            { combate: resultado.combate, formas: resultado.formas },
            { new: true, upsert: true }
        );

        res.json(evento);
    } catch (error) {
        console.error('Error al buscar competidores:', error);
        res.status(500).send('Error al buscar competidores');
    }
};
