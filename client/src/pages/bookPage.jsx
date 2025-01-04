import EpubViewer from '@/components/ePubView'
import { EPubReader } from '@/components/ePubViewtemp'
import React from 'react'

export default function BookPage() {

    
  return (
    <>
    <div className='w-full h-full'>
      <EpubViewer/>
      {/* <EPubReader url={localStorage.getItem('bookUrl')} /> */}
    </div>

    </>
  )
}
