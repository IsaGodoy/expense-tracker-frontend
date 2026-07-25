import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError('')

        const response = await fetch('http://localhost:5196/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })

        if(response.ok) {
            navigate('/login')
        } else {
            setError('There was an error. Please try again')
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value= {username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link> </p>
        </div>
    )
}

export default Register