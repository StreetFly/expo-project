import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export async function saveTasks(tasks: Task[]) {
  try {
    await AsyncStorage.setItem(
      TASKS_KEY,
      JSON.stringify(tasks)
    );
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const savedTasks = await AsyncStorage.getItem(TASKS_KEY);

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}