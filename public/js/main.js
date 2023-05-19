// let host = 'https://sunscreen-database.onrender.com'
let host = 'http://localhost:9000'

// jquery autocomplete search of database
$(document).ready(function () {
  $('#name').autocomplete({   
    source: async function(req, res) {
      let data= await fetch(`${host}/search?query=${req.term}`)
        .then(results => results.json())
        .then(results => results.map(result => {
          return {
            label: result.name,
            value: result.name,
            id: result._id,
          }
        }))
        res(data)
    }, 
// load selected autocomplete search result
    minLength: 2,
    select: function(event, ui) {
      fetch(`${host}/get/${ui.item.id}`)
        .then(result => result.json())
        .then(result => {
          $('#brand').text(`Brand: ${result.brand}`)
          $('#name').text(`Name: ${result.sunscreenName}`)
          $('#spf').text(`SPF: ${result.spf}`)
          $('#form').text(`Form: ${result.form}`)
          $('#type').text(`Type: ${result.type}`)
          $('#finish').text(`Finish: ${result.finish}`)
          $('#price').text(`Price: $${(Number(result.priceUSD) / Number(result.ounces)).toFixed(2)} / ounce`)
          $('#ingredientsLabel').text('Ingredients:')
          $('#ingredients').empty()
          result.ingredients.forEach(ing => {
            $('#ingredients').append(`<li>${ing}</li>`)
          })
          $('img').attr('src', result.imageURL)
          console.log(result)
        })
    }
  })
})

// manual search
document.querySelector('button').addEventListener('click', function() {
  apiRequest(document.querySelector('input').value)
})
window.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
		apiRequest(document.querySelector('input').value)
	}
})

// manual search API request
async function apiRequest(search) {
  try {
    const res = await fetch(`${host}/api/${search}`)
    const data = await res.json()

    console.log(data)
    document.getElementById('brand').innerText = `Brand: ${data.brand}`
    document.getElementById('name').innerText = `Name: ${data.sunscreenName}`
    document.getElementById('spf').innerText = `SPF: ${data.spf}`
    document.getElementById('form').innerText = `Form: ${data.form}`
    document.getElementById('type').innerText = `Type: ${data.type}`
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
