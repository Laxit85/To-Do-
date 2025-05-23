import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const confettiCanvasRef = useRef(null);

  useEffect(() => {
    // Load tasks from localStorage on mount
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() === '') return;
    const newTask = { text: taskInput.trim(), completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskInput('');
  };

  const handleToggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    if (updatedTasks[index].completed) {
      triggerConfetti();
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEditTask = (index, newText) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);
  };

  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 2,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
        },
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0 || particle.x > canvas.width || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = 0;
        }
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
    setTimeout(() => {
      particles = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 3000);
  };

  return (
    <>
      <canvas id="confetti" ref={confettiCanvasRef}></canvas>

      <div id="todoPage" className="container">
        <h1>My To-Do List ✨</h1>
        <div className="input-section">
          <input
            type="text"
            id="taskInput"
            placeholder="Add a new task..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
          />
          <button id="addTaskBtn" onClick={handleAddTask}>Add Task</button>
        </div>
        <ul id="taskList">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={task.completed ? 'completed' : ''}
              onClick={(e) => {
                if (
                  e.target.className !== 'editBtn' &&
                  e.target.className !== 'deleteBtn'
                ) {
                  handleToggleComplete(index);
                }
              }}
            >
              <span className="task-text">{task.text}</span>
              <div className="task-actions">
                <button
                  className="editBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newText = prompt('Edit task:', task.text);
                    if (newText !== null && newText.trim() !== '') {
                      handleEditTask(index, newText.trim());
                    }
                  }}
                >
                  ✏️
                </button>
                <button
                  className="deleteBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(index);
                  }}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
