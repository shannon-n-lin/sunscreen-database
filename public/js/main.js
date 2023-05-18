document.querySelector('button').addEventListener('click', apiRequest)

async function apiRequest() {
  const query = document.querySelector('input').value
  try {
    // const res = await fetch(`https://sunscreen-database.onrender.com/api/${query}`)
    const res = await fetch(`http://localhost:9000/api/${query}`)
    const data = await res.json()

    console.log(data)
    document.getElementById('brand').innerText = `Brand: ${data.brand}`
    document.getElementById('name').innerText = `Name: ${data.sunscreenName}`
    document.getElementById('spf').innerText = `SPF: ${data.spf}`
    document.getElementById('form').innerText = `Form: ${data.form}`
    document.getElementById('type').innerText = `Type: ${data.spf}`
    document.getElementById('finish').innerText = `Finish: ${data.finish}`
    let price = Number(data.priceUSD) / Number(data.ounces)
    document.getElementById('price').innerText = `Price: $${price.toFixed(2)} / ounce`
    document.querySelector('img').src = data.imageURL
    for (item of data.ingredients) {
      document.getElementById('ingredients').innerHTML += `<li>${item}</li>`
    }
  } catch (error) {
    console.log(error)
  }
}