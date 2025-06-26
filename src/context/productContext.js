import { createContext, useEffect, useState,useContext } from "react";

// Create the context
export const ProductContext = createContext();


// Create the provider component
export const ProductProvider = ({ children }) => {
  const [tarProduct,setTarProduct]=useState([])

  return (
    <ProductContext.Provider value={{ tarProduct,setTarProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);