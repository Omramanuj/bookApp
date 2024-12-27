import React, { useState } from 'react'
import { ReactReader } from 'react-reader'

export const ReactReaderPage = () => {
  const [location, setLocation] = useState(0);
  const bookurl='/David Deida - The Way of the Superior Man_ A Spiritual Guide to Mastering the Challenges of Women, Work, and Sexual Desire-Sounds True (2004).epub';
  return (
    <div style={{ height: '100vh' }}>
      <ReactReader
        url={bookurl}
        location={location}
        locationChanged={(epubcfi) => setLocation(epubcfi)}
      />
    </div>
  )
}