"use client"

import "flag-icons/css/flag-icons.min.css"

export default function FlagTest() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Flag Icons Test</h2>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="fi fi-es" style={{ width: "2em", height: "1.5em" }}></span>
          <span>Spain</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="fi fi-us" style={{ width: "2em", height: "1.5em" }}></span>
          <span>United States</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="fi fi-br" style={{ width: "2em", height: "1.5em" }}></span>
          <span>Brazil</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="fi fi-jp" style={{ width: "2em", height: "1.5em" }}></span>
          <span>Japan</span>
        </div>
      </div>
    </div>
  )
}
