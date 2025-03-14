import React from "react";
import PropTypes from 'prop-types';

const ButtonLoader = ({ status }) => {
    return (
        <>
            {
                status ?
                <div className="button-loader"></div>
                :
                null
            }
        </>
    )
}

ButtonLoader.propTypes = {
    status: PropTypes.bool
};

export default ButtonLoader;