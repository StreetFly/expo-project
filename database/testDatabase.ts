import { createTask, deleteTask, getAllTasks, initializeDatabase, updateTask } from './taskRepository';

export async function testDatabase() {
  try {
    await initializeDatabase();
    console.log('Database initialized');

    const id = await createTask('Test task');
    console.log('Created task:', id);

    const allTasks = await getAllTasks();
    console.log('All tasks:', allTasks);

    await updateTask(id, 1);
    console.log('Task updated');

    await deleteTask(id);
    console.log('Task deleted');

  } catch (error) {
    console.error('Database test failed:', error);
  }
}