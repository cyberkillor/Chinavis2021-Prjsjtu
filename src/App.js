import React from "react";
import Header from "./components/Header"
import Tasks from "./components/Tasks"
import {useState, useEffect} from 'react'
import AddTask from "./components/AddTask"
import Footer from "./components/Footer"
import About from "./components/About"
import {BrowserRouter, Route} from 'react-router-dom'
import ChinaMap from "./components/ChinaMap";
import HeatMap from "./components/HeatMap";
import HMgo from "./components/HMgo";
import {asyncComponent} from "./asyncComponent";

function App() {
  // const name = 'Victor' {name}
  // const x = true  {x ? 'Yes' : 'No'}
    const [showAddTask, setShowAddTask] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const getData = async () => {
            const tasks = await fetchTasks()
            setTasks(tasks)
        }
        getData()
    }, [])

    // Fetch Tasks
    const fetchTasks = async () => {
        const res = await fetch('http://localhost:5000/tasks')
        const data = await res.json()
        return data
    }

    // Fetch Task
    const fetchTask = async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`)
        const data = await res.json()
        return data
    }

  // Add Task
  const addTask = async (task) => {
      const res = await fetch('http://localhost:5000/tasks', {
          method: 'POST',
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify(task)
      })
      const data = await res.json()
      setTasks([...tasks, data])

      //   const id = Math.floor(Math.random() * 10000) + 1
      // const newTask = {id, ...task}
      // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'DELETE'
        })
        setTasks(tasks.filter((task) => task.id !== id))
    }

  // Toggle Reminder
  const toggleReminder = async (id) => {
        const t = await fetchTask(id)
      const updated = {...t, reminder: !t.reminder}

      const res = await fetch(`http://localhost:5000/tasks/${id}`,{
          method: 'PUT',
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify(updated)
      })
      const data = await res.json()

        setTasks(
            tasks.map(
                (task) => task.id === id ?
                    {...task, reminder: data.reminder}
                    :
                    task
            )
        )
    }

    const hmgo = asyncComponent(() => import('./components/HMgo'));
    const heatmap = asyncComponent(() => import('./components/HeatMap'));

  return (
    <BrowserRouter>
    <div className='parent'>
        <div className='container'>
          <Header  onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />

            <Route path='/' exact render={(props) => (
                <>
                    {showAddTask &&
                    <AddTask onAdd={addTask} />
                    }
                    {tasks.length > 0 ?
                        <Tasks tasks={tasks}
                               onDelete={deleteTask}
                               onToggle={toggleReminder}
                        />
                        :
                        'No Tasks To Show'}
                </>
            )} />
            <Route path='/about' component={About} />
            <Route path='/heatMap' component={hmgo} />
            <Footer />
        </div>

        <Route path='/' exact render={(props) => (
            <>
                <ChinaMap />
            </>
        )} />
        <Route path='/heatMap' component={heatmap} />
    </div>
    </BrowserRouter>
  );
}

export default App;
