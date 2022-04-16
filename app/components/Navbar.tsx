const Navbar = () => {
  return (
    <nav className="w-5/6 mx-auto flex items-center justify-between h-16">
      <div className="w-full justify-between flex items-center">
        <a className="flex-shrink-0" href="/">
          <span className="text-white">
            THE
            <h1 className="inline mx-2 text-xl md:text-3xl font-bold italic">
              ViEWS
            </h1>
            GAME
          </span>
        </a>
        <a
          href="/new"
          className="sm:py-1.5 sm:px-6 text-white text-center text-base font-semibold rounded-lg leading-9 hover:bg-gray-700"
        >
          Custom Game{" "}
          <span className="bg-red-500 rounded px-2 py-1 text-sm">BETA</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
