import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedType, setSelectedType] = useState(''); // Para el tipo seleccionado (JSON, CSV, TXT)
  const [selectedAction, setSelectedAction] = useState(''); // Para el botón seleccionado
  const [filename, setFilename] = useState(''); // Nombre del archivo
  const [content, setContent] = useState(''); // Contenido del archivo
  const [output, setOutput] = useState(''); // Para mostrar resultados o contenido en el cuadro grande
  const [error, setError] = useState(null); // Para manejar errores

  const handleSidebarSelect = (type) => {
    setSelectedType(type);
    setOutput(''); // Limpiar la salida al cambiar de tipo
    setContent(''); // Limpiar el campo de contenido al cambiar de tipo
    setError(null); // Limpiar errores al cambiar de tipo
  };

  const handleButtonSelect = (action) => {
    setSelectedAction(action);
    setContent(''); // Limpiar el campo de contenido al cambiar de acción
  };

  const handleSend = () => {
    if (!selectedType) {
      setError('Seleccione un tipo de archivo (JSON, CSV, TXT).');
      return;
    }

    if (!selectedAction) {
      setError('Seleccione una acción.');
      return;
    }

    setError(null);

    const baseUrl = `http://localhost:8080/api/${selectedType.toLowerCase()}`;

    switch (selectedAction) {
      case 'Get Files':
        axios
          .get(baseUrl)
          .then((response) => setOutput(response.data.join('\n')))
          .catch(() => setError('Error al obtener los archivos.'));
        break;

      case 'Store':
        if (!filename) {
          setError('Ingrese un nombre para el archivo.');
          return;
        }

        // Validar extensión del archivo
        const validExtensions = {
          json: '.json',
          csv: '.csv',
          txt: '.txt',
        };
        if (!filename.endsWith(validExtensions[selectedType.toLowerCase()])) {
          setError(`El archivo debe tener la extensión ${validExtensions[selectedType.toLowerCase()]}.`);
          return;
        }

        axios
          .post(baseUrl, { filename })
          .then(() => setOutput(`Archivo ${filename} creado correctamente.`))
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              setError('Error en el nombre del archivo.');
            } else {
              setError('Error al crear el archivo.');
            }
          });
        break;

        case 'Show':
          if (!filename) {
              setError('Ingrese un nombre para el archivo.');
              return;
          }
          axios
              .get(`${baseUrl}/${filename}`)
              .then((response) => {
                  // Manejar el contenido del archivo JSON correctamente
                  let formattedContent;
                  if (selectedType === 'JSON') {
                      try {
                          // Verifica si la respuesta ya es un objeto
                          const jsonData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                          // Ahora formatea el objeto como una cadena JSON legible
                          formattedContent = JSON.stringify(jsonData, null, 2);
                      } catch (e) {
                          // Si hay un error al procesar el JSON, muestra un error
                          formattedContent = 'Error al procesar el JSON: ' + e.message;
                      }
                  } else {
                      // Si no es JSON, simplemente mostrar el contenido tal cual
                      formattedContent = response.data;
                  }
                  setOutput(formattedContent);
              })
              .catch(() => setError('Error al obtener el archivo.'));
          break;
      
      

      case 'Update':
        if (!filename) {
          setError('Ingrese un nombre de archivo.');
          return;
        }
        axios
          .put(`${baseUrl}/${filename}`, { content })
          .then(() => setOutput(`Archivo ${filename} actualizado correctamente.`))
          .catch(() => setError('Error al actualizar el archivo.'));
        break;

      case 'Delete':
        if (!filename) {
          setError('Ingrese un nombre para el archivo.');
          return;
        }
        axios
          .delete(`${baseUrl}/${filename}`)
          .then(() => setOutput(`Archivo ${filename} eliminado correctamente.`))
          .catch(() => setError('Error al eliminar el archivo.'));
        break;

      default:
        setError('Acción no reconocida.');
        break;
    }
  };

  return (
    <div className="App">
      <header>PR UD 2</header>
      <div className="separator"></div>

      <div className="main-container">
        {/* Menú lateral */}
        <div className="sidebar">
          <button
            className={selectedType === 'TXT' ? 'active' : ''}
            onClick={() => handleSidebarSelect('TXT')}
          >
            Storage Class
          </button>
          <button
            className={selectedType === 'JSON' ? 'active' : ''}
            onClick={() => handleSidebarSelect('JSON')}
          >
            JSON
          </button>
          <button
            className={selectedType === 'CSV' ? 'active' : ''}
            onClick={() => handleSidebarSelect('CSV')}
          >
            CSV
          </button>
        </div>

        {/* Cuerpo principal */}
        <div className="body-content">
          {/* Botones de acción */}
          <div className="buttons-row">
            {['Get Files', 'Store', 'Show', 'Update', 'Delete'].map((action) => (
              <button
                key={action}
                className={selectedAction === action ? 'active' : ''}
                onClick={() => handleButtonSelect(action)}
              >
                {action}
              </button>
            ))}
          </div>

          {/* Campo de texto para nombre de archivo */}
          <input
            type="text"
            placeholder="Ingrese el nombre del archivo"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />

          {/* Cuadro de texto editable para contenido (solo cuando sea necesario) */}
          {selectedAction === 'Update' && (
            <textarea
              rows="10"
              placeholder="Ingrese el contenido del archivo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          )}

          {/* Botón Send */}
          <button className="send-button" onClick={handleSend}>
            Send
          </button>

          {/* Cuadro grande para mostrar resultados */}
          <textarea
            readOnly
            rows="10"
            className="output-box"
            value={error || output}
            placeholder="Resultados aparecerán aquí..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default App;
