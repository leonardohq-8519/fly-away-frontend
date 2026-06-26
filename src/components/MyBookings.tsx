import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import api from "../api";

const MyBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            setError(null);

            const savedBookingsIds = JSON.parse(localStorage.getItem('myBookingIds')|| '[]');

            if (savedBookingsIds.lenght === 0){
                setBookings([]);
                setLoading(false);
                return;
            }

            const bookingPromises = savedBookingsIds.map((bookingID : number) => api.get(`/flights/book/${bookingID}`).then(res => res.data)
                .catch(err => {
                    console.warn(`Reserva #${bookingID} no encontrada. El servidor pudo haberse reiniciado.`);
                    return null; 
                })
            );

            const responses = await Promise.all(bookingPromises);
        
            const validBookings = responses.filter(booking => booking !== null);

            const validBookingIds = validBookings.map(b => b.id);
            localStorage.setItem('myBookingIds', JSON.stringify(validBookingIds));

            setBookings(validBookings);

        } catch (err : any){
            console.error("Error en el flujo de reservas", err);
            setError('Hubo un error al cargar tus reservas. Asegúrate de haber iniciado sesión.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando tus reservas...</div>;

    return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Mis Reservas</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!error && bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>Aún no tienes ningún vuelo reservado.</p>
          <Link to="/search" style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            padding: '0.6rem 1.2rem', 
            background: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}>
            Buscar Vuelos
          </Link>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.5rem' }}>ID Reserva</th>
              <th style={{ padding: '0.5rem' }}>Vuelo</th>
              <th style={{ padding: '0.5rem' }}>Aerolínea</th>
              <th style={{ padding: '0.5rem' }}>Salida</th>
              <th style={{ padding: '0.5rem' }}>Fecha de Transacción</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id || Math.random()} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>#{booking.id}</td>
                <td style={{ padding: '0.5rem' }}>{booking.flightNumber}</td>
                <td style={{ padding: '0.5rem' }}>{booking.airlineName}</td>
                <td style={{ padding: '0.5rem' }}>{booking.estDepartureTime ? new Date(booking.estDepartureTime).toLocaleString() : 'N/A'}</td>
                <td style={{ padding: '0.5rem' }}>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;