import { useState } from "react";

export type PlaylistType = "Channels" | "Playlists" | "All";
type DropDownProps = {
  value?: PlaylistType;
  onChange?: (value: PlaylistType) => void;
};

export default function DropDown({ value = "All", onChange }: DropDownProps) {
  const [show, setShow] = useState(false);

  const setType = (newType: PlaylistType) => {
    setShow(false);
    if (onChange) {
      onChange(newType);
    }
  };

  const playlistTypes: PlaylistType[] = ["Channels", "Playlists", "All"];
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setShow(!show)}
        >
          {value}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-opacity ${
          show ? "opacity-100" : "opacity-0"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <ul className="py-1" role="none">
          {playlistTypes.map((type, index) => (
            <li
              className={`text-gray-700 block px-4 py-2 text-sm hover:cursor-pointer ${
                value === type
                  ? "bg-gray-100 text-gray-900 font-bold"
                  : "text-gray-700"
              }`}
              role="menuitem"
              tabIndex={-1}
              id={`menu-item-${index}`}
              onClick={() => setType(type)}
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
