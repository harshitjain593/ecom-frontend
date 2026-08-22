import React, { useCallback, useEffect, useState } from 'react';
import css from './filtersidebar.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { filterProducts } from '../../action/filterAction';
import { fetchProduct } from '../../action/index';
import PriceFilter from '../Common/filter components/PriceFilter';
import CategoryFilter from '../Common/filter components/CategoryFilter';
import { getMouseEventOptions } from '@testing-library/user-event/dist/utils';
import { FaFilter } from 'react-icons/fa6';
import { FILTER_UPDATE_STATE } from '../../action/actionType';
const colors = [
  { name: 'Beige', hex: '#f5f5dc' },
  { name: 'White', hex: '#fff' },
  { name: 'OffWhite', hex: '#fff' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Black', hex: '#000000' },
  { name: 'Blue', hex: '#0000ff' },
  { name: 'Brown', hex: '#a52a2a' },
  { name: 'Coral', hex: '#ff7f50' },
  { name: 'Cream', hex: '#fffdd0' },
  { name: 'Fuchsia', hex: '#ff00ff' },
  { name: 'Gold', hex: '#ffd700' },
  { name: 'Green', hex: '#008000' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Ivory', hex: '#fffff0' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Magenta', hex: '#ff00ff' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Multi Color', hex: '#000080' },
  { name: 'Mustard', hex: '#ffdb58' }
];

const filters = [
  'Categories',
  'Price',
  // 'Size',
  'Color',

];  

export const FilterSidebar = () => { 
      const navigate = useNavigate();
      const dispatch = useDispatch()
      const [sortBy, setSortBy] = useState({});
      const [SizeBy, setSizeBy] = useState({});
      const [selectedFilter, setSelectedFilter] = useState(null);
      const [showSizeFilter, setShowSizeFilter] = useState(false);
      const [categoryFilter, setCategoryFilter] = useState([])
      const [selectedColor, setSelectedColor] = useState([]);
      const [searchQuery, setSearchQuery] = useState('');
      const [minPrice, setMinPrice] = useState(0);
      const [maxPrice, setMaxPrice] = useState(10000);
      const [selectedCategory ,setSelectedCategory] = useState('')
      const [reqobj , setReqObj] = useState({})
      const {pathname} = useLocation()
      const [basekey , setBaseKey] = useState(null)
      const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
      const query = useSelector((state)=>state.filterData.searchQuery);
      

    
      const handleClearAll = (action = 'half') => {
        if (action === 'half') {
          setSelectedFilter(null);
          const newReqobj = { ...reqobj };
          const keysToDelete = ['maxPrice', 'minPrice', 'color', 'category'];
          keysToDelete.forEach((key) => delete newReqobj[key]);
      
          // Reset relevant state variables
          setSelectedColor([]);
          setCategoryFilter([]);
          setSizeBy([]);
          setMinPrice(0);
          setMaxPrice(10000);
          
          // Update the request object
          setReqObj(prev => ({ ...basekey, ...newReqobj }));
          
          // Dispatch the action to filter products based on the base key
          dispatch(filterProducts({ ...basekey}));
          
        } else {
          const newReqobj = { ...reqobj };
          const keysToDelete = ['maxPrice', 'minPrice', 'color', 'category', 'filter'];
          keysToDelete.forEach((key) => delete newReqobj[key]);
      
          // Reset all relevant states to initial
          setSortBy({});
          setSelectedFilter(null);
          setSelectedColor([]);
          setCategoryFilter([]);
          setSizeBy([]);
          setMinPrice(0);
          setMaxPrice(10000);
      
          // Update the request object
          setReqObj({});
          console.log('base key',basekey)
          // Dispatch the action to filter products based on the base key
          dispatch(filterProducts({ ...basekey }));
        }
      };

      const checkRoute = useCallback((pattern)=>{
        const regex = new RegExp(pattern)
          return regex.test(pathname)

      },[pathname])
    
      useEffect(()=>{
       
        const matchingRoute = (pattern) => {
          const regex = new RegExp(pattern)
          return regex.test(pathname)
        }
        if(matchingRoute('^/result/.+')){
         
          dispatch(filterProducts({'productName':query,...reqobj}))
          setBaseKey(prev=>({'productName':query}))
          setReqObj({...reqobj})
    
        }else if( matchingRoute('^/category/.+')){
          const newReq= {...reqobj,category:lastSegment}
          delete newReq.productName
          if(reqobj.category){
            dispatch(filterProducts({...newReq}))
            setBaseKey(prev=>({'category':lastSegment}))
            setReqObj({...newReq})
    
          }else{
            dispatch(filterProducts({'category':lastSegment,...reqobj}))
            setBaseKey(prev=>({'category':lastSegment}))
            setReqObj({...reqobj,'category':lastSegment})
    
    
          }
        } else if (pathname === '/shop') {
          const params = new URLSearchParams(window.location.search);
          const categoryParam = params.get('category');
          if (categoryParam) {
            const categories = categoryParam.split(',').filter(Boolean);
            dispatch(filterProducts({ category: categories }));
            setBaseKey({ category: categories });
            setReqObj({ category: categories });
          } else {
            dispatch(fetchProduct());
            setBaseKey({});
            setReqObj({});
          }
        }
        
      },[pathname ])
    
      const handleFilterClick = (filter) => {
        
        
        setSelectedFilter(selectedFilter === filter ? null : filter);
        
        // Check if the clicked filter is 'Size', then show size filter
        if (filter === 'Size') {
          setShowSizeFilter(true);
        } else {
          setShowSizeFilter(false);
        }
      };
    
      const handleSizeSelection = (option) => {
        if (SizeBy.includes(option)) {
          setSizeBy(SizeBy.filter(item => item !== option));
        } else {
          setSizeBy([...SizeBy, option]);
        }
      };
    
     
      
     
      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };
    
      const filteredColors = colors.filter(color =>
        color.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    
      const toggleColorSelection = (color) => {
        setSelectedColor((prevSelectedColor) =>
          prevSelectedColor.includes(color)
            ? prevSelectedColor.filter((item) => item !== color)
            : [...prevSelectedColor, color]
        );
      };
    
      // Add a new function to check if a color is selected
      const isColorSelected = (color) => {
        return selectedColor.includes(color);
      };
    
      // const handleClearAll = () => {
      //   setSelectedColor([]);
      // };
    
      const getPlaceholder = (filter) => {
        switch (filter) {
          case 'Color':
            return 'Search Color';
          case 'Size':
            return 'Search Size';
          // Add more cases if needed
          default:
            return 'Search';
        }
      };
    
      const handleRadioFilter = useCallback(async (key, value) => {
        try {
          let filterKey;
          switch(value) {
            case 'Popularity':
              filterKey = 'popular';
              break;
            case 'New Arrivals':
              filterKey = 'arrival';
              break;
            case 'Price Low to High':
              filterKey = 'low';
              break;
            case 'Price High to Low':
              filterKey = 'high';
              break;
            case 'Discount Products':
             filterKey = 'discount';
             break;
            default:
              return;
          }
    
          setReqObj(prev=>{
            console.log(prev,'reqboj before radios action')
            if(Object.keys(prev).length === 0){
                dispatch(filterProducts({...basekey,filter:filterKey}))
                console.log({...basekey,filter:filterKey}, 'working in empy req obj')
                return{...basekey,filterKey:filterKey,}
            }else{
                if(checkRoute('^/result/.+')){
                    dispatch(filterProducts({...prev,...basekey,filter:filterKey}))
                    console.log({...prev,...basekey,filter:filterKey}, 'working in non-empy req obj')
                     return{...prev,...basekey,filter:filterKey}

                }else{

                    dispatch(filterProducts({...prev,filter:filterKey}))
                    return{...prev,filter:filterKey}
                }
            }
        })
          console.log(reqobj,'check reqobj in radio')
        } catch (error) {
          console.error('Error in filtering products:', error);
        }
      }, [dispatch, navigate,query,reqobj]);
       
    //   const handleSubFilter = useCallback(async(filterName, value)=>{
    //       try {
    //         await dispatch(filterProducts(filterName, value)).then(() => {
    //           navigate(`/filtered/${value}`);
    //         });
    //       } catch (error) {
    //         console.error('Error in subfiltering products:', error);
    //       }
    //     },[dispatch,navigate])
    
        const handleApplyFunction = useCallback(async (e,filterName,value) => {
          e.preventDefault();
          try {
            
            if (selectedFilter === 'Price') {
               setReqObj(prev=>{
                dispatch(filterProducts( {...prev,maxPrice,minPrice}));
                return{...prev,maxPrice,minPrice}
            })
            } else if ( selectedFilter === 'Categories'){
              // navigate('/filtered/category');        
              setReqObj(prev=>({...reqobj,category:categoryFilter}))
              await dispatch(filterProducts({...reqobj,category:categoryFilter }));
            } else if (selectedFilter === 'Color'){
              // navigate('/filtered/color');
              setReqObj(prev=>({...reqobj,color:selectedColor}))
              await dispatch(filterProducts({...reqobj,color:selectedColor}));
            }
            setSelectedFilter(prev=>null)
          } catch (error) {
            console.error('Error in applying filters:', error);
          }
        }, [dispatch, selectedFilter, maxPrice, minPrice, navigate, categoryFilter ,selectedColor]);
      
        const handleCloseSidebar = ()=>{
            dispatch({
                type:FILTER_UPDATE_STATE,
                payload:{
                    sidebarOpen:false
                }
            })
        }
    
      return (
        <div className={css.filterbarContainer}>
          <div className='d-flex justify-content-between align-items-center px-3 mt-2 w-100'>
            {selectedFilter === null ? (
              <span className='mb-2' style={{ fontWeight: "500", fontSize:'120%' }}>Filter</span>
            ) : (
              <div className='d-flex justify-content-start'>
                <h6 style={{ fontSize: "15px", cursor: "pointer" }} onClick={()=>handleClearAll('full')}>
                  <i className="fa-solid fa-arrow-left"></i>
                </h6>
                <h6 className='px-3'>{selectedFilter}</h6>
              </div>
            )}
            <p onClick={handleCloseSidebar}><i className="fa-solid fa-xmark"></i></p>
            {/* <FaFilter size={15} /> */}
          </div>
          <div className='justify-content-between px-3 mt-2'>
            {selectedFilter === null || selectedFilter ==='Price' || selectedFilter === 'Size' ? (
              ""
            ) : (
              
              <div className="search-container mb-1">
                <input
                  type="text"
                  placeholder={getPlaceholder(selectedFilter)} className='w-100 px-2'
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            )}
          </div>
          <div className={`${css.filterSec} px-3`}>
            {selectedFilter === null ? (
              // Main filter content
              <div className="filter-menu">
                {/* Sort section */}
                <div className="sort-section">
                  <h6 className='fw-bold'>Sort by</h6>
                  <div className="sort-options px-2">
                    {['Popularity', 'New Arrivals', 'Price Low to High', 'Price High to Low', 'Discount Products'].map(option => (
                      <div key={option} className="sort-option">
                        <input
                          type="radio"
                          id={option}
                          name="sort"
                          value={option}
                          checked={sortBy === option}
                          onChange={() => setSortBy(option)}
                          onClick={() => handleRadioFilter('filter', String(option))}
                        />
                        <label htmlFor={option}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Filter section */}
                <div className="filter-section">
                  <div className='d-flex justify-content-between py-2'>
                    <h6 className='fw-bold'>Filter by</h6>
                    <h6 style={{ fontSize: "15px", cursor: "pointer" }} onClick={()=>handleClearAll('full')}>Clear all</h6>
                  </div>
                  <ul className="filter-options px-2">
                    {filters.map(filter => (
                      <li key={filter} className="filter-item">
                        <Link
                          to="#"
                          className="filter-link d-flex justify-content-between"
                          style={{ fontSize: "15px", color: selectedFilter === filter ? "#007bff" : "#234" }}
                          onClick={() => handleFilterClick(filter)}
                        >
                          <span className="filter-text">{filter}</span>
                          <i className="fa-solid fa-greater-than small-icon"></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              // Dynamic filter content based on selected filter
              <div className={css.filterContent}>
                {selectedFilter === 'Size' && (
                  // Size filter section
                  <div className="sort-options px-2">
                    {['S', 'M', 'L'].map(option => (
                      <div key={option} className="sort-option">
                        <input
                          type="checkbox"
                          id={option}
                          name="size"
                          value={option}
                          checked={SizeBy}
                          onChange={() => handleSizeSelection(option)}
                          className="large-checkbox"
                        />
                        <label htmlFor={option} style={{ fontSize: "13px" }}>{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                {selectedFilter === 'Color' && (
                  // Color filter section
                  <div className={css.colorfiltercontainer}>
                    <div className="color-list ">
                      <div className='row px-3 ' style={{marginBottom:'4rem'}}>
                        {filteredColors.map((color) => (
                          <div
                            key={color.name}
                            className={`color-item col-md-6 ${isColorSelected(color.name) ? 'selected' : ''}`}
                            onClick={() => toggleColorSelection(color.name)}>
                            <span
                              className="color-box"
                              style={{ backgroundColor: color.hex }}
                            ></span>
                            <span style={{ fontSize: "14px" }}>{color.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {selectedFilter === 'Price' && (
                  <PriceFilter maxPrice={maxPrice} setMaxPrice={setMaxPrice} setMinPrice={setMinPrice} minPrice={minPrice} />
                )}
                {selectedFilter === 'Categories' && (
                  <CategoryFilter setCategoryFilter={setCategoryFilter}  searchQuery={searchQuery}/>
                )}
              </div>
            )}
          </div>
          <div className='bg-white' style={{ position: 'absolute', bottom: 0, width: '100%' }}>
            {selectedFilter === null ? (
              ''
            ) : (
              <section className='d-flex border-top border-secondary py-2 px-1 '>
    
                <button className="clear-button" onClick={handleClearAll}>
                  CLEAR ALL
                </button>
                <button  onClick={(e)=>handleApplyFunction(e)} className='apply-button'>
                  Apply
                </button>
              </section>           
              
            )}
          </div>
        </div>
      );
    };
    
    export default FilterSidebar;
    