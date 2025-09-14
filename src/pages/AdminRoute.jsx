import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Zap, ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import tedxLogo from '../../assets/tedxDYPDPU_logo.jpg';
import { useNavigate } from "react-router-dom";

 const SOCKET_URL = 'http://localhost:3000';
// const SOCKET_URL = 'https://tedx-dypdit-portal-backend.onrender.com';

const ADMIN_PASSWORD = "tedx2025"; // Change this to your desired password

const AdminPortal = ({ onBack }) => {
  const [ticketsSold, setTicketsSold] = useState(0);
  const [paymentEntries, setPaymentEntries] = useState([]);
  const [registrationEntries, setRegistrationEntries] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [data, setData] = useState({ ticketsSold: 0, paymentEntries: [], registrationEntries: [], tempRegistrationUnmatched: [] });
 const [authenticated, setAuthenticated] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // 👈 Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);  // 👈 Modal state
 
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const connectSocket = () => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });

    socketRef.current.on('connect', () => console.log('✅ WebSocket Connected', socketRef.current.id));
    socketRef.current.on('connect_error', (err) => console.error('❌ Connect Error:', err));
    socketRef.current.on('queue_update', (data) => { console.log('Queue Update:', data); setData(data); });
    resetIdleTimeout();
  };

  const resetIdleTimeout = () => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      console.log('Closing idle socket...');
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }, 60000);
  };

  useEffect(() => {
    connectSocket();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      clearTimeout(idleTimeoutRef.current);
    };
  }, []);

 useEffect(() => {
  if (data) {
    setTicketsSold(data.ticketsSold || 0);
    setPaymentEntries(Array.isArray(data.paymentEntries) ? data.paymentEntries : []);
    setRegistrationEntries(Array.isArray(data.registrationEntries) ? data.registrationEntries : []);
    setPendingStudents(Array.isArray(data.tempRegistrationUnmatched) ? data.tempRegistrationUnmatched : []);
  }
}, [data]);

  const handleApprove = (id) => setPendingStudents((prev) => prev.filter((s) => s.id !== id));
  const handleRemove = (id) => setPendingStudents((prev) => prev.filter((s) => s.id !== id));
  const handleMatch = () => alert('Matching Process Started!');
  const openModal = (item) => { setSelectedItem(item); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,175,55,0.9)';
        ctx.shadowColor = 'rgba(212,175,55,0.7)';
        ctx.shadowBlur = 8;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
    };

    const animate = () => {
      drawParticles();
      updateParticles();
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

    if (!authenticated) {
      const pwd = window.prompt("Enter admin password:");
      if (pwd === ADMIN_PASSWORD) {
        setAuthenticated(true);
      } else {
        alert("Incorrect password!");
        navigate("/");
      }
      return null;
    }
  }
  return (
    <div className="relative min-h-screen bg-black text-white font-inter overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => { if (socketRef.current) socketRef.current.disconnect(); navigate("/"); }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Gold Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-center mb-6 relative z-30">
          <motion.img
            src={tedxLogo}
            alt="TEDx Logo"
            className="h-16 rounded-lg shadow-lg ring-2 ring-red-600 drop-shadow-[0_0_25px_rgba(230,43,30,0.9)]"
            animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="Payment Entries" data={paymentEntries} onRefClick={openModal} />
          <Section title="Registration Entries" data={registrationEntries} onRefClick={openModal} />
        </div>

        <div className="bg-[#121212]/80 rounded-lg shadow-lg p-8 text-center border border-red-500/50 backdrop-blur-md">
          <div className="flex items-center justify-center gap-4">
            <Ticket className="text-red-500" size={48} />
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No. of Tickets Sold</h3>
              <motion.div
                className="text-5xl font-bold text-[#D4AF37]"
                key={ticketsSold}
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {ticketsSold}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-[#121212]/80 rounded-lg shadow-lg p-6 border border-red-500/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#D4AF37]">Pending Approvals</h2>
            <button
              onClick={handleMatch}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Zap size={18} /> Match
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {pendingStudents.map((student, index) => (
                <PendingCard
                  key={student.id || index}
                  student={student}
                  onApprove={() => handleApprove(student.id)}
                  onRemove={() => handleRemove(student.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] text-white max-w-2xl w-full rounded-lg shadow-lg relative p-6 overflow-y-auto max-h-[80vh]">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-4">Entry Details</h3>
            <pre className="text-sm bg-black/60 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const Section = ({ title, data, onRefClick }) => (
  <div className="bg-[#121212]/80 rounded-lg shadow-lg p-6 border border-red-500/40 backdrop-blur-md">
    <h2 className="text-xl font-bold text-[#D4AF37] mb-4">{title}</h2>
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
      {data.map((item, index) => (
        <button
          key={item.id || index}
          onClick={() => onRefClick(item)}
          className="bg-black border border-[#D4AF37] rounded-lg p-3 text-center hover:scale-105 transform transition"
        >
          <span className="text-sm font-medium text-white">{item.refNo || item.id || 'N/A'}</span>
        </button>
      ))}
    </div>
  </div>
);

const PendingCard = ({ student, onApprove, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="bg-black/90 border border-[#D4AF37] rounded-lg p-4 min-w-[280px] shadow-md hover:shadow-[#D4AF37]/50 transition"
  >
    <p className="font-medium text-white">{student.name}</p>
    <p className="text-sm text-gray-300">{student.phone}</p>
    <p className="text-xs text-yellow-400 font-medium">Status: Pending</p>
    <div className="flex gap-2 mt-3">
      <button
        onClick={onApprove}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
      >
        Approve
      </button>
      <button
        onClick={onRemove}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
      >
        Remove
      </button>
    </div>
  </motion.div>
);

export default AdminPortal;