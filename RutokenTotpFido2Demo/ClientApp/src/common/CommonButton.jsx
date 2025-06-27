import React, {forwardRef} from 'react';
import { Button } from "reactstrap";
import cn from 'classnames';

const CommonButton = forwardRef(({ onClick, className, disabled, fullWidth, children}, ref ) => {
    return (
        <Button
            type="submit"
            color="danger"
            className={cn(className, "mb-0 fs-1_125rem lh-1_25rem px-4 py-0_875rem", { 'w-fit-content': !fullWidth })}
            onClick={onClick}
            disabled={disabled}
            innerRef={ref}
        >
            {children}
        </Button>
    );
});

export default CommonButton;