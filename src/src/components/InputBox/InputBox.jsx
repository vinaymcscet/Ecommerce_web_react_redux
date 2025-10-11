import React, { useState } from 'react';
import './InputBox.css';


const InputField = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    minLength,
    maxLength,
    pattern,
    validate,
    errorMessage
}) => {
    const [error, setError] = useState('');

    const handleValidation = (value) => {
        
        if (required && !value) {
            setError('This field is required.');
        } else if (minLength && value.length < minLength) {
            setError(`Minimum length is ${minLength} characters.`);
        } else if (maxLength && value.length > maxLength) {
            setError(`Maximum length is ${maxLength} characters.`);
        } else if (pattern && !new RegExp(pattern).test(value)) {
            setError('Invalid format.');
        } else if (validate) {
            const validationError = validate(value);
            setError(validationError || '');
        } else {
            setError('');
        }
    };

    const handleChange = (e) => {
        const value = e.target.value.replace(/\s+/g, '');;
        handleValidation(value);
        onChange(e);
    };

    return (
        <div className="input-field">
            <label htmlFor={label}>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
                pattern={pattern}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                style={{ WebkitBoxShadow: '0 0 0px 1000px white inset' }}
            />
            {error && <span className="error-message">{errorMessage || error}</span>}
        </div>
    );
};

export default InputField;