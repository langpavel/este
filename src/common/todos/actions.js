import Todo from './todo';
import {Range} from 'immutable';

export const ADD_HUNDRED_TODOS = 'ADD_HUNDRED_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const CLEAR_ALL_COMPLETED_TODOS = 'CLEAR_ALL_COMPLETED_TODOS';
export const CLEAR_ALL_TODOS = 'CLEAR_ALL_TODOS';
export const DELETE_TODO = 'DELETE_TODO';
export const FETCH_USER_TODOS_ERROR = 'FETCH_USER_TODOS_ERROR';
export const FETCH_USER_TODOS_START = 'FETCH_USER_TODOS_START';
export const FETCH_USER_TODOS_SUCCESS = 'FETCH_USER_TODOS_SUCCESS';
export const ON_NEW_TODO_CHANGE = 'ON_NEW_TODO_CHANGE';
export const TOGGLE_TODO_COMPLETED = 'TOGGLE_TODO_COMPLETED';

const MAX_TODO_TITLE_LENGTH = 42;

export function addHundredTodos() {
  // Note how dependency injection ensures pure action.
  return ({getUid, now}) => {
    const todos = {};
    Range(0, 100).forEach(() => {
      const id = getUid();
      todos[id] = new Todo({createdAt: now(), id, title: `Item #${id}`});
    });
    return {
      type: ADD_HUNDRED_TODOS,
      payload: {todos}
    };
  };
}

export function addTodo(todo) {
  return ({getUid, now}) => {
    const newTodo = todo.merge({
      createdAt: now(),
      id: getUid(),
      title: todo.title.trim()
    });
    return {
      type: ADD_TODO,
      payload: {newTodo}
    };
  };
}

export function clearAllCompletedTodos() {
  return {
    type: CLEAR_ALL_COMPLETED_TODOS
  };
}

export function clearAllTodos() {
  return {
    type: CLEAR_ALL_TODOS
  };
}

export function deleteTodo(id) {
  return {
    type: DELETE_TODO,
    payload: {id}
  };
}

export function fetchUserTodos() {
  return ({fetch}) => ({
    type: 'FETCH_USER_TODOS',
    payload: {
      promise: fetch('/api/v1/todos/user')
        .then(response => response.json())
    }
  });
}

export function onNewTodoChange(name, value) {
  switch (name) {
    case 'title':
      value = value.slice(0, MAX_TODO_TITLE_LENGTH); break;
  }
  return {
    type: ON_NEW_TODO_CHANGE,
    payload: {name, value}
  };
}

export function toggleTodoCompleted(todo) {
  return {
    type: TOGGLE_TODO_COMPLETED,
    payload: {todo}
  };
}
