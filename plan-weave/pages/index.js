import { useState } from 'react'
import { taskSchema, fillDefaults } from '../components/schemas/taskSchema/taskSchema.js'

export default function Home() {
  const [name, setName] = useState('')
  const [eta, setEta] = useState('')
  const [ata, setAta] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const task = { name, eta, ata, dueDate, value }
    console.log(task) // You can do whatever you want with the task object
    const defaultFilled = fillDefaults(task)
    console.log(defaultFilled)
  }


  return (
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
  )
}
