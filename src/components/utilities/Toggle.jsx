import React from 'react';

const Toggle = ({ isToggled, toggleState }) => {
  return (
    <div className="flex items-center justify-start">
      {/* Container for the toggle switch */}
      <div
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
          isToggled ? 'bg-primary-300' : 'bg-primary-700'
        } transition-colors duration-300 ease-in-out`}
        onClick={toggleState} // Toggle the state on click
      >
        {/* Circle inside the toggle */}
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
            isToggled
              ? 'translate-x-6 bg-primary-700'
              : 'translate-x-0 bg-primary-300'
          }`}
        ></div>
      </div>
      {/* Text indicating the toggle status */}
      <span
        className={`ml-2 ${isToggled ? 'text-primary-700' : 'text-background-600'}`}
      >
        {isToggled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
};

export default Toggle;
