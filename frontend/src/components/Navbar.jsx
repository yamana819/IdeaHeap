import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-lg flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-500 cursor-pointer hover:text-blue-400 transition">
        IdeaHeap
      </div>
      <div className="flex gap-6 items-center">
        <button className="hover:text-blue-300 transition font-medium">
          My Projects
        </button>
        <button className="hover:text-blue-300 transition font-medium">
          About
        </button>
        <button className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-blue-500/50">
          Login
        </button>
      </div>
    </nav>
  );
};
export default Navbar;