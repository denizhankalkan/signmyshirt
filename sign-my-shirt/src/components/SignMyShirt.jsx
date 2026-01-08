// src/components/SignMyShirt.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useShirt, useSignatures, addSignature, updateSignaturePosition } from '../firebase/hooks';

const SignMyShirt = () => {
  const { shirtId } = useParams();
  const { shirt, loading: shirtLoading } = useShirt(shirtId);
  const { signatures, loading: sigsLoading } = useSignatures(shirtId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1a365d');
  const [showCopied, setShowCopied] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const shirtRef = useRef(null);

  const colors = [
    '#1a365d', // Lacivert
    '#c53030', // Kırmızı
    '#2f855a', // Yeşil
    '#6b46c1', // Mor
    '#dd6b20', // Turuncu
    '#2b6cb0', // Mavi
    '#d53f8c', // Pembe
    '#1a202c', // Siyah
  ];

  // Drag handlers
  const handleMouseDown = (e, sig) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggingId(sig.id);
  };

  const handleTouchStart = (e, sig) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setDraggingId(sig.id);
  };

  const handleMouseMove = (e) => {
    if (!draggingId || !shirtRef.current) return;
    
    const shirtRect = shirtRef.current.getBoundingClientRect();
    const x = ((e.clientX - shirtRect.left - dragOffset.x) / shirtRect.width) * 100;
    const y = ((e.clientY - shirtRect.top - dragOffset.y) / shirtRect.height) * 100;
    
    // Local güncelleme (görsel feedback için)
    const noteEl = document.getElementById(`sig-${draggingId}`);
    if (noteEl) {
      noteEl.style.left = `${Math.max(2, Math.min(88, x))}%`;
      noteEl.style.top = `${Math.max(2, Math.min(85, y))}%`;
    }
  };

  const handleTouchMove = (e) => {
    if (!draggingId || !shirtRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const shirtRect = shirtRef.current.getBoundingClientRect();
    const x = ((touch.clientX - shirtRect.left - dragOffset.x) / shirtRect.width) * 100;
    const y = ((touch.clientY - shirtRect.top - dragOffset.y) / shirtRect.height) * 100;
    
    const noteEl = document.getElementById(`sig-${draggingId}`);
    if (noteEl) {
      noteEl.style.left = `${Math.max(2, Math.min(88, x))}%`;
      noteEl.style.top = `${Math.max(2, Math.min(85, y))}%`;
    }
  };

  const handleMouseUp = async () => {
    if (draggingId && shirtRef.current) {
      const noteEl = document.getElementById(`sig-${draggingId}`);
      if (noteEl) {
        const x = parseFloat(noteEl.style.left);
        const y = parseFloat(noteEl.style.top);
        await updateSignaturePosition(shirtId, draggingId, x, y);
      }
    }
    setDraggingId(null);
  };

  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [draggingId, dragOffset]);

  const handleAddSignature = async () => {
    if (!newMessage.trim() || !newAuthor.trim() || saving) return;
    
    setSaving(true);
    try {
      await addSignature(shirtId, {
        text: newMessage.trim(),
        author: newAuthor.trim(),
        color: selectedColor,
        x: 25 + Math.random() * 40,
        y: 25 + Math.random() * 35,
        rotation: (Math.random() - 0.5) * 10,
      });
      
      setNewMessage('');
      setNewAuthor('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error adding signature:', err);
      alert('Bir hata oluştu. Lütfen tekrar dene.');
    }
    setSaving(false);
  };

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2500);
  };

  if (shirtLoading || sigsLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fef9e7 0%, #fdeaa8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f0c14b',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{ color: '#5d4e37', fontSize: '1.1rem' }}>Gömlek yükleniyor...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!shirt) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fef9e7 0%, #fdeaa8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Poppins', sans-serif",
        padding: '20px',
      }}>
        <div style={{ 
          textAlign: 'center', 
          background: 'white', 
          padding: '40px', 
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>😕</h1>
          <h2 style={{ color: '#5d4e37', marginBottom: '10px' }}>Gömlek Bulunamadı</h2>
          <p style={{ color: '#888' }}>Bu link geçersiz veya gömlek silinmiş olabilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f5f0e6 0%, #e8e0d0 100%)',
      fontFamily: "'Caveat', cursive",
      padding: '15px',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Permanent+Marker&family=Poppins:wght@300;400;500;600;700&family=Patrick+Hand&display=swap');
          
          * { box-sizing: border-box; }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-5px) rotate(1deg); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
            to { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .signature-note {
            transition: box-shadow 0.2s ease, transform 0.1s ease;
            touch-action: none;
          }
          
          .signature-note:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
            z-index: 100 !important;
          }
          
          .signature-note.dragging {
            z-index: 1000 !important;
            cursor: grabbing !important;
            transform: scale(1.08) !important;
            box-shadow: 0 12px 35px rgba(0,0,0,0.35) !important;
          }
          
          .btn-action {
            transition: all 0.25s ease;
          }
          
          .btn-action:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          }
          
          .btn-action:active {
            transform: translateY(-1px);
          }
        `}
      </style>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '10px',
        animation: 'fadeIn 0.6s ease',
      }}>
        <h1 style={{
          fontFamily: "'Permanent Marker', cursive",
          fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
          color: '#2d3748',
          marginBottom: '5px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        }}>
          ✍️ {shirt.ownerName}'in Gömleği
        </h1>
        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '0.95rem',
          color: '#718096',
          fontWeight: '400',
        }}>
          {shirt.schoolName && `${shirt.schoolName} • `}Mezuniyet {shirt.graduationYear}
        </p>
      </div>

      {/* Shirt Container - Full Width */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: '15px',
      }}>
        <div 
          ref={shirtRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '750px',
            animation: 'float 8s ease-in-out infinite',
          }}
        >
          {/* Hanger Line */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '-10%',
            right: '-10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #888 20%, #888 80%, transparent)',
            zIndex: 1,
          }} />

          {/* Shirt SVG */}
          <svg 
            viewBox="0 0 500 580" 
            style={{ 
              width: '100%', 
              height: 'auto',
              filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.15))',
            }}
          >
            <defs>
              {/* Açık sarı kumaş gradient */}
              <linearGradient id="shirtFabric" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8DC" />
                <stop offset="30%" stopColor="#FFEEB3" />
                <stop offset="70%" stopColor="#FFE58F" />
                <stop offset="100%" stopColor="#FFD966" />
              </linearGradient>
              
              {/* Gölge için */}
              <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.08)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.02)" />
              </linearGradient>
              
              {/* Kumaş dokusu */}
              <pattern id="fabricTexture" patternUnits="userSpaceOnUse" width="6" height="6">
                <rect width="6" height="6" fill="transparent"/>
                <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5"/>
                <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5"/>
              </pattern>
            </defs>

            {/* Hanger / Askı */}
            <path
              d="M 245 0 
                 Q 245 15, 250 20
                 Q 255 15, 255 0"
              fill="none"
              stroke="#666"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M 250 20
                 L 250 35
                 Q 200 40, 150 55
                 M 250 35
                 Q 300 40, 350 55"
              fill="none"
              stroke="#555"
              strokeWidth="4"
              strokeLinecap="round"
            />
            
            {/* Sol Kol - Uzun */}
            <path
              d="M 60 80 
                 Q 20 120, 15 200
                 Q 10 280, 20 360
                 L 25 420
                 Q 30 435, 55 440
                 Q 75 438, 80 425
                 L 85 365
                 Q 90 300, 95 220
                 Q 100 160, 120 110
                 Z"
              fill="url(#shirtFabric)"
              stroke="#D4A84B"
              strokeWidth="1.5"
            />
            <path
              d="M 60 80 Q 20 120, 15 200 Q 10 280, 20 360 L 25 420 Q 30 435, 55 440 Q 75 438, 80 425 L 85 365 Q 90 300, 95 220 Q 100 160, 120 110 Z"
              fill="url(#fabricTexture)"
            />
            {/* Sol kol manşet */}
            <path
              d="M 20 410 Q 25 430, 55 435 Q 80 432, 85 415"
              fill="none"
              stroke="#C9A227"
              strokeWidth="2"
            />
            <path
              d="M 22 400 Q 50 405, 82 398"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
            />
            
            {/* Sağ Kol - Uzun */}
            <path
              d="M 440 80 
                 Q 480 120, 485 200
                 Q 490 280, 480 360
                 L 475 420
                 Q 470 435, 445 440
                 Q 425 438, 420 425
                 L 415 365
                 Q 410 300, 405 220
                 Q 400 160, 380 110
                 Z"
              fill="url(#shirtFabric)"
              stroke="#D4A84B"
              strokeWidth="1.5"
            />
            <path
              d="M 440 80 Q 480 120, 485 200 Q 490 280, 480 360 L 475 420 Q 470 435, 445 440 Q 425 438, 420 425 L 415 365 Q 410 300, 405 220 Q 400 160, 380 110 Z"
              fill="url(#fabricTexture)"
            />
            {/* Sağ kol manşet */}
            <path
              d="M 480 410 Q 475 430, 445 435 Q 420 432, 415 415"
              fill="none"
              stroke="#C9A227"
              strokeWidth="2"
            />
            <path
              d="M 478 400 Q 450 405, 418 398"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
            />
            
            {/* Ana Gövde */}
            <path
              d="M 120 110
                 Q 150 70, 200 55
                 L 215 55
                 Q 225 75, 250 85
                 Q 275 75, 285 55
                 L 300 55
                 Q 350 70, 380 110
                 L 405 220
                 Q 410 300, 405 400
                 L 400 520
                 Q 390 545, 250 550
                 Q 110 545, 100 520
                 L 95 400
                 Q 90 300, 95 220
                 Z"
              fill="url(#shirtFabric)"
              stroke="#D4A84B"
              strokeWidth="1.5"
            />
            <path
              d="M 120 110 Q 150 70, 200 55 L 215 55 Q 225 75, 250 85 Q 275 75, 285 55 L 300 55 Q 350 70, 380 110 L 405 220 Q 410 300, 405 400 L 400 520 Q 390 545, 250 550 Q 110 545, 100 520 L 95 400 Q 90 300, 95 220 Z"
              fill="url(#fabricTexture)"
            />
            
            {/* Yaka - Sol */}
            <path
              d="M 200 55
                 L 215 55
                 Q 220 70, 240 80
                 L 200 120
                 Q 175 100, 175 75
                 Q 180 60, 200 55"
              fill="#FFF8DC"
              stroke="#D4A84B"
              strokeWidth="1.5"
            />
            
            {/* Yaka - Sağ */}
            <path
              d="M 300 55
                 L 285 55
                 Q 280 70, 260 80
                 L 300 120
                 Q 325 100, 325 75
                 Q 320 60, 300 55"
              fill="#FFF8DC"
              stroke="#D4A84B"
              strokeWidth="1.5"
            />
            
            {/* Düğme placket çizgisi */}
            <line x1="250" y1="85" x2="250" y2="540" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="none"/>
            
            {/* Düğmeler */}
            {[130, 190, 250, 310, 370, 430, 490].map((y, i) => (
              <g key={i}>
                <circle cx="250" cy={y} r="6" fill="#F5E6C8" stroke="#D4A84B" strokeWidth="1"/>
                <circle cx="248" cy={y-1} r="1.5" fill="#C9A227"/>
                <circle cx="252" cy={y-1} r="1.5" fill="#C9A227"/>
                <circle cx="248" cy={y+2} r="1.5" fill="#C9A227"/>
                <circle cx="252" cy={y+2} r="1.5" fill="#C9A227"/>
              </g>
            ))}
            
            {/* Sol cep */}
            <path
              d="M 130 180 
                 L 130 240 
                 Q 130 250, 140 250
                 L 200 250
                 Q 210 250, 210 240
                 L 210 180"
              fill="none"
              stroke="#D4A84B"
              strokeWidth="1.5"
            />
            <line x1="130" y1="180" x2="210" y2="180" stroke="#D4A84B" strokeWidth="2"/>
            
            {/* Okul logosu alanı - Sağ göğüs */}
            {shirt.schoolLogo ? (
              <image 
                href={shirt.schoolLogo} 
                x="290" 
                y="160" 
                width="70" 
                height="70"
                style={{ opacity: 0.9 }}
              />
            ) : (
              <g>
                <rect x="295" y="165" width="60" height="60" rx="5" 
                      fill="rgba(0,0,0,0.03)" stroke="#D4A84B" strokeWidth="1" strokeDasharray="4,4"/>
                <text x="325" y="200" textAnchor="middle" fontSize="8" fill="#B8860B" fontFamily="Poppins">
                  OKUL
                </text>
                <text x="325" y="212" textAnchor="middle" fontSize="8" fill="#B8860B" fontFamily="Poppins">
                  LOGOSU
                </text>
              </g>
            )}
            
            {/* Kırışık/kıvrım detayları */}
            <path d="M 150 300 Q 170 310, 160 350" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2"/>
            <path d="M 350 280 Q 340 300, 345 340" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2"/>
            <path d="M 200 400 Q 250 410, 300 400" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="2"/>
            
            {/* Alt etek çizgisi */}
            <path
              d="M 100 530 Q 250 545, 400 530"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Signatures Layer */}
          <div style={{
            position: 'absolute',
            top: '8%',
            left: '5%',
            right: '5%',
            bottom: '5%',
          }}>
            {signatures.map((sig, index) => (
              <div
                key={sig.id}
                id={`sig-${sig.id}`}
                className={`signature-note ${draggingId === sig.id ? 'dragging' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, sig)}
                onTouchStart={(e) => handleTouchStart(e, sig)}
                style={{
                  position: 'absolute',
                  left: `${sig.x}%`,
                  top: `${sig.y}%`,
                  transform: `rotate(${sig.rotation || 0}deg)`,
                  maxWidth: '150px',
                  padding: '8px 10px',
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: '2px',
                  boxShadow: '2px 3px 8px rgba(0,0,0,0.15)',
                  cursor: draggingId === sig.id ? 'grabbing' : 'grab',
                  zIndex: draggingId === sig.id ? 1000 : 10 + index,
                  animation: `slideIn 0.4s ease ${index * 0.08}s both`,
                  borderLeft: `3px solid ${sig.color}`,
                }}
              >
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '0.9rem',
                  color: '#333',
                  lineHeight: '1.25',
                  fontFamily: "'Patrick Hand', cursive",
                }}>
                  {sig.text}
                </p>
                <p style={{
                  margin: '0',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: sig.color,
                  textAlign: 'right',
                  fontFamily: "'Permanent Marker', cursive",
                }}>
                  — {sig.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag hint */}
      <p style={{
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif",
        color: '#718096',
        fontSize: '0.85rem',
        marginBottom: '12px',
      }}>
        💡 Mesajları sürükleyerek taşıyabilirsin
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '15px',
      }}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-action"
          style={{
            padding: '14px 32px',
            fontSize: '1.1rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600',
            color: '#1a365d',
            background: 'linear-gradient(135deg, #FFE066 0%, #FFD93D 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 217, 61, 0.4)',
          }}
        >
          ✍️ İmzala
        </button>
        
        <button
          onClick={shareLink}
          className="btn-action"
          style={{
            padding: '14px 32px',
            fontSize: '1.1rem',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: '600',
            color: 'white',
            background: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(45, 55, 72, 0.3)',
          }}
        >
          {showCopied ? '✅ Link Kopyalandı!' : '🔗 Paylaş'}
        </button>
      </div>

      {/* Stats */}
      <div style={{
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif",
        color: '#4A5568',
        fontSize: '0.9rem',
      }}>
        <span style={{ 
          background: 'rgba(255,255,255,0.7)', 
          padding: '8px 20px', 
          borderRadius: '20px',
          display: 'inline-block',
        }}>
          💝 <strong>{signatures.length}</strong> imza
        </span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px',
        }}>
          <div style={{
            background: '#FFFEF5',
            borderRadius: '20px',
            padding: '30px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.25s ease',
          }}>
            <h2 style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: '1.6rem',
              color: '#2D3748',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              ✨ Gömleğe Yaz
            </h2>

            <textarea
              placeholder="Mesajını buraya yaz..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              maxLength={80}
              style={{
                width: '100%',
                minHeight: '90px',
                padding: '14px',
                fontSize: '1rem',
                fontFamily: "'Patrick Hand', cursive",
                border: '2px solid #E2E8F0',
                borderRadius: '12px',
                background: '#fff',
                color: '#333',
                outline: 'none',
                resize: 'none',
                marginBottom: '5px',
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD93D'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
            
            <div style={{
              textAlign: 'right',
              fontSize: '0.75rem',
              color: '#A0AEC0',
              marginBottom: '12px',
              fontFamily: "'Poppins', sans-serif",
            }}>
              {newMessage.length}/80
            </div>

            <input
              type="text"
              placeholder="— İsmin"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              maxLength={12}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '1rem',
                fontFamily: "'Permanent Marker', cursive",
                border: '2px solid #E2E8F0',
                borderRadius: '12px',
                background: '#fff',
                color: '#333',
                outline: 'none',
                marginBottom: '18px',
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD93D'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />

            {/* Color Picker */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                color: '#4A5568',
                fontSize: '0.85rem',
                marginBottom: '10px',
                fontWeight: '500',
              }}>
                Kalem rengi:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: color,
                      border: selectedColor === color ? '3px solid #2D3748' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '18px',
              borderLeft: `3px solid ${selectedColor}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <p style={{
                margin: '0 0 4px 0',
                fontFamily: "'Patrick Hand', cursive",
                fontSize: '0.9rem',
                color: '#333',
              }}>
                {newMessage || 'Mesajın burada görünecek...'}
              </p>
              <p style={{
                margin: 0,
                fontFamily: "'Permanent Marker', cursive",
                fontSize: '0.85rem',
                color: selectedColor,
                textAlign: 'right',
              }}>
                — {newAuthor || 'İsmin'}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '0.95rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                  color: '#4A5568',
                  background: '#EDF2F7',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleAddSignature}
                disabled={!newMessage.trim() || !newAuthor.trim() || saving}
                style={{
                  flex: 2,
                  padding: '12px',
                  fontSize: '0.95rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '600',
                  color: '#1a365d',
                  background: newMessage.trim() && newAuthor.trim() && !saving
                    ? 'linear-gradient(135deg, #FFE066 0%, #FFD93D 100%)'
                    : '#EDF2F7',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: newMessage.trim() && newAuthor.trim() && !saving ? 'pointer' : 'not-allowed',
                  boxShadow: newMessage.trim() && newAuthor.trim() && !saving
                    ? '0 4px 15px rgba(255, 217, 61, 0.4)' 
                    : 'none',
                }}
              >
                {saving ? '⏳ Kaydediliyor...' : '✍️ İmzala!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignMyShirt;
