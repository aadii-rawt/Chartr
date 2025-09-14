import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const AdminProtectiveRoute = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const { user } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        function check() {
            if(!user) return
            if (user?.role !== "admin") {
                navigate("/login")
                return false
            }
            setLoading(false)
        }
        check()
    }, [user])

    if (loading) {
        return <div className='flex min-h-screen w-full items-center justify-center'>Loading...</div>
    }
    return (
        children
    )
}

export default AdminProtectiveRoute