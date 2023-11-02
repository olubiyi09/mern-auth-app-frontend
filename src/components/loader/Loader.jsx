import React from "react";
import loaderImg from "../../assets/loading.gif";
import ReactDOM from "react-dom";
import "./Loader.scss";

const Loader = () => {
    return ReactDOM.createPortal(
        <div className="wrapper">
            <div className="loader">
                <img src={loaderImg} alt="Loading..." width="300px" />
            </div>
        </div>,
        document.getElementById("loader")
    );
};

export const SpinnerImg = () => {
    return (
        <div className="--center-all">
            <img src={loaderImg} alt="Loading..." width="200px" />
        </div>
    );
};

export default Loader;