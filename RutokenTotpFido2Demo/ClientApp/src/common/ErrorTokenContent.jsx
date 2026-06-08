import React from "react";
import InformationIcon from "../images/InformationIcon";
import { ExternalLinks } from "../utils/constants";

const ErrorTokenContent = () => {
    return (
        <div className="mt-4_375rem w-100">
            <div className='d-flex flex-column align-items-center mb-2_875rem'>
                <InformationIcon />
                <div className='mt-0_75rem text-secondary'>
                    <small className="d-flex flex-column align-items-center">
                        <span>Произошла ошибка,</span>
                        <span>попробуйте еще раз. При необходимости</span>
                        <span>
                            воспользуйтесь
                            {' '}
                            <a
                                href={ExternalLinks.RutokenUserGuide}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-text-default"
                            >
                                инструкцией
                            </a>
                        </span>
                    </small>
                    
                </div>
            </div>
        </div>
    );
}

export default ErrorTokenContent;