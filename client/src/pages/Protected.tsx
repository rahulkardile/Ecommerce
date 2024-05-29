import React from 'react'

const ProtectedPage = () => {
  return (
    <div style={{display:"flex", margin: "auto", alignItems: "center", flexDirection: "column", gap:"25px", marginLeft: "35%", marginRight:"35%", marginTop:"10%" }}>
        <h1 style={{color: "red"}}>Bad Request</h1>
        <p style={{color: "green"}}>Your are trying to access the page which is not awailable for user!</p>
        <p style={{color: "blue"}}>Thank You</p>
    </div>
  )
}

export default ProtectedPage