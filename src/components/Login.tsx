import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Login = ({ onLoginSuccess }: { onLoginSuccess?: () => void }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email : '',
        password : '',
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email || !formData.password){
            setError('Ingrese su correo y contraseña');
            return;
        }

        try{
            const response = await api.post('/auth/login', formData);
            
            localStorage.setItem('token', response.data.token);

            if (onLoginSuccess) {
                onLoginSuccess();
            }

            navigate('/search');
        } catch (err:any){
            if (err.response?.data?.detail){
                setError(err.respose.data.detail);
            } else {
                setError('Error inenesperado al iniciar sesión. Verifique el estado del servidor');
            }
        }
    };

    return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Email:</label><br />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            style={{ width: '100%' }} 
          />
        </div>
        <div>
          <label>Contraseña:</label><br />
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            style={{ width: '100%' }} 
          />
        </div>
        
        <button type="submit" style={{ padding: '0.5rem', marginTop: '1rem' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;