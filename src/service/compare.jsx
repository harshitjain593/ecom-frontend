import React, { useState } from "react";

const useLocal = (key, initialValue) => {
    const [localError, setLocalError] = useState(null);
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log('Error reading from local storage', error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const currentStoredValue = storedValue || initialValue;
            const valueToStore = value instanceof Function ? value(currentStoredValue) : value;

            if(valueToStore.products.length>0){
                if (currentStoredValue.category && valueToStore.category !== currentStoredValue.category) {
                    setLocalError('Please add products in the same category');
                    return;
                }
            }
            
            if(valueToStore.products.length>0){
                if (valueToStore.products && currentStoredValue.products.some(item => item._id === valueToStore.products[0]._id)) {
                    setLocalError('Product already exists in comparison');
                    return;
                }
            }

            if (Array.isArray(currentStoredValue.products) && currentStoredValue.products.length >= 3 && valueToStore.products.length > 0) {
                setLocalError("You can only add 3 products.");
                return;
            }

            // Update logic for when the last product is removed
            const newProducts = Array.isArray(currentStoredValue.products) 
                ? currentStoredValue.products.filter(item => !valueToStore.products.some(p => p._id === item._id))
                : [];

            const newStoredValue = {
                ...currentStoredValue,
                category: newProducts.length > 0 ? currentStoredValue.category : '', // Reset category if no products
                products: newProducts,
            };

            setStoredValue(newStoredValue);
            localStorage.setItem(key, JSON.stringify(newStoredValue));
            setLocalError(null); // Clear any previous error
        } catch (error) {
            console.error("Error setting localStorage", error);
        }
    };

    return [storedValue, setValue, localError];
};

export default useLocal;
