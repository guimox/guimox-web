document.addEventListener('DOMContentLoaded', () => {
  const colorButton = document.querySelector('#color-toggle-button')
  const colors = ['#ff4c4c', '#28a745', '#6f42c1']

  let currentColorIndex = 0

  document.documentElement.style.setProperty('--main-color', colors[currentColorIndex])
  if (!colorButton) return;

  colorButton.addEventListener('click', () => {
    currentColorIndex = (currentColorIndex + 1) % colors.length
    document.documentElement.style.setProperty('--main-color', colors[currentColorIndex])
  })
})
