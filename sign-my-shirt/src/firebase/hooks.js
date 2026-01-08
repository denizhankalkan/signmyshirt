// src/firebase/hooks.js
import { useState, useEffect } from 'react';
import { 
  doc, 
  collection, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { nanoid } from 'nanoid';

// Hook: Gömlek verilerini çek ve dinle
export const useShirt = (shirtId) => {
  const [shirt, setShirt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shirtId) {
      setLoading(false);
      return;
    }

    const shirtRef = doc(db, 'shirts', shirtId);
    
    const unsubscribe = onSnapshot(shirtRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          setShirt({ id: snapshot.id, ...snapshot.data() });
        } else {
          setShirt(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Shirt fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [shirtId]);

  return { shirt, loading, error };
};

// Hook: İmzaları çek ve realtime dinle
export const useSignatures = (shirtId) => {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shirtId) {
      setLoading(false);
      return;
    }

    const signaturesRef = collection(db, 'shirts', shirtId, 'signatures');
    const q = query(signaturesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sigs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSignatures(sigs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [shirtId]);

  return { signatures, loading };
};

// Yeni gömlek oluştur
export const createShirt = async (ownerName, graduationYear = 2025, schoolName = '') => {
  const shirtId = nanoid(10); // Kısa, paylaşılabilir ID
  
  const shirtData = {
    ownerName,
    graduationYear,
    schoolName,
    schoolLogo: null, // Logo URL'i sonra eklenebilir
    createdAt: serverTimestamp(),
    signatureCount: 0
  };

  await setDoc(doc(db, 'shirts', shirtId), shirtData);
  
  return shirtId;
};

// Yeni imza ekle
export const addSignature = async (shirtId, signatureData) => {
  const signaturesRef = collection(db, 'shirts', shirtId, 'signatures');
  
  const newSignature = {
    ...signatureData,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(signaturesRef, newSignature);
  
  // İmza sayısını güncelle
  const shirtRef = doc(db, 'shirts', shirtId);
  const shirtSnap = await getDoc(shirtRef);
  if (shirtSnap.exists()) {
    await updateDoc(shirtRef, {
      signatureCount: (shirtSnap.data().signatureCount || 0) + 1
    });
  }

  return docRef.id;
};

// İmza pozisyonunu güncelle (sürükle-bırak sonrası)
export const updateSignaturePosition = async (shirtId, signatureId, x, y) => {
  const signatureRef = doc(db, 'shirts', shirtId, 'signatures', signatureId);
  await updateDoc(signatureRef, { x, y });
};

// İmza sil (sadece gömlek sahibi için)
export const deleteSignature = async (shirtId, signatureId) => {
  const signatureRef = doc(db, 'shirts', shirtId, 'signatures', signatureId);
  await deleteDoc(signatureRef);
  
  // İmza sayısını güncelle
  const shirtRef = doc(db, 'shirts', shirtId);
  const shirtSnap = await getDoc(shirtRef);
  if (shirtSnap.exists()) {
    await updateDoc(shirtRef, {
      signatureCount: Math.max(0, (shirtSnap.data().signatureCount || 1) - 1)
    });
  }
};

// Okul logosu güncelle
export const updateSchoolLogo = async (shirtId, logoUrl) => {
  const shirtRef = doc(db, 'shirts', shirtId);
  await updateDoc(shirtRef, { schoolLogo: logoUrl });
};

// Gömlek var mı kontrol et
export const checkShirtExists = async (shirtId) => {
  const shirtRef = doc(db, 'shirts', shirtId);
  const snapshot = await getDoc(shirtRef);
  return snapshot.exists();
};
