import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {

  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState('');

  useEffect(() => {
    // const getTasks = async () => {
    //   const tasksFromServer = await fetchTasks();
    //   setTasks(tasksFromServer);
    // }
    fetchTasks();
    //getTasks();
  }, [])

  //fetch data
  const fetchTasks = () => {
    setIsLoading(true);
    setErrorState('');

    fetch('http://localhost:5000/tasks')
    .then(res => { 
      if(!res.ok) throw Error(`Could not load data from the source`)
      return res.json()
    } )
    .then(data => { 
      setTasks(data);
      setIsLoading(false);
    })
    .catch(err => { setErrorState(err.message) } )
    // const res = await fetch('http://localhost:5000/tasks')
    // .catch(er => {
    //   return console.log(er);
    // })
    // const data = await res.json();
    // console.log(data);
    // return data;
  }  

  //fetch only one reminder
  const fetchTask = async id => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json();

    return data;
  }  

  //add task function
  const addTask = async task => {
    const res = await fetch(`http://localhost:5000/tasks`,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json();

    setTasks([...tasks, data])
  }

  //Delete task function
  const deleteTask = async id => {

    await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'DELETE'
    })
    setTasks(tasks.filter((task) => task.id !== id));
  }

  //toggle reminder function
  const toggleReminder = async id => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  return (
    <Router>
      <div className="container">
        <Header
        showAdd = {showAddTask} 
        onAdd={() => setShowAddTask(!showAddTask)}/>
        
        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {errorState !== '' ? 
              <p>Error getting data.. <span className='btn' onClick={fetchTasks}>reload</span></p> :
              isLoading ? <p>Loading data..</p> :
                tasks.length > 0 ?
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder} />
                  : <p>No tasks..</p>}
          </>
        )} />
        
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
