import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      console.log("STATUS (Abisai Ruiz):", res.status);

      const text = await res.text();
      console.log("RESPUESTA RAW (Abisai Ruiz):", text);

      if (!res.ok) {
        throw new Error("Error de login");
      }

      const data = JSON.parse(text);
      console.log("RESPUESTA JSON (Abisai Ruiz):", data);
      
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); 

    } catch (error) {
      console.error("Error al conectar con el servidor (Abisai Ruiz):", error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Iniciar Sesión</h2>
        <div className="input-group">
          <input 
            placeholder="Usuario" 
            onChange={e => setUsername(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Contraseña" 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );
}

export default Login;