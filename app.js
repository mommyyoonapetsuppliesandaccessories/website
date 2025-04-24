const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar() {
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')
  closeAllSubMenus()
}

function toggleSubMenu(button) {
  if (!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus()
  }
  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')
  if (sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling
    const icon = button.querySelector('.dropdown-icon')
    answer.classList.toggle('open')
    icon.classList.toggle('rotate')
  })
})

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault()
  const form = e.target
  const formData = new FormData(form)
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    })
    if (response.ok) {
      document.getElementById("popupNotification").style.display = "flex"
      form.reset()
    } else {
      throw new Error("Something went wrong. Please try again.")
    }
  } catch (error) {
    alert(error.message)
  }
})

document.getElementById("closePopup").addEventListener("click", function () {
  document.getElementById("popupNotification").style.display = "none"
})

