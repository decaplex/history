// Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { 
      getFirestore, 
      collection, 
      addDoc, 
      onSnapshot, 
      query, 
      orderBy, 
      deleteDoc,
      doc,
      getDocs,
      serverTimestamp
    } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyC--wbQDeOGustth3A9byoW3Bn_feB-giA",
      authDomain: "comme-4698a.firebaseapp.com",
      projectId: "comme-4698a",
      storageBucket: "comme-4698a.firebasestorage.app",
      messagingSenderId: "734774176819",
      appId: "1:734774176819:web:71a331844c1a3eb70d4746",
      measurementId: "G-NC9BSSB44L"
    };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        console.log("Firebase initialized successfully!");
        
        // Make these available globally
        window.firebaseApp = app;
        window.db = db;
        window.firestoreFunctions = {
            collection, 
            addDoc, 
            onSnapshot, 
            query, 
            orderBy, 
            deleteDoc,
            doc,
            getDocs,
            serverTimestamp
        };