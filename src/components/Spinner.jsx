import React from 'react'

export default function Spinner() {
  return (
    <div>
        <div className="flex items-center justify-center space-x-2 absolute inset-0">
            <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
        </div>
    </div>
  )
}
