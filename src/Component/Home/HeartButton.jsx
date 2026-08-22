import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addWishList } from "../../action/productdetailaction";
import { removeFromWishlist } from "../../action/wishListAciton";
import { checkUser } from "../../assest/js/checker";
import { useNavigate } from "react-router-dom";

const HeartButton = ({ productId, check = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlistProducts = useSelector(
        (state) => state.WishlistData?.data?.products ?? []
    );

    const isInWishlist = useMemo(() => {
        return wishlistProducts.some((product) => product._id === productId) || check;
    }, [wishlistProducts, productId, check]);

    const [like, setLike] = useState(isInWishlist);

    useEffect(() => {
        setLike(isInWishlist);
    }, [isInWishlist]);

    const handleHeartButton = useCallback(() => {
        if (!checkUser()) {
            navigate('/login');
            return;
        }

        if (like || isInWishlist) {
            setLike(false);
            dispatch(removeFromWishlist(productId));
            return;
        }

        setLike(true);
        dispatch(addWishList(productId));
    }, [dispatch, productId, like, isInWishlist, navigate]);

    return (
        <div className="heartbutton-container">
            {like ? (
                <FaHeart size={23} color="red" onClick={handleHeartButton} />
            ) : (
                <FaRegHeart size={23} onClick={handleHeartButton} />
            )}
        </div>
    );
};

export default HeartButton;
