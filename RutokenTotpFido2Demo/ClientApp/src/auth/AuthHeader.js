import React from 'react';
import RutokenLabel from '../images/RutokenLabel';
import { ExternalLinks } from '../utils/constants';

const AuthHeader = () => {
    return (
        <div className="auth-header">
            <RutokenLabel className="auth-header__logo" />
            <div className="auth-header__links">
                <a href={ExternalLinks.RutokenUserGuide} target="_blank" rel="noopener noreferrer" className="auth-header__link">Руководство пользователя</a>
                <a href={ExternalLinks.DemoPortal} target="_blank" rel="noopener noreferrer" className="auth-header__link">Демонстрационный портал</a>
                <a href={ExternalLinks.SourceCode} target="_blank" rel="noopener noreferrer" className="auth-header__link">Исходный код</a>
            </div>
        </div>
    );
};

export default AuthHeader;
