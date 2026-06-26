import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api";

interface Flight {
    id: number; 
    airlineName: string;
    flightNumber: string;
    estDepartureTime: string;
    estArrivalTime: string;
    availableSeats: number;
}

const Search = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useState({
        flightNumber: '',
        airlineName: '',
        estDepartureTimeFrom: '',
        estDepartureTimeTo: ''
    });

    const [flights, setFlights] = useState<Flight[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingMessage, setBookingMessage] = useState<{type : 'success' | 'error', text : string, bookingId?: number} | null>(null);

    const [bookingDetails, setBookingDetails] = useState<any>(null);

    useEffect(() => {
        fetchFlights({});
    }, []);

    const getFormattedParams = () => {
        const activeParams: any = {};
        
        if (searchParams.flightNumber) activeParams.flightNumber = searchParams.flightNumber;
        if (searchParams.airlineName) activeParams.airlineName = searchParams.airlineName;
        
        // Conversión de fechas a formato ISO-8601
        if (searchParams.estDepartureTimeFrom) {
        activeParams.estDepartureTimeFrom = new Date(searchParams.estDepartureTimeFrom).toISOString();
        }
        if (searchParams.estDepartureTimeTo) {
        activeParams.estDepartureTimeTo = new Date(searchParams.estDepartureTimeTo).toISOString();
        }
        
        return activeParams;
    };

    const fetchFlights = async (params : any) => {
        setError(null);
        try{
            const response = await api.get('/flights/search', {params});
            const flightsFound = response.data.items || [];
            setFlights(flightsFound);
            setHasSearched(true);
        }catch (err){
            console.error(err);
            setError('Hubo un error al buscar los vuelos');
        }
    }

    const fetchBookDetails = async (id : number) => {
        try {
            const response = await api.get(`/flights/book/${id}`);
            setBookingDetails(response.data);
        } catch (error) {
            console.error("Error al obtener los datos de reserva.");
        }
    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({
            ...searchParams,
            [e.target.name] : e.target.value
        });
    }

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        fetchFlights(getFormattedParams());
    }

    const handleBook = async (flightId : number) => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setBookingMessage(null);
        setBookingDetails(null);

        try {
            const response = await api.post('/flights/book', {flightId});

            const newBookingId = response.data.id;

            const savedBookings = JSON.parse(localStorage.getItem('myBookingIds') || '[]');
            if (!savedBookings.includes(newBookingId)) {
                savedBookings.push(newBookingId);
                localStorage.setItem('myBookingIds', JSON.stringify(savedBookings));
            }

            setBookingMessage({type : 'success', text: '¡Vuelo reservado con exito!', bookingId : newBookingId});

            fetchFlights(getFormattedParams());

        } catch (err : any){
            console.error(err);
            const errorData = err.response?.data;

            if (err.response?.status === 401){
                setBookingMessage({type : 'error', text : 'Debes iniciar sesion para reservar un vuelo.'});
            } else if (errorData?.detail){
                setBookingMessage({type : 'error', text : errorData.detail});
            } else if (errorData?.message){
                setBookingMessage({type : 'error', text : errorData.message});
            } else {
                setBookingMessage({type : 'error', text: 'Error inesperado al procesar la reserva'});
            }
        }
    };

    return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Búsqueda de Vuelos</h2>

      {/* Formulario de Búsqueda */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div>
          <label>Nº de Vuelo (ej. LA123):</label><br />
          <input 
            type="text" 
            name="flightNumber" 
            value={searchParams.flightNumber} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Aerolínea (ej. LATAM):</label><br />
          <input 
            type="text" 
            name="airlineName" 
            value={searchParams.airlineName} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Salida desde:</label><br />
          <input 
            type="datetime-local" 
            name="estDepartureTimeFrom" 
            value={searchParams.estDepartureTimeFrom} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Salida hasta:</label><br />
          <input 
            type="datetime-local" 
            name="estDepartureTimeTo" 
            value={searchParams.estDepartureTimeTo} 
            onChange={handleChange} 
          />
        </div>
        <button type="submit" style={{ padding: '0.4rem 1rem' }}>Buscar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bookingMessage && (
            <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                background: bookingMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                color : bookingMessage.type === 'success' ? '#155724' : '#721c24',
                display : 'flex',
                justifyContent : 'space-between',
                alignItems : 'center'
            }}>
                <span>{bookingMessage.text}</span>
                {bookingMessage.type === 'success' && bookingMessage.bookingId && (
                    <button 
                        onClick={() => fetchBookDetails(bookingMessage.bookingId!)}
                        style={{
                            padding: '0.3rem 0.8rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            border: '1px solid #155724',
                            background: 'transparent',
                            color: '#155724',
                            fontWeight: 'bold'
                        }}
                    >
                        Ver detalles
                    </button>
                )}
            </div>
      )}

      {bookingDetails && (
        <div style={{ padding: '1rem', background: '#f4f4f4', marginBottom: '2rem', borderLeft: '4px solid #007bff', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0 }}>Ticket de Reserva #{bookingDetails.id}</h3>
          <p><strong>Pasajero:</strong> {bookingDetails.customerFirstName} {bookingDetails.customerLastName}</p>
          <p><strong>Vuelo:</strong> {bookingDetails.flightNumber} ({bookingDetails.airlineName})</p>
          <p><strong>Salida:</strong> {new Date(bookingDetails.estDepartureTime).toLocaleString()}</p>
          <p><strong>Llegada:</strong> {new Date(bookingDetails.estArrivalTime).toLocaleString()}</p>
          <p><strong>Fecha de transacción:</strong> {new Date(bookingDetails.bookingDate).toLocaleString()}</p>
        </div>
      )}

      {/* Tabla de Resultados */}
      {hasSearched && flights.length === 0 ? (
        <p>No se encontraron vuelos con esos criterios.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.5rem' }}>Aerolínea</th>
              <th style={{ padding: '0.5rem' }}>Vuelo</th>
              <th style={{ padding: '0.5rem' }}>Salida</th>
              <th style={{ padding: '0.5rem' }}>Llegada</th>
              <th style={{ padding: '0.5rem' }}>Asientos</th>
              <th style={{ padding: '0.5rem' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>{flight.airlineName}</td>
                <td style={{ padding: '0.5rem' }}>{flight.flightNumber}</td>
                <td style={{ padding: '0.5rem' }}>{new Date(flight.estDepartureTime).toLocaleString()}</td>
                <td style={{ padding: '0.5rem' }}>{new Date(flight.estArrivalTime).toLocaleString()}</td>
                <td style={{ padding: '0.5rem' }}>{flight.availableSeats}</td>
                <td style={{ padding: '0.5rem' }}>
                  {/* Aquí irá el botón de reservar del Hito 4 */}
                  <button 
                    onClick={() => handleBook(flight.id)}
                    disabled={flight.availableSeats === 0}
                    style={{
                        padding: '0.3rem 0.6rem',
                        cursor: flight.availableSeats === 0 ? 'not-allowed' : 'pointer',
                        background: flight.availableSeats === 0 ? '#ccc' : '#007bff',
                        color : 'white',
                        border : 'none',
                        borderRadius : '4px'
                    }}
                  >
                    {flight.availableSeats === 0 ? 'Agotado' : 'Reservar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Search;