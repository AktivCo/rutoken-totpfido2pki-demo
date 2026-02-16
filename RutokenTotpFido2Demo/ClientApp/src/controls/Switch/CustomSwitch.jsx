import React from 'react';
import { Input } from 'reactstrap';
import './CustomSwitch.scss';

const CustomSwitch = ({checked, setChecked}) => {
    return (
        <label className="Switch">
            <Input type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}>
            </Input>
            <span className="Slider Round"></span>
        </label>
    );
};

export default CustomSwitch;