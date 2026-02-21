import { io } from 'socket.io-client'

let socket = null

export const initSocket = (userId) => {
  if (socket) return socket
  socket = io(window.location.origin, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  })
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id)
    if (userId) socket.emit('join:user', userId)
  })
  socket.on('disconnect', () => console.log('Socket disconnected'))
  return socket
}

export const getSocket = () => socket

export const joinCourse = (courseId) => {
  if (socket) socket.emit('join:course', courseId)
}

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null }
}

export default { initSocket, getSocket, joinCourse, disconnectSocket }
