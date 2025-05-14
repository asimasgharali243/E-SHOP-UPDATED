import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function Error() {
  const error = useRouteError()
  console.log(error);
  return <div className='d-flex justify-content-center align-items-center vh-100 fw-bold  display-1' style={{color:'red'}}>{error.statusText} {error.status}</div>
}