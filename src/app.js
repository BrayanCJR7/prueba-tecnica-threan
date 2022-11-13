import React, { useEffect, useState } from "react";
import './app.css'
import DataTable from 'react-data-table-component'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const columnas = [
    {
        name: 'Id de caso',
        selector: row => row.id_de_caso,
        sortable: true
    },
    {
        name: 'Fecha de reporte',
        selector: row => row.fecha_reporte_web,
        sortable: true
    },
    {
        name: 'Departamento',
        selector: row => row.departamento,
        sortable: true
    },
    {
        name: 'Departamento nom',
        selector: row => row.departamento_nom,
        sortable: true
    },
    {
        name: 'Ciudad municipio',
        selector: row => row.ciudad_municipio,
        sortable: true
    },
    {
        name: 'Ciudad municipio nom',
        selector: row => row.ciudad_municipio_nom,
        sortable: true
    },
    {
        name: 'Edad',
        selector: row => row.edad,
        sortable: true
    },
    {
        name: 'Unidad medida',
        selector: row => row.unidad_medida,
        sortable: true
    },
    {
        name: 'Sexo',
        selector: row => row.sexo,
        sortable: true
    },
    {
        name: 'Fuente tipo contagio',
        selector: row => row.fuente_tipo_contagio,
        sortable: true
    },
    {
        name: 'Ubicacion',
        selector: row => row.ubicacion,
        sortable: true
    },
    {
        name: 'Estado',
        selector: row => row.estado,
        sortable: true
    },
    {
        name: 'Recuperado',
        selector: row => row.recuperado,
        sortable: true
    },
    {
        name: 'Fecha inicio sintomas',
        selector: row => row.fecha_inicio_sintomas,
        sortable: true
    },
    {
        name: 'Fecha diagnostico',
        selector: row => row.fecha_diagnostico,
        sortable: true
    },
    {
        name: 'Fecha recuperado',
        selector: row => row.fecha_recuperado,
        sortable: true
    },
    {
        name: 'Tipo recuperacion',
        selector: row => row.tipo_recuperacion,
        sortable: true
    },
    {
        name: 'Per etn',
        selector: row => row.per_etn_,
        sortable: true
    }
]

const App = () => {
    const [covidcasos, setCovidcasos] = useState([]);
    const [tabla, setTabla] = useState([]);
    const [busqueda, setBusqueda] = useState([]);

    /* Graficos */
    const [ciudades, setCiudades] = useState([]);
    /* Mostrar sin repetir las ciudades */
    let unic = [... new Set(ciudades.map(x => x.departamento_nom))];
    /* Contando el numero de casos por ciudad */
    const res = ciudades.reduce((acc, next, index) => {
        return {
            ...acc,
            [next.departamento_nom]: (acc[next.departamento_nom] || 0) + 1
        }
    }, {})
    
    const data = {
        labels: unic,
        datasets: [
            {
                label: 'Ciudades',
                data: Object.keys(res).map(name => res[name]),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 3
            }]
    }

    const inicialUrl = 'https://www.datos.gov.co/resource/gt2j-8ykr.json';
    const fetchApi = async () => {
        const response = await fetch(inicialUrl)
        const data = await response.json()
        console.log(data.length)
        setCovidcasos(data)
        setTabla(data)
        setCiudades(data)
    }

    const handleChange = e => {
        setBusqueda(e.target.value)
        filtar(e.target.value)
    }

    const filtar = (terminoBusqueda) => {
        var resultadosBusqueda = tabla.filter((elemento) => {
            if (elemento.departamento_nom.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                || elemento.ciudad_municipio_nom.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
            ) {
                return elemento;
            }
        });
        setCovidcasos(resultadosBusqueda);
    }

    useEffect(() => {
        fetchApi()
    }, [])
    return (
        <div className="App">
            <DataTable className="table"
                columns={columnas}
                data={covidcasos}
                title='Casos COVID'
                pagination
            />
            <div className="input-group mb-3 busqueda">
                <span className="input-group-text" id="basic-addon2">Buscar por departamento o ciudad</span>
                <input
                    type="text"
                    className="form-control"
                    aria-label="Text input with segmented dropdown button"
                    value={busqueda}
                    onChange={handleChange}
                />
            </div>
            <div className="grafico">
                <Pie
                    data={data} />;
            </div>
        </div>
    )
}

export default App;