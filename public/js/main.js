document.querySelector('button').addEventListener('click', apiRequest)

async function apiRequest() {
  const query = document.querySelector('input').value
  try {
    // const res = await fetch(`https://sunscreen-database.onrender.com/api/${query}`)
    const res = await fetch(`http://localhost:9000/api/${query}`)
    const data = await res.json()

    console.log(data)
    document.getElementById('brand').innerText = data.brand
    document.getElementById('name').innerText = data.sunscreenName
    document.getElementById('spf').innerText = data.spf
    document.getElementById('form').innerText = data.form
    document.getElementById('type').innerText = data.spf
    document.getElementById('finish').innerText = data.finish
    let price = Number(data.priceUSD) / Number(data.ounces)
    document.getElementById('price').innerText = `$${price.toFixed(2)} / ounce`
    document.querySelector('img').src = data.imageURL
    for (item of data.ingredients) {
      document.getElementById('ingredients').innerHTML += `<li>${item}</li>`
    }
  } catch (error) {
    console.log(error)
  }
}