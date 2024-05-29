import React, { forwardRef, ChangeEvent, KeyboardEvent } from "react";

interface Props {
   title: string;
   placeholder: string;
   type: 'text' | 'password';
   value: string;
   message?: string;
   isErrorMessage?: boolean;
   buttonTitle?: string;
   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
   onKeydown?: (event: KeyboardEvent<HTMLInputElement>) => void;
   onButtonClick?: () => void;
   isReadOnly?: boolean;
   
}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
   const { title, placeholder, type, value, isErrorMessage, buttonTitle, message, onChange, onKeydown, onButtonClick ,isReadOnly } = props;

   const buttonClass = value === '' ? 'input-box-button-disable' : 'input-box-button';
   const messageClass = isErrorMessage ? 'input-box-message-error' : 'input-box-message';

   return (
      <div className="input-box">
         <div className="input-box-title">{title}</div>
         <div className="input-box-content">
            <div className="input-box-body">
               <input ref={ref}  className="input-box-input" placeholder={placeholder}
                  type={type}
                  value={value}
                  onChange={onChange}
                  onKeyDown={onKeydown}
                  readOnly={isReadOnly}
               />
               {buttonTitle && onButtonClick && (
                  <div className={buttonClass} onClick={onButtonClick}>
                     {buttonTitle}
                  </div>
               )}
            </div>
            <div className={messageClass} id="input_message">{message}</div>
         </div>
      </div>
   );
});

export default InputBox;
