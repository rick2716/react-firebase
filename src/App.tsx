import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, Firestore, DocumentData, doc, updateDoc, deleteField } from 'firebase/firestore/lite';
import { doc as docF, onSnapshot, getFirestore as getFirestoreF } from "firebase/firestore";
import { setMaxListeners } from 'process';

const firebaseConfig = {
  apiKey: "AIzaSyCmVJPpZKWINsJrjONkfVSkm6oZd_UgD7E",
  authDomain: "react-firebase-6a9f1.firebaseapp.com",
  projectId: "react-firebase-6a9f1",
  storageBucket: "react-firebase-6a9f1.appspot.com",
  messagingSenderId: "815775750655",
  appId: "1:815775750655:web:fb44f74f8e942fc9e16fca",
  measurementId: "G-M768PMPMFL"
};

const app : FirebaseApp = initializeApp(firebaseConfig);
const db : Firestore = getFirestore(app);
const dbF : Firestore = getFirestoreF(app);

async function getDBZ(db:Firestore, setMain: React.Dispatch<React.SetStateAction<String | undefined>>){
  const dbzCol = collection(db, 'dbz');
  const dbzSnapshot = await getDocs(dbzCol);
  const dbzList = dbzSnapshot.docs.map(doc => doc.data());
  let response : DocumentData = dbzList[0];
  console.log('dbsList', response['main']);
  setMain(response['main']);
}

async function addElement(db:Firestore) {
  try {
    let newCharacterRef = doc(db, 'dbz', 'characters');
    await updateDoc(newCharacterRef, {
      main: 'GokuNuevo'
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function deleteElement(db:Firestore) {
  try {
    let newCharacterRef = doc(db, 'dbz', 'characters');
    await updateDoc(newCharacterRef, {
      main: deleteField()
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function App() {
  const [main, setMain] = useState<String>();
  useEffect(() => {
    getDBZ(db, setMain);

    const unsubcribe = onSnapshot(docF(dbF, "dbz", "characters"), (doc) => {
      console.log('Llego acá');
      console.log("Current data: ", doc.data());
    }, (err) => {
      console.log('Soy el Error');
      console.log('err', err);
    });

    return () => {
      unsubcribe();
    }
  });

  return (
    <div className="App">
      <p>Main: {main}</p>
      <button onClick={async () => {
        await addElement(db);
      }}>Agregar Character</button>
      <button onClick={async () => {
        await deleteElement(db);
      }}>Eliminar Character</button>
    </div>
  );
}

export default App;
