import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function AppStateScreen() {
  const[taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  function addTask() {
    if (!taskText.trim()) {
      return;
    }

    let nextId = 1;

    tasks.forEach((task) => {
      if (task.id >= nextId) {
        nextId = task.id + 1;
      }
    });

    const newTask: Task = {
      id: nextId,
      title: taskText,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskText('')
  }

  function toggleTask(id: number) {
    setTasks(
      tasks.map((task) => 
      task.id === id ? {...task, completed: !task.completed} : task)
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Tasks</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={taskText}
        onChangeText={setTaskText}
      />

      <Pressable style={styles.button} onPress={addTask}>
        <ThemedText style={styles.buttonText}>Add Task</ThemedText>
      </Pressable>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <Pressable
            style={styles.task}
            onPress={() => toggleTask(item.id)}
          >
            <ThemedText style={[styles.taskText, item.completed && styles.completedTask]}>
              {item.title}
            </ThemedText>
          </Pressable>
        )}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            No tasks yet
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    color: 'black',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  task: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFBF00',
  },
  taskText: {
    fontSize: 18,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
});