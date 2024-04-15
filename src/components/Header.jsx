import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Logo from '/lingosummer-logo.svg';
import Menu from '/menu.svg';
import Toggle from './utilities/Toggle.jsx'; // Make sure Toggle is correctly imported

const Header = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isToggled, setToggled] = useState(false); // This manages the toggle state.

  useEffect(() => {
    const saveSummaries = localStorage.getItem('saveSummaries') === 'true';
    const lastAsked = localStorage.getItem('lastAsked');
    const currentDate = new Date();
    const fourteenDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 14),
    );

    // Check if we should prompt the user about saving their summary
    if (!lastAsked || new Date(lastAsked) <= fourteenDaysAgo) {
      localStorage.setItem('lastAsked', new Date().toISOString());
      // Here, you could trigger a modal or another UI element to ask the user
    }

    // Set the initial toggle state based on local storage
    setToggled(saveSummaries);
  }, []);

  const toggleState = () => {
    const newToggledState = !isToggled;
    if (newToggledState) {
      localStorage.setItem('userUid', uuidv4()); // Generate and save new UID
      localStorage.setItem('saveSummaries', 'true');
    } else {
      localStorage.removeItem('userUid');
      localStorage.setItem('saveSummaries', 'false');
    }
    setToggled(newToggledState); // Update state after handling local storage
  };

  return (
    <header className="flex justify-between items-center p-2 w-full align-center h-16 pr-10 bg-background-50">
      <Link to="/">
        <img
          src={Logo}
          alt="LingoSummer"
          className="w-60 h-16 object-contain"
        />
      </Link>
      <div className="relative" onClick={() => setMenuVisible(!isMenuVisible)}>
        <img
          src={Menu}
          alt="Menu icon"
          className="w-8 h-8 object-contain cursor-pointer"
        />
        {isMenuVisible && (
          <div className="absolute right-0 mt-1 p-3 bg-white shadow-lg rounded-lg w-48 border border-background-300">
            <p className="text-text-700">
              Would you like to save your summary?
            </p>
            <Toggle isToggled={isToggled} toggleState={toggleState} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
