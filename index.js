// select canvas element
const canvas = document.querySelector('canvas')

// set the context c as 2d
const c = canvas.getContext('2d');

// set canvas dimensions
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);