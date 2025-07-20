import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Check, X, Zap,ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import tedxLogo from '../../assets/tedxDYPDPU_logo.jpg';

const AdminPortal = ({ onBack }) => {
  const [ticketsSold, setTicketsSold] = useState(1000);
  const canvasRef = useRef(null);

  // Mock Data
  const [paymentEntries] = useState([
    { id: 'TXN001' }, { id: 'TXN002' }, { id: 'TXN003' }, { id: 'TXN004' },
    { id: 'TXN005' }, { id: 'TXN006' }, { id: 'TXN007' }, { id: 'TXN008' },
  ]);
  const [registrationEntries] = useState([
    { id: 'REG123' }, { id: 'REG456' }, { id: 'REG789' }, { id: 'REG101' },
    { id: 'REG202' }, { id: 'REG303' }, { id: 'REG404' }, { id: 'REG505' },
  ]);
  const [pendingStudents, setPendingStudents] = useState([
    { id: 1, name: "John Smith", phone: "123-456-7890" },
    { id: 2, name: "Emily Johnson", phone: "234-567-8901" },
    { id: 3, name: "Michael Brown", phone: "345-678-9012" },
    { id: 4, name: "Sarah Davis", phone: "456-789-0123" },
  ]);

  // Animate ticket count
  useEffect(() => {
    const interval = setInterval(() => {
      setTicketsSold(prev => prev + Math.floor(Math.random() * 10) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id) => setPendingStudents(prev => prev.filter(student => student.id !== id));
  const handleRemove = (id) => setPendingStudents(prev => prev.filter(student => student.id !== id));
  const handleMatch = () => alert("Matching Process Started!");

  // Gold Particle Background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
        dy: (Math.random() - 0.5) * 0.5
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212,175,55,0.9)";
        ctx.shadowColor = "rgba(212,175,55,0.7)";
        ctx.shadowBlur = 8;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      particles.forEach(p => {
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

  return (
    <div className="relative min-h-screen bg-black text-white font-inter overflow-hidden">
      
    {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
      
      
      {/* Gold Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto p-6 space-y-8">
        {/* Floating TEDx Logo */}
        <div className="flex justify-center mb-6 relative z-30">
          <motion.img
            src={tedxLogo}
            alt="TEDx Logo"
            className="h-16 rounded-lg shadow-lg ring-2 ring-red-600 drop-shadow-[0_0_25px_rgba(230,43,30,0.9)]"
            animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="Payment Entries" data={paymentEntries} />
          <Section title="Registration Entries" data={registrationEntries} />
        </div>

        {/* Tickets Counter */}
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

        {/* Pending Students */}
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
              {pendingStudents.map(student => (
                <PendingCard
                  key={student.id}
                  student={student}
                  onApprove={() => handleApprove(student.id)}
                  onRemove={() => handleRemove(student.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const Section = ({ title, data }) => (
  <div className="bg-[#121212]/80 rounded-lg shadow-lg p-6 border border-red-500/40 backdrop-blur-md">
    <h2 className="text-xl font-bold text-[#D4AF37] mb-4">{title}</h2>
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
      {data.map(item => (
        <div
          key={item.id}
          className="bg-black border border-[#D4AF37] rounded-lg p-3 text-center hover:scale-105 transform transition"
        >
          <span className="text-sm font-medium text-white">{item.id}</span>
        </div>
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
      <button onClick={onApprove} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg">Approve</button>
      <button onClick={onRemove} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">Remove</button>
    </div>
  </motion.div>
);

export default AdminPortal;
