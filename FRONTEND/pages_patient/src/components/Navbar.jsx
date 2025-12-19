import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-sm">C</div>
        <span className="text-xl font-bold tracking-tight text-gray-900">Cliniga</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <p className="text-sm font-bold text-gray-900 leading-none">Alliyah Salsabilla</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-wider">Patient</p>
        </div>
        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
      </div>
    </nav>
  );
};


export default Navbar;
