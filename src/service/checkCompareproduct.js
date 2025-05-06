export  function checkcompare(id,products){
    let product = products.some(item=>item._id ===id)
    return product

}