import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getSearchResult } from '../../../action/searchResultAction';
import { useNavigate } from 'react-router-dom';

const SuggestionsList = ({ suggestions, listSearch ,setQuery}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLiClick = useCallback((keyword) => {
        const lowercasedKeyword = keyword.toLowerCase();
        console.log('keyword',keyword)
        setQuery(keyword)
        listSearch(keyword);
        navigate(`/result/${keyword}`);
    }, [dispatch, navigate, suggestions, listSearch]);

    return (
        <div className='suggestion-container'>
            {suggestions&& suggestions.length > 0 ? (
                <ul className="bottom-0 suggestion-ul">
                    {suggestions.map(suggestion => (
                        <li onClick={() => handleLiClick(suggestion.product_name)} key={suggestion._id}>
                            <section className='section-sug'>
                                <div className='img-cont'  >
                                    <img src={suggestion.productImage} alt='' />
                                </div>
                                <div className='text-cont' style={{}}>
                                    <h5 className='fs-6'>{suggestion.product_name}</h5>
                                    <h6 className='  '>in {suggestion.category}</h6>
                                </div>
                                
                            </section>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-center m-0 py-1' style={{fontWeight:500}}>No matching products found.</p>
            )}
        </div>
    );
};

export default SuggestionsList;
