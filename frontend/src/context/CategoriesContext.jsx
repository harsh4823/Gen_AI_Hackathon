import React, { createContext, useContext, useState } from "react";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([
    "Handicrafts",
    "Pottery",
    "Paintings",
    "Jewelry",
    "Woodwork",
  ]);

  const addCategory = (newCategory) => {
    if (!categories.includes(newCategory) && newCategory.trim() !== "") {
      setCategories([...categories, newCategory]);
    }
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
