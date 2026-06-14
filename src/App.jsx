import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase'; 
import HabitItem from './HabitItem';

export default function App() {
  // 1. Setup our variables
  const [tasks, setTasks] = useState([]); //whatever the data comes from supabase
  // we put in an array named tasks which is later rendered using HabitItem
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState("");

  // 2. Fetch the data from Supabase
  useEffect(() => {
    //async just tells to wait till we fetch the data from supabase
    async function fetchTasks() {
      //data and error are 2 things we care about here
      const { data, error } = await supabase.from('Routine_Habits').select('*'); // await tells exactly where to stop & select * tells to send all data present in the base
      
      if (error) {
        console.error('Error fetching habits:', error);
      } else {
        setTasks(data); // Save the database rows into our React app
      }
      setLoading(false);
    }
    //this is the exact trigger that tells to run the function
    fetchTasks();
  }, []); // [] tells to stop re-rendering

  // 3. Show a loading screen while fetching, when fetching done setTasks is toggled and we render the actual data
  if (loading) {
    return <div className="p-10 text-center font-bold">Loading your habits...</div>;
  }
  //New habit added logic
  async function habitAdded() {
    //to stop making habits with empty blocks
    if(!newHabit.trim()) return;

    const {data, error} = await supabase
      .from('Routine_Habits')
      .insert([{task_name: newHabit}])
      .select();
      //if error
      if(error) {
        console.log("There is an error in adding new habit, error: ", error);
      }
      else {
        //... is used to modify array, and data[0] coz we are adding one piece of data 
        setTasks([...tasks, data[0]]);
        setNewHabit("");
      } 
  }

  //render the item that is deleted
  function removeTaskFromScreen(taskId) {
    //tasks array is again set by checking whose id we got to delete and whose is similar is skipped, that is 
    //our array is being updated
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  // 4. Draw the actual screen
  return (
    <main className="min-h-screen bg-gray-50 p-10 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dynamic Habit Heatmap</h1>
        {/* The Input Area */}
        <div className="flex gap-2 mb-8">
          <input 
            type="text"
            className="border-gray-300 border-2 rounded-3xl flex-1 p-3 outline-0" 
            placeholder="New Habit"
            value={newHabit}
            onChange={(event) => setNewHabit(event.target.value)}
            // On every new click, the habit variable is updated 
            // and and it is updated by the arrow function*
          />
          <button
            className="bg-gray-700 hover:bg-gray-900 text-white p-3 rounded-4xl font-bold cursor-pointer"
            onClick={habitAdded}
          >
            Add Habit
          </button>
        </div>
        {/* Checkboxes Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Today's Tasks</h2>
          {/* if no task it tells that no task */}
          {tasks.length === 0 ? (
            <p className="text-gray-500">No habits added yet!</p>
          ) : 
          /* if tasks are there .map() just runs a loop on all the data */
          (
            tasks.map((task) => (
              //from here we are sending removetaskfromscreen as on delete and on the 
              //habititem page and when we input task.id, it is registered as taskId
              <HabitItem key={task.id} task={task} onDelete={removeTaskFromScreen} /> /* here is a unique id (key is needed when rendering a list of items) and here passes the task object */
            ))
          )}
        </div>

        {/* AI Input Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">AI Brain Dump</h2>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            rows="3"
            placeholder="What else do you need to do today?"
          ></textarea>
          <button className="mt-3 w-full bg-black text-white px-4 py-3 rounded-lg font-semibold cursor-pointer">
            Generate Smart Tasks
          </button>
        </div>
      </div>
    </main>
  );
}