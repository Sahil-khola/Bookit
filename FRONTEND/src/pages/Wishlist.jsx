import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaTimes, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

const Wishlist = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [user, navigate]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/wishlist');
            setWishlist(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (eventId) => {
        try {
            await api.delete(`/wishlist/${eventId}`);
            setWishlist((prev) => prev.filter((event) => event._id !== eventId));
        } catch (error) {
            console.error('Error removing wishlist item:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-xl font-semibold">Loading wishlist...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3"><FaHeart className="text-red-500" /> My Wishlist</h1>
                    <p className="text-gray-500 mt-2">Save events you want to revisit or book later.</p>
                </div>
                <Link to="/" className="text-gray-900 hover:text-gray-700 font-semibold">Browse Events</Link>
            </div>

            {wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaHeart className="text-red-300 text-3xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-6">Add events to your wishlist so you can find them again later.</p>
                    <Link to="/" className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition">Browse Events</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((event) => (
                        <div key={event._id} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="relative h-56 bg-gray-200 overflow-hidden">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-3xl font-bold">
                                        {event.category || 'Event'}
                                    </div>
                                )}
                                <button
                                    onClick={() => removeItem(event._id)}
                                    className="absolute top-4 right-4 rounded-full bg-white/90 p-3 shadow-sm hover:bg-white"
                                    aria-label="Remove from wishlist"
                                >
                                    <FaTimes className="text-gray-600" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">{event.category}</span>
                                    <span className="text-sm font-semibold text-gray-900">{event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h2>
                                <p className="text-gray-500 text-sm mb-5 line-clamp-3">{event.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm mb-6">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <Link
                                    to={`/events/${event._id}`}
                                    className="inline-flex items-center justify-center w-full rounded-full bg-gray-900 text-white py-3 font-semibold transition hover:bg-black"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
