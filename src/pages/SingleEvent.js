import React from "react";
import { useParams } from "react-router-dom";
import { Event } from "../Components/event/Event";

function SingleEvent() {
    let { id } = useParams();
    
    return (
        <Event id={id}/>
    );
}

export default SingleEvent;