import React, { useEffect, useState } from "react";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
export function LikeSec({ handleLikeAndDislike ,item}) {
  const [active, setActive] = useState({
    like:item.isLiked,
    dislike:item.isDisliked
  })

  useEffect(()=>{
    setActive(prev=>(
       {
        ...prev,
        like:item.isLiked,
        dislike:item.isDisliked
      }
    ))
  },[])
  const handleAction = (action)=>{
    if(action==='like'){
      setActive({
        like:true,
        dislike:false
      })
    }else{
      setActive({
        like:false,
        dislike:true
      })
    }

  }
  return (
    <div className="d-flex justify-content-start align-items-center gap-2 mt-4">
      <div
        className="like mr-3 vote "
        onClick={() =>{ handleLikeAndDislike("like", item._id); handleAction('like');}}
        style={{
          cursor: "pointer",
        }}
      >
       <AiFillLike color={active.like?'#0e6fe0':'lightgray'} size={20} />
        <span className="blue-text pl-2">{item.like}</span>
      </div>
      <div
        className="unlike vote"
        onClick={() => {handleLikeAndDislike("dislike", item._id); handleAction('dislike')}}
        style={{
          cursor: "pointer",
        }}
      >
        <AiFillDislike  size={20} color={active.dislike ? '#0e6fe0':'lightgray'}/>
        <span className="text-muted pl-2">{item.dislike}</span>
      </div>
    </div>
  );
}
