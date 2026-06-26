// "use client";
// import { useState, useEffect } from "react";

// export function useLocalStorage<T>(
//   key: string,
//   initialValue: T
// ): [T, React.Dispatch<React.SetStateAction<T>>] {
//   const [value, setValue] = useState<T>(initialValue);
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(key);
//       if (saved !== null) {
//         setValue(JSON.parse(saved) as T);
//       }
//     } catch (error) {
//       console.error("Errore lettura localStorage:", error);
//     }
//     setIsLoaded(true);
//   }, [key]);

//   useEffect(() => {
//     if (!isLoaded) return;
//     try {
//       localStorage.setItem(key, JSON.stringify(value));
//     } catch (error) {
//       console.error("Errore scrittura localStorage:", error);
//     }
//   }, [key, value, isLoaded]);

//   return [value, setValue];
// }
