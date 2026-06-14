import {useState} from 'react';
import {supabase} from './utils/supabase';

export default function HabitItem({task, onDelete}) {
    //here comes the logic for updating the toggle checks
    const [isCompleted, setIsCompleted] = useState(task.is_completed || false);
    async function toggleChanges() {
        //toggle changes in variable and save them for future changes
        const newStatus=!isCompleted;
        setIsCompleted(newStatus);
        //updating newStatus in server
        const {error} = await supabase.
        from('Routine_Habits')
        .update({is_completed: newStatus})
        .eq('id', task.id);
        //from supabase routine_habits, update is_completed, with this unique id

        //if we get an error
        if(error) {
          console.log("Failed to update database: ", error);
          //update nhi hua, but i have to revert back my variables na
          setIsCompleted(!newStatus);
        }
    }   
    //Delete Function logic
    async function deleteButton() {
        const {error} = await supabase
        .from('Routine_Habits')
        .delete()
        .eq('id', task.id);
        if(error) {
          console.log("Failed to delete: ", error);
        }
        else {
          //if sucessfully deleted
          onDelete(task.id);
        }
    }

    //here comes the thing thart return markup code stuff to App.jsx and is rendered by App.jsx
    return (
        <div className="flex justify-between items-center gap-3 p-3 bg-gray-100 rounded-lg">
            <input
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={isCompleted}
              onChange={toggleChanges}
            />
            <p className="text-gray-700">{task.task_name}</p>
            <button 
              title="Delete Habit"
              className="px-2 cursor-pointer"
              onClick={deleteButton}
              >
              🗑️
            </button>
        </div>
    );
}