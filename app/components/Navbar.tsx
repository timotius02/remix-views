const Navbar = () => {
  return (
    <nav className="bg-gray-800 container mx-auto px-12">
      <div className="flex items-center justify-between h-16">
        <div className="w-full justify-between flex items-center">
          <a className="flex-shrink-0" href="/">
            <span className="text-white">
              THE
              <h1 className="inline mx-2 text-3xl font-bold italic">ViEWS</h1>
              GAME
            </span>
          </a>
          <a
            href="/playlist/new"
            className="py-1.5 px-6 text-white text-center text-base font-semibold rounded-lg leading-9 hover:bg-gray-700"
          >
            Custom Playlist{" "}
            <span className="bg-red-500 rounded px-2 py-1 text-sm">BETA</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
