import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';
const TASK_TEXT_KEY = 'taskText';

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

export async function saveTaskText(taskText: string) {
  try {
    await AsyncStorage.setItem(TASK_TEXT_KEY, taskText);
  } catch (error) {
    console.error('Error saving task text:', error);
  }
}

export async function loadTaskText(): Promise<string> {
  try {
    const savedTaskText = await AsyncStorage.getItem(TASK_TEXT_KEY);

    if (savedTaskText) {
      return savedTaskText;
    }

    return '';
  } catch (error) {
    console.error('Error loading task text:', error);
    return '';
  }
}