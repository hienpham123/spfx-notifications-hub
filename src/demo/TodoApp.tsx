import React, { useState } from 'react';
import { useNotify, useConfirm, useDialog } from '../core/hooks';
import { notify, confirm } from './notify-api';
import { MyComponentHOC, MyComponentWithRenderProps, MyComponentWithGlobalAPI } from './ClassComponentExample';
import './TodoApp.css';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export const TodoApp: React.FC = () => {
    const notifyHook = useNotify();
    const confirmHook = useConfirm();
    const dialogHook = useDialog();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (!inputValue.trim()) {
            notifyHook.warning('Please enter a task');
            return;
        }

        const newTodo: Todo = {
            id: `todo-${Date.now()}`,
            text: inputValue.trim(),
            completed: false,
        };

        setTodos([...todos, newTodo]);
        setInputValue('');
        notifyHook.success('Task added successfully', { title: 'Success' });
    };

    const handleToggle = async (id: string) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        if (!todo.completed) {
            setTodos(todos.map((t) => (t.id === id ? { ...t, completed: true } : t)));
            notifyHook.success(`Completed: ${todo.text}`);
        } else {
            const result = await confirmHook({
                title: 'Confirm',
                message: `Do you want to mark "${todo.text}" as incomplete?`,
                confirmText: 'Yes',
                cancelText: 'No',
            });

            if (result) {
                setTodos(todos.map((t) => (t.id === id ? { ...t, completed: false } : t)));
                notifyHook.info('Status updated');
            }
        }
    };

    const handleDelete = async (id: string) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        const result = await confirmHook({
            title: 'Confirm Delete',
            message: `Are you sure you want to delete task "${todo.text}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            confirmButtonAppearance: 'primary',
        });

        if (result) {
            setTodos(todos.filter((t) => t.id !== id));
            notifyHook.success('Task deleted', {
                action: {
                    label: 'Undo',
                    onClick: () => {
                        setTodos([...todos]);
                        notifyHook.info('Undone');
                    },
                },
            });
        }
    };

    const handleClearCompleted = async () => {
        const completedCount = todos.filter((t) => t.completed).length;
        if (completedCount === 0) {
            notifyHook.warning('No completed tasks');
            return;
        }

        const result = await confirmHook({
            title: 'Confirm',
            message: `Do you want to delete ${completedCount} completed task(s)?`,
            confirmText: 'Delete All',
            cancelText: 'Cancel',
        });

        if (result) {
            setTodos(todos.filter((t) => !t.completed));
            notifyHook.success(`Deleted ${completedCount} task(s)`);
        }
    };

    const handleDemoSuccess = () => {
        notify.success('Operation successful!', { title: 'Success' });
    };

    const handleDemoWarning = () => {
        notify.warning('This is a warning', { title: 'Warning' });
    };

    const handleDemoError = () => {
        notify.error('An error occurred!', { title: 'Error' });
    };

    const handleDemoConfirm = async () => {
        const result = await confirm({
            title: 'Confirm',
            message: 'Are you sure you want to perform this action?',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
        });

        if (result) {
            notify.success('You confirmed!');
        } else {
            notify.info('You cancelled the action');
        }
    };

    const handleDemoDialog = () => {
        const dialogId = dialogHook.show({
            title: 'Dialog Demo',
            content: (
                <div>
                    <p>This is a sample dialog with custom content.</p>
                    <p>You can place any React component here.</p>
                </div>
            ),
            size: 'medium',
            footer: (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        className="hh-button hh-button-secondary"
                        onClick={() => {
                            dialogHook.hide(dialogId);
                            notify.info('Dialog closed');
                        }}
                    >
                        Close
                    </button>
                </div>
            ),
        });
    };

    return (
        <div className="hh-todo-container">
            <div className="hh-todo-header">
                <h1 className="hh-todo-title">📝 Todo App with Notifications Hub</h1>
                <p>Demo Todo application using SPFx Notifications Hub</p>
            </div>

            <div className="hh-todo-form">
                <input
                    type="text"
                    className="hh-demo-input"
                    placeholder="Enter new task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAdd();
                        }
                    }}
                />
                <button type="button" className="hh-demo-button hh-demo-button-primary" onClick={handleAdd}>
                    Add
                </button>
            </div>

            {todos.length > 0 && (
                <>
                    <div className="hh-todo-list">
                        {todos.map((todo) => (
                            <div key={todo.id} className="hh-todo-item">
                                <div className="hh-todo-content">
                                    <button
                                        type="button"
                                        className={`hh-demo-icon-button ${todo.completed ? 'is-complete' : ''}`}
                                        onClick={() => handleToggle(todo.id)}
                                        title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                    >
                                        <span className="hh-demo-checkbox" aria-hidden="true" />
                                    </button>
                                    <span className={`hh-todo-text ${todo.completed ? 'hh-todo-text-completed' : ''}`}>
                                        {todo.text}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="hh-demo-button hh-demo-button-secondary"
                                    onClick={() => handleDelete(todo.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="hh-todo-actions">
                        <button
                            type="button"
                            className="hh-demo-button hh-demo-button-secondary"
                            onClick={handleClearCompleted}
                            disabled={todos.filter((t) => t.completed).length === 0}
                        >
                            Clear Completed Tasks
                        </button>
                    </div>
                </>
            )}

            {todos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#605e5c' }}>
                    <p>No tasks yet. Add a new task!</p>
                </div>
            )}

            <div className="hh-demo-section">
                <h2 className="hh-demo-section-title">🎯 Demo Notifications Hub</h2>
                <div className="hh-demo-buttons">
                    <button type="button" className="hh-demo-button hh-demo-button-primary" onClick={handleDemoSuccess}>
                        Success Toast
                    </button>
                    <button type="button" className="hh-demo-button hh-demo-button-primary" onClick={handleDemoWarning}>
                        Warning Toast
                    </button>
                    <button type="button" className="hh-demo-button hh-demo-button-primary" onClick={handleDemoError}>
                        Error Toast
                    </button>
                    <button type="button" className="hh-demo-button hh-demo-button-primary" onClick={handleDemoConfirm}>
                        Confirm Dialog
                    </button>
                    <button type="button" className="hh-demo-button hh-demo-button-primary" onClick={handleDemoDialog}>
                        Custom Dialog
                    </button>
                </div>
            </div>

            <div className="hh-demo-section">
                <h2 className="hh-demo-section-title">📦 Class Component Examples</h2>
                <MyComponentHOC title="Example 1: Using HOC" />
                <MyComponentWithRenderProps />
                <MyComponentWithGlobalAPI />
            </div>
        </div>
    );
};
