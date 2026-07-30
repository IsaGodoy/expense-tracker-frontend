import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Expenses() {
    const [expenses, setExpenses] = useState([])
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState('')
    const [error, setError] = useState('')
    const [editingExpense, setEditingExpense] = useState(null)
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchExpenses = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
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
        e.preventDefault()

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

    const handleEdit = (expense) => {
        setEditingExpense(expense)
        setDescription(expense.description)
        setAmount(expense.amount)
        setDate(expense.date)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        const response = await fetch(`http://localhost:5196/api/expenses/${editingExpense.id}`, {
            method: 'PUT',
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
            setEditingExpense(null)
            fetchExpenses()
        } else {
            setError('Error updating expense')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Expenses</h1>
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                    Logout
                </button>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-sm font-medium text-gray-700 mb-4">
                        {editingExpense ? 'Edit Expense' : 'Add Expense'}
                    </h2>
                    <form onSubmit={editingExpense ? handleUpdate : handleCreate} className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                        />
                        <button
                            type="submit"
                            className="bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                        >
                            {editingExpense ? 'Update' : 'Add Expense'}
                        </button>
                        {editingExpense && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingExpense(null)
                                    setDescription('')
                                    setAmount('')
                                    setDate('')
                                }}
                                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                    {expenses.length === 0 && (
                        <p className="text-sm text-gray-500 p-6 text-center">No expenses yet.</p>
                    )}
                    {expenses.map(expense => (
                        <div key={expense.id} className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium text-gray-800">{expense.description}</p>
                                <p className="text-xs text-gray-500">{expense.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-800">{expense.amount}</span>
                                <button
                                    onClick={() => handleEdit(expense)}
                                    className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Expenses