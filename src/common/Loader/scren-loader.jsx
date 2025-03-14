import React from "react";
import PropTypes from 'prop-types';

const ScreenLoader = ({ status }) => {
    return (
        <>
            {
                status ?
                <div className="loader-wrapper">
                    <div className="loader"></div>
                </div>
                :
                null
            }
        </>
    )
}

ScreenLoader.propTypes = {
    status: PropTypes.bool
};

export default ScreenLoader;