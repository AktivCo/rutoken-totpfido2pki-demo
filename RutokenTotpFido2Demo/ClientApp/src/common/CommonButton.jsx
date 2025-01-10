import React from "react";
import { Button } from "reactstrap";
import cn from 'classnames';

const CommonButton = ({ onClick, className, disabled, fullWidth, children }) => {
    return (
        <Button
            type="submit"
            color="danger"
            className={cn(className, "mb-0 fs-1_125rem lh-1_25rem px-4 py-0_875rem", { 'w-fit-content': !fullWidth })}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}

export default CommonButton;