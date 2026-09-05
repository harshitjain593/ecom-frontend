import React, { useCallback, useEffect, useState, useRef } from "react";
import Sidebar from "./sidebar";
import { useDispatch, useSelector } from "react-redux";
import SuggestionsList from "./SuggestionList";
import { useLocation, useNavigate } from 'react-router-dom';
import UseTypewriterEffect from "../../UserTyperwriter/UseTypewriterEffect";
import { filterProducts } from "../../../action/filterAction";
import { FILTER_UPDATE_STATE } from "../../../action/actionType";

export function SearchBar({ SidebarOpen, handleCloseSidebar }) {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    // const [filteredProducts, setFilteredProducts] = useState([]);
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const queryRef = useRef(query);
    const {pathname} = useLocation()
    const filteredProducts= useSelector((state)=>state.filteredProducts?.products?.products)

    useEffect(()=>{
        if(pathname==='/'){
            setQuery('')
            setActive(false)
        }

    },[pathname])

    const searchApi = useCallback((value)=>{
        dispatch(filterProducts({'productName':value}))
    },[query,dispatch])



    useEffect(() => {
        queryRef.current = query;
        // handleSearch(query); // Call this here to avoid re-triggering
    }, [query]); // Ensure this only runs when `query` changes

    const handleQuery = useCallback((e) => {
        const { value } = e.target;
        setQuery(value);
        dispatch({
            type:FILTER_UPDATE_STATE,
            payload:{
                searchQuery:value
            }
        })
        searchApi(value)
        setActive(value.trim().length > 0);
    }, []);

    // const handleSearch = useCallback((searchQuery) => {
    //     const lowercasedQuery = searchQuery.toLowerCase();
    //     const results = products.filter(product =>
    //         product.category.toLowerCase().includes(lowercasedQuery) ||
    //         product.sub_category.toLowerCase().includes(lowercasedQuery) ||
    //         product.tag_keywords.toLowerCase().includes(lowercasedQuery)
    //     );
    //     setFilteredProducts(results); // Set filtered products
    // }, [products]); // Dependency on products

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const searchQuery = queryRef.current.trim();
        if (!searchQuery) return; // Prevent empty searches
        dispatch({
            type:FILTER_UPDATE_STATE,
            payload:{
                searchQuery
            }
        })
        navigate(`/result/${searchQuery}`);
        setActive(false);
        
    }, [dispatch, navigate, filteredProducts]); // Include filteredProducts

    const listSearch = useCallback((search) => {
        searchApi(search)
        setActive(false);
        dispatch({
            type:FILTER_UPDATE_STATE,
            payload:{
                searchQuery:search
            }
        })
    }, [dispatch,searchApi]);

    // Use the custom hook for the typewriter effect
    const placeholderTexts = ["Search Products...", "flower vase...", "furnitures..."];
    const placeholderText = UseTypewriterEffect(placeholderTexts, 100);

    return (
        <form className="gi-search-group-form position-relative" onSubmit={handleSubmit}>
            <input
                className="form-control gi-search-bar"
                placeholder={placeholderText}
                value={query}
                onChange={handleQuery}
                type="text"
                style={{
                    maxWidth: "28rem",
                }}
            />
            <button type="submit" className="position-absolute nav-searchicon-container">
                <i
                    className="fa-solid fa-magnifying-glass px-3"
                    style={{
                        color: "#EDB70B",
                    }}
                ></i>
            </button>
            {active && <SuggestionsList suggestions={filteredProducts&& filteredProducts} listSearch={listSearch} setQuery={setQuery} />}
            {/* <Sidebar Open={SidebarOpen} onClose={handleCloseSidebar} query={query} /> */}
        </form>
    );
}
