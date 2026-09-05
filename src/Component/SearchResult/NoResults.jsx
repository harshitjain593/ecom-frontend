import React, { useCallback, useEffect, useRef, useState } from "react";
import './searchResult.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProduct } from "../../action";
import { filterProducts } from "../../action/filterAction";
import { FILTER_UPDATE_STATE } from "../../action/actionType";
const NoResults = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [filteredProducts] = useState([]);
    const [active, setActive] = useState(false);
    const navigate = useNavigate();

    const queryRef = useRef(query);

    useEffect(() => {
        dispatch(fetchProduct());
    }, [dispatch]);

    useEffect(() => {
        queryRef.current = query;
        
    }, [query]); // Ensure this only runs when `query` changes

    const handleQuery = useCallback((e) => {
        const { value } = e.target;
        setQuery(value);
        setActive(value.trim().length > 0);
    }, []);

   

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const searchQuery = queryRef.current.trim();
        if (!searchQuery) return; // Prevent empty searches
        const vlaue = searchQuery.trim()
        dispatch(filterProducts({'productName':searchQuery}))
        dispatch({
            type:FILTER_UPDATE_STATE,
            payload:{
                searchQuery
            }
        })
        navigate(`/result/${searchQuery}`);
        setActive(false);
        setQuery('');
    }, [dispatch, navigate, filteredProducts]); // Include filteredProducts
  return (
    <div className="search-container-no position-relative">
        <form onSubmit={handleSubmit} className="nosearchform">
        <input type="text"
        value={query}
        onChange={handleQuery}
         className="searchbar-no" placeholder="search bowl ,vase ,cup ,furniture etc"/>
        <button type="submit" className="position-relative searchbtn" >
                <i
                    className="fa-solid fa-magnifying-glass px-3"
                    style={{
                        color: "#EDB70B",
                    }}
                ></i>
            </button>
        </form>
    </div>
  )
};

export default NoResults;
