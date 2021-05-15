import React from "react";
import Header from "./components/Header"
import Tasks from "./components/Tasks"
import {useState, useEffect} from 'react'
import AddTask from "./components/AddTask"
import Footer from "./components/Footer"
import About from "./components/About"
import {BrowserRouter, Route, Router, Redirect, Switch} from 'react-router-dom'
import ChinaMap from "./components/ChinaMap";
import {asyncComponent} from "./asyncComponent";
import Cover from "./components/Cover";
import './index.css'

function App() {
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
        <Route path='/main' exact render={(props) => (
            <>
            <div className='parent'>
                <div className='container'>
                    <Header  onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
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
                    <Footer />
                </div>
                <ChinaMap />
            </div>
            </>
        )} />

        <Route path='/main/about' exact render={(props) => (
            <>
                <div className='parent'>
                    <div className='container'>
                        <About />
                        <Footer />
                    </div>
                    <ChinaMap />
                </div>
            </>
        )} />

        <Route path='/main/heatMap' exact render={(props) => (
            <>
                <div className='parent'>
                    <div className='container'>
                        <Header  onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
                        <Route path='/main/heatMap' component={hmgo} />
                        <Footer />
                    </div>

                    <Route path='/main/heatMap' component={heatmap}/>
                </div>
            </>
        )} />
        <Route path='/' exact render={(props) => (
            <>
                <Cover />
            </>
        )} />
    </BrowserRouter>
  );
}

export default App;
