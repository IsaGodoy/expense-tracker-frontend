import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState('')
    const [error, setError] = ('')
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchExpenses = async () => {
        const response = await fetch('http://localhost:5196/api/expenses', {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.status === 401) {
            navigate('/login')
            return
        }

        if (response.ok) {
            const data = await response.json()
            setExpenses(data)
        } else {
            setError('Error loading expenses')
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5196/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description, amount: parseFloat(amount), date })
        })

        if (response.ok) {
            setDescription('')
            setAmount('')
            setDate('')
            fetchExpenses()
        } else {
            setError('Error creating expense')
        }
    }

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:5196/api/expenses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
            fetchExpenses()
        } else {
            setError('Error deleting expense')
        }
    }

    return (
        <div>
            <h1>Expenses</h1>
            {error && <p>{error}</p>}

            <form onSubmit={handleCreate}>
                <input
                    type='text'
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type='number'
                    placeholder='Amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <input
                    type='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <button type='submit'>Add Expense</button>
            </form>

            <ul>
                {expenses.map(expense => (
                    <li key={expense.id}>
                        {expense.date} - {expense.description} - {expense.amount}
                        <button onClick={() => handleDelete(expense.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Expenses