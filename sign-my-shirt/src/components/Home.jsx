// src/components/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShirt } from '../firebase/hooks';

const Home = () => {
  const [ownerName, setOwnerName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [graduationYear, setGraduationYear] = useState(2025);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!ownerName.trim() || creating) return;
    
    setCreating(true);
    try {
      const shirtId = await createShirt(
        ownerName.trim(),
        graduationYear,
        schoolName.trim()
      );
      navigate(`/shirt/${shirtId}`);
    } catch (err) {
      console.error('Error creating shirt:', err);
      alert('Bir hata oluştu. Lütfen tekrar dene.');
      setCreating(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif",
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Permanent+Marker&family=Poppins:wght@300;400;500;600;700&display=swap');
          
          * { box-sizing: border-box; }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
          }
          
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .input-field {
            transition: all 0.2s ease;
          }
          
          .input-field:focus {
            border-color: #FFD93D !important;
            box-shadow: 0 0 0 3px rgba(255, 217, 61, 0.3);
          }
          
          .create-btn {
            transition: all 0.3s ease;
          }
          
          .create-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255, 217, 61, 0.5);
          }
          
          .create-btn:active:not(:disabled) {
            transform: translateY(-1px);
          }
        `}
      </style>

      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '30px',
        padding: '50px 40px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        animation: 'fadeInUp 0.6s ease',
      }}>
        {/* Logo / Icon */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '15px',
            animation: 'float 4s ease-in-out infinite',
          }}>
            👕
          </div>
          <h1 style={{
            fontFamily: "'Permanent Marker', cursive",
            fontSize: '2.5rem',
            color: '#2D3748',
            marginBottom: '10px',
          }}>
            Sign My Shirt
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '1rem',
            lineHeight: '1.5',
          }}>
            Dijital mezuniyet gömleğini oluştur,<br/>
            arkadaşlarınla paylaş!
          </p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4A5568',
            fontWeight: '500',
            fontSize: '0.9rem',
          }}>
            Senin İsmin *
          </label>
          <input
            type="text"
            placeholder="Örn: Deniz"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            maxLength={20}
            className="input-field"
            style={{
              width: '100%',
              padding: '16px 18px',
              fontSize: '1.1rem',
              fontFamily: "'Poppins', sans-serif",
              border: '2px solid #E2E8F0',
              borderRadius: '15px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4A5568',
            fontWeight: '500',
            fontSize: '0.9rem',
          }}>
            Okul Adı (opsiyonel)
          </label>
          <input
            type="text"
            placeholder="Örn: Kadıköy Anadolu Lisesi"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            maxLength={50}
            className="input-field"
            style={{
              width: '100%',
              padding: '16px 18px',
              fontSize: '1.1rem',
              fontFamily: "'Poppins', sans-serif",
              border: '2px solid #E2E8F0',
              borderRadius: '15px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '35px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#4A5568',
            fontWeight: '500',
            fontSize: '0.9rem',
          }}>
            Mezuniyet Yılı
          </label>
          <select
            value={graduationYear}
            onChange={(e) => setGraduationYear(Number(e.target.value))}
            className="input-field"
            style={{
              width: '100%',
              padding: '16px 18px',
              fontSize: '1.1rem',
              fontFamily: "'Poppins', sans-serif",
              border: '2px solid #E2E8F0',
              borderRadius: '15px',
              outline: 'none',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={!ownerName.trim() || creating}
          className="create-btn"
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: ownerName.trim() && !creating ? '#1a365d' : '#A0AEC0',
            background: ownerName.trim() && !creating
              ? 'linear-gradient(135deg, #FFE066 0%, #FFD93D 100%)'
              : '#EDF2F7',
            border: 'none',
            borderRadius: '15px',
            cursor: ownerName.trim() && !creating ? 'pointer' : 'not-allowed',
            boxShadow: ownerName.trim() && !creating
              ? '0 6px 20px rgba(255, 217, 61, 0.4)'
              : 'none',
          }}
        >
          {creating ? (
            <>⏳ Oluşturuluyor...</>
          ) : (
            <>✨ Gömleğimi Oluştur</>
          )}
        </button>

        {/* Info */}
        <p style={{
          textAlign: 'center',
          color: '#A0AEC0',
          fontSize: '0.85rem',
          marginTop: '25px',
          lineHeight: '1.6',
        }}>
          Gömleğini oluşturduktan sonra linki<br/>
          arkadaşlarınla paylaşabilirsin 🎓
        </p>
      </div>
    </div>
  );
};

export default Home;
