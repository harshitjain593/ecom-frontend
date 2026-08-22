import React, { useCallback, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addWishList } from "../../action/productdetailaction";
import { removeFromWishlist } from "../../action/wishListAciton";
import { checkUser } from "../../assest/js/checker";
import { useNavigate } from "react-router-dom";

const HeartButton = ({ productId, check = false }) => {
    const dispatch = useDispatch();
    const [like, setLike] = useState(check);
    const navigate = useNavigate();

    // Set like state based on the current status when component mounts
    useEffect(() => {
        setLike(check);
    }, [check]); // Only depend on check prop

    const handleAddToWishlist = useCallback(() => {
        console.log("Adding to wishlist:", productId);
        dispatch(addWishList(productId));
    }, [dispatch, productId]);

    const handleHeartButton = () => {
        if (!checkUser()) {
            navigate('/login');
            return;
        }
        setLike(prevLike => {
            const newLike = !prevLike;
            if (newLike) {
                handleAddToWishlist();
            } else {
                console.log("Removing from wishlist:", productId);
                dispatch(removeFromWishlist(productId));
            }
            return newLike;
        });
    };

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
