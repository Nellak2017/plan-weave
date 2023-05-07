import { useEffect, useState } from 'react'
import { fillDefaults } from '../components/schemas/taskSchema/taskSchema.js'
import { addTask } from '../firebase/firebase_controller.js'
import { signOutOfApp } from '../firebase/firebase_auth'
import { auth } from '../firebase/firebase_auth.js'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'

export default function Home() {
  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [name, setName] = useState('')
  const [eta, setEta] = useState('')
  const [ata, setAta] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
		return () => onAuthStateChanged(auth, user => user ? setIsLoggedIn(true) : setIsLoggedIn(false))
	}, [isLoggedIn])

  const handleSubmit = (e) => {
    e.preventDefault()
    const task = { name, eta, ata, dueDate, value }
    console.log(task) // You can do whatever you want with the task object
    const defaultFilled = fillDefaults(task)
    console.log(defaultFilled)

    addTask(defaultFilled)
  }


  const handleLoginPage = () => {
    router.push('/login')
  }

  const handleLogout = async () => {
    try {
      await signOutOfApp()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Log Out</button>
      ) : (
        <button onClick={handleLoginPage}>Log In</button>
      )
      }
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          ETA:
          <input type="text" value={eta} onChange={(e) => setEta(e.target.value)} />
        </label>
        <br />
        <label>
          ATA:
          <input type="text" value={ata} onChange={(e) => setAta(e.target.value)} />
        </label>
        <br />
        <label htmlFor="dueDate">
          Due Date:
          <input type="date" id="dueDate" name="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <br />
        <label>
          Value:
          <input required type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
