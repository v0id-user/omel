'use client';

import { useState } from 'react';

export default function TestStyles() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-screen">
      <div className="flex gap-2">
        <button
          onClick={() => setIsOn(false)}
          className={`relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] rounded-lg shadow-[0_1px_rgba(255,255,255,0.07)_inset,0_1px_3px_rgba(0,0,0,0.2)] ring-1 ring-red-500/50 text-xs py-2 px-6 before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-b before:from-white/20 ${!isOn ? 'before:opacity-100' : 'before:opacity-50'} hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-lg after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay hover:drop-shadow-2xs from-red-500 to-red-600 bg-gradient-to-r text-white ${!isOn ? '' : 'opacity-50'}`}
          disabled={!isOn}
        >
          Off
        </button>
        <button
          onClick={() => setIsOn(true)}
          className={`relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] rounded-lg shadow-[0_1px_rgba(255,255,255,0.07)_inset,0_1px_3px_rgba(0,0,0,0.2)] ring-1 ring-green-500/50 text-xs py-2 px-6 before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-lg before:bg-gradient-to-b before:from-white/20 ${isOn ? 'before:opacity-100' : 'before:opacity-50'} hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-lg after:bg-gradient-to-b after:from-white/10 after:from-[46%] after:to-[54%] after:mix-blend-overlay hover:drop-shadow-2xs from-green-500 to-green-600 bg-gradient-to-r text-white ${isOn ? '' : 'opacity-50'}`}
          disabled={isOn}
        >
          On
        </button>
      </div>

      {/* Switch Button Variants */}
      <div className="flex flex-col gap-4" dir="ltr">
        {/* Basic Switch */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => setIsOn(!isOn)}
            className="w-10 h-5 flex items-center bg-gray-300 rounded-full p-0.5 cursor-pointer"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-5' : ''}`}
            ></div>
          </div>
          <span className="text-sm">مفتاح بسيط</span>
        </div>

        {/* Colored Switch */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => setIsOn(!isOn)}
            className={`w-10 h-5 flex items-center ${isOn ? 'bg-green-500' : 'bg-gray-300'} rounded-full p-0.5 cursor-pointer`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-5' : ''}`}
            ></div>
          </div>
          <span className="text-sm">مفتاح ملون</span>
        </div>

        {/* Disabled Switch */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-5 flex items-center bg-gray-200 rounded-full p-0.5 cursor-not-allowed opacity-60">
            <div className="bg-gray-400 w-4 h-4 rounded-full shadow-md"></div>
          </div>
          <span className="text-sm">مفتاح معطل</span>
        </div>

        {/* Icon Switch */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => setIsOn(!isOn)}
            className={`w-10 h-5 flex items-center ${isOn ? 'bg-purple-500' : 'bg-gray-300'} rounded-full p-0.5 cursor-pointer`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? 'translate-x-5' : ''} flex items-center justify-center text-[10px]`}
            >
              {isOn && '✓'}
            </div>
          </div>
          <span className="text-sm">مفتاح برمز</span>
        </div>
      </div>
    </div>
  );
}
