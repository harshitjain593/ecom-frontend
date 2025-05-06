
const intialState = {
        sidebarOpen:true,
        searchQuery:'',
}


const FilterData = (state=intialState,action)=> {
    switch(action.type){
        case 'FILTER_UPDATE_STATE':{
            return{...state,...action.payload}
        }
        default:
            return state
    }

}

export default FilterData