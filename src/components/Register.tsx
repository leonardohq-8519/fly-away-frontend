import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.email || !formData.firstName || !formData.lastName ||!formData.password){
            setError('Todos los campos deben ser llenados.')
            return;
        }

        try{
            await api.post('/users/register', formData);

            setSuccess('Registro completado!');
            setTimeout(() => {
                navigate('/login');
            },2000);
        } catch(err : any){
            console.log("Respuesta de error del backend:", err.response?.data);
            const errorData = err.response?.data;
            
            if (errorData?.detail) {
                setError(errorData.detail);
            } else if (errorData?.message) {
                const rawMessage = errorData.message;
                setError(rawMessage);
            } else {
                if (typeof errorData === 'string' && errorData.includes("on field 'password'")) {
                    setError('La contraseña debe tener al menos 8 caracteres.');
                }
                else {
                    setError('Ocurrió un error en el registro. Intente de nuevo.');
                }
            }
        }
    }

    return(
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Registro de Usuario</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label>Nombre:</label><br />
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label>Apellido:</label><br />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ width: '100%' }} />
        </div>
        <div>
          <label>Contraseña:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ width: '100%' }} />
        </div>
        
        <button type="submit" style={{ padding: '0.5rem', marginTop: '1rem' }}>
          Registrarse
        </button>
      </form>
    </div>
  );
};
export default Register;