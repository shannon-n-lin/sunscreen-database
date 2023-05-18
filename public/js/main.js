document.querySelector('button').addEventListener('click', apiRequest)

async function apiRequest() {
  const query = document.querySelector('input').value
  try {
    const res = await fetch(`https://sunscreen-database.onrender.com/api/${query}`)
    const data = await res.json()

    console.log(data)
    document.getElementById('brand').innerText = data.brand
    document.getElementById('name').innerText = data.name
    document.getElementById('spf').innerText = data.spf
  } catch (error) {
    console.log(error)
  }
}