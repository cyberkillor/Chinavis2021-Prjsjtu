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
import MainPage from "./components/MainPage";

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
    const htgo = asyncComponent(() => import('./components/HGgo'));
    const mainpage = asyncComponent(() => import('./components/MainPage'));

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
        <Route path='/main/histogram' exact render={(props) => (
            <>

                <Route path='/main/histogram' component={htgo}/>
            </>
        )} />

        <Route path='/test_main' exact render={(props) => (
            <>
                <div id='dirty-selector'>
                    <div className="input-item">
                        <button className="btn" >PM<sub>2.5</sub></button>
                    </div>
                    <div className="input-item">
                        <button className="btn" >PM<sub>10</sub></button>
                    </div>
                    <div className="input-item">
                        <button className="btn" >SO<sub>2</sub></button>
                    </div>
                    <div className="input-item">
                        <button className="btn" >NO<sub>2</sub></button>
                    </div>
                    <div className="input-item">
                        <button className="btn" >CO</button>
                    </div>
                    <div className="input-item">
                        <button className="btn" >O<sub>3</sub></button>
                    </div>
                </div>

                <div id="mode-selector">
                    <select>
                        <option value="2013">2013</option>
                        <option value="2014">2014</option>
                        <option value="2015">2015</option>
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                    </select>
                    <select>
                        <option value="DAY">DAY</option>
                        <option value="HOUR">HOUR</option>
                    </select>
                </div>

                <div id='month-selector'>
                    <ul className="time-horizontal">
                        <li>
                            <button className="btn-m">1</button>
                        </li>
                        <li>
                            <button className="btn-m">2</button>
                        </li>
                        <li>
                            <button className="btn-m">3</button>
                        </li>
                        <li>
                            <button className="btn-m">4</button>
                        </li>
                        <li>
                            <button className="btn-m">5</button>
                        </li>
                        <li>
                            <button className="btn-m">6</button>
                        </li>
                        <li>
                            <button className="btn-m">7</button>
                        </li>
                        <li>
                            <button className="btn-m">8</button>
                        </li>
                        <li>
                            <button className="btn-m">9</button>
                        </li>
                        <li>
                            <button className="btn-m">10</button>
                        </li>
                        <li>
                            <button className="btn-m">11</button>
                        </li>
                        <li>
                            <button className="btn-m">12</button>
                        </li>
                    </ul>
                </div>
                <Route path='/test_main' component={mainpage}/>
            </>
        )} />
    </BrowserRouter>
  );
}

export default App;
