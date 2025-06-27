import React, {useState, forwardRef} from "react";
import cn from "classnames";
import {FormFeedback, Input} from "reactstrap";

const PasswordInput = forwardRef((props, ref) => {
    
    const [fieldType, setFieldType] = useState("password");

    const renderEyeIconClass = (fieldType) => cn({
        img__eye: true,
        active: fieldType === 'text',
    });

    const fieldTypeToggle = () =>
        setFieldType(fieldType === 'password' ? 'text' : 'password');

    return (
        <div
            style={{position: 'relative'}}
        >
            <Input {...props}
                   type={fieldType}
                   autoComplete="new-password"
                   innerRef={ref}
            />
            <FormFeedback className="ps-3">
                {props.feedback}
            </FormFeedback>
            <span
                role="button"
                tabIndex="0"
                className={renderEyeIconClass(fieldType)}
                onClick={() => fieldTypeToggle()}
            />
        </div>
    );
    
});

export default PasswordInput;