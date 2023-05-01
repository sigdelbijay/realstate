import React from "react"
import AdForm from '../../../components/forms/AdForm'
import Sidebar from "../../../components/nav/Sidebar"

export default function RentLand() {
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">
        Rent Land
      </h1>
      <Sidebar />
      <div className="container mt-2">
        <AdForm action='Rent' type='Land'/>
      </div>

    </div>
  )
}