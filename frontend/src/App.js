import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const allowedExtensions = ['.txt', '.json', '.csv'];

  const handleSidebarSelect = (type) => {
    setSelectedType(type);
    setSelectedAction('');
    setFilename('');
    setContent('');
    setOutput('');
    setError(null);
  };

  const handleButtonSelect = (action) => {
    setSelectedAction(action);
    setOutput('');
    setError(null);
    if (action !== 'Store' && action !== 'Update') {
      setContent('');
    }
  };

  const handleSend = async () => {
    if (!selectedType) {
      setError('Seleccione un tipo de archivo (Storage Class, JSON, CSV).');
      return;
    }

    if (!selectedAction) {
      setError('Seleccione una acción.');
      return;
    }

    setError(null);

    const baseUrl = {
      'Storage Class': 'http://localhost:8080/api/hello',
      JSON: 'http://localhost:8080/api/json',
      CSV: 'http://localhost:8080/api/csv',
    }[selectedType];

    if (!baseUrl) {
      setError('Tipo de archivo no reconocido.');
      return;
    }

    try {
      let res;

      switch (selectedAction) {
        case 'Get Files':
          res = await axios.get(baseUrl);
          setOutput(res.data.contenido.join('\n'));
          break;

        case 'Store':
          if (!filename) {
            setError('Ingrese un nombre para el archivo.');
            return;
          }
          if (!content) {
            setError('Ingrese el contenido del archivo.');
            return;
          }
          if (selectedType !== 'Storage Class') {
            const validExtensions = {
              JSON: '.json',
              CSV: '.csv',
            };
            if (!filename.endsWith(validExtensions[selectedType])) {
              setError(`El archivo debe tener la extensión ${validExtensions[selectedType]}.`);
              return;
            }
          } else {
            if (!allowedExtensions.some((ext) => filename.endsWith(ext))) {
              setError(`El archivo debe tener una de las siguientes extensiones: ${allowedExtensions.join(', ')}`);
              return;
            }
          }
          res = await axios.post(baseUrl, { filename, content });
          setOutput(res.data.mensaje);
          break;

        case 'Show':
          if (!filename) {
            setError('Ingrese un nombre para el archivo.');
            return;
          }
          res = await axios.get(`${baseUrl}/${filename}`);
          if (selectedType === 'CSV') {
            const csvData = res.data.contenido;
            const formattedContent = csvData.map((row) => Object.values(row).join(',')).join('\n');
            setOutput(formattedContent);
          } else if (selectedType === 'JSON') {
            setOutput(JSON.stringify(res.data.contenido, null, 2));
          } else {
            setOutput(res.data.contenido);
          }
          break;

        case 'Update':
          if (!filename) {
            setError('Ingrese un nombre de archivo.');
            return;
          }
          if (!content) {
            setError('Ingrese el nuevo contenido del archivo.');
            return;
          }
          res = await axios.put(`${baseUrl}/${filename}`, { content });
          setOutput(res.data.mensaje);
          break;

        case 'Delete':
          if (!filename) {
            setError('Ingrese un nombre para el archivo.');
            return;
          }
          res = await axios.delete(`${baseUrl}/${filename}`);
          setOutput(res.data.mensaje);
          break;

        default:
          setError('Acción no reconocida.');
          break;
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError('Error al realizar la operación.');
      }
    }
  };

  return (
    <div className="App">
      <header>PR UD 2</header>
      <div className="separator"></div>

      <div className="main-container">
        <div className="sidebar">
          {['Storage Class', 'JSON', 'CSV'].map((type) => (
            <button
              key={type}
              className={selectedType === type ? 'active' : ''}
              onClick={() => handleSidebarSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="body-content">
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

          {['Store', 'Show', 'Update', 'Delete'].includes(selectedAction) && (
            <div className="input-container">
              <input
                type="text"
                placeholder="Ingrese el nombre del archivo"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="input-field"
              />
            </div>
          )}

          {['Store', 'Update'].includes(selectedAction) && (
            <div className="input-container">
              <textarea
                rows="10"
                placeholder="Ingrese el contenido del archivo"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field"
              ></textarea>
            </div>
          )}

          <button className="send-button" onClick={handleSend}>
            Send
          </button>

          <textarea
            readOnly
            rows="10"
            className="output-box"
            value={error ? `Error: ${error}` : output}
            placeholder="Resultados aparecerán aquí..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default App;
