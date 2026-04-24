import { useState, useEffect } from "react";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [pushup, setPushup] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // SOLUCIÓN AL ERROR: El puerto se cambió de 3000 a 4000
    fetch("http://localhost:4000/dashboard", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if(!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => {
        console.log("Dashboard JSON (Abisai Ruiz):", data);
        setMessage(data.message);
      })
      .catch(error => console.error("Error en Dashboard (Abisai Ruiz):", error));
  }, []);

  const addComment = () => {
    // Sigue manteniendo el dangerouslySetInnerHTML como ejemplo de XSS
    setComments([...comments, comment]);
    setComment("");
  };

  // Función para activar el Pushup (Popup) mostrando el token
  const simularRoboToken = () => {
    const token = localStorage.getItem("token") || "No hay token disponible";
    const alertMessage = `Token interceptado: ${token.substring(0, 20)}...`;
    
    console.warn("ALERTA DE SEGURIDAD (Abisai Ruiz):", alertMessage);
    
    setPushup(alertMessage);
    
    // El pushup desaparece después de 4 segundos
    setTimeout(() => {
      setPushup(null);
    }, 10000);
  };

  return (
    <div className="dashboard-container">
      {/* Componente del Pushup */}
      {pushup && (
        <div className="pushup-notification">
          <strong style={{ color: '#f97316' }}>⚠️ Abisai Ruiz - Alerta de Sistema</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>{pushup}</p>
        </div>
      )}

      <div className="card" style={{ maxWidth: '100%' }}>
        <h2 className="title">{message || "Panel de Control"}</h2>
        
        {/* Botón para simular el ataque XSS y ver el Pushup */}
        <button 
          onClick={simularRoboToken} 
          style={{ backgroundColor: '#1f2937', marginBottom: '2rem' }}
        >
          Ejecutar Script Malicioso (Robar Token)
        </button>

        <div style={{ marginTop: '1rem', borderTop: '1px solid #d1d5db', paddingTop: '2rem' }}>
          <h3 style={{ textAlign: 'left', color: '#4b5563' }}>Foro de comentarios</h3>
          
          <div className="comment-box">
            <input
              placeholder="Escribe un comentario HTML (ej. <b>Hola</b>)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button onClick={addComment}>Publicar</button>
          </div>

          <div>
            {comments.map((c, i) => (
              <div 
                key={i} 
                className="comment-item"
                dangerouslySetInnerHTML={{ __html: c }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;