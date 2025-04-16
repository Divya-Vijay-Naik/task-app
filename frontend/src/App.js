import Task from "./component/Task";  
import AddTask from "./AddTask"; 
import "./style.css";

const App = () => {
  return ( 
    <div>
      <h1>Task Manager</h1>
      <AddTask fetchTasks={() => window.location.reload()} />
      <Task />
    </div>
  );
};

export default App;
