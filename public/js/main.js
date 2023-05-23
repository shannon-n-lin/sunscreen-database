// let host = 'https://sunscreen-database.onrender.com'
let host = 'http://localhost:9000'

const likeButton = document.querySelectorAll('.addLike')
const deleteButton = document.querySelectorAll('.delete')

Array.from(likeButton).forEach((element) => {
  element.addEventListener('click', addLike)
})
Array.from(deleteButton).forEach((element) => {
  element.addEventListener('click', deleteSunscreen)
})

// jquery autocomplete search of database
$(document).ready(function () {
  $('#search').autocomplete({   
    source: async function(req, res) {
      let data= await fetch(`${host}/search?query=${req.term}`)
        .then(results => results.json())
        .then(results => results.map(result => {
          return {
            label: `${result.brand} - ${result.name}`,
            value: `${result.brand} - ${result.name}`,
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
          $('#name').text(`Name: ${result.name}`)
          $('#spf').text(`SPF: ${result.spf}`)
          $('#form').text(`Form: ${result.form}`)
          $('#type').text(`Type: ${result.type}`)
          $('#finish').text(`Finish: ${result.finish}`)
          $('#price').text(`Price: $${(Number(result.priceUSD) / Number(result.ounces)).toFixed(2)} / ounce`)
          $('#ingredients').text(`Ingredients: ${result.ingredients}`)
          // // if ingredients are saved as array:
          // $('#ingredientsLabel').text('Ingredients:') 
          // $('#ingredients').empty()
          // result.ingredients.forEach(ing => {
          //   $('#ingredients').append(`<li>${ing}</li>`)
          // })
          $('#likes').text(`Likes: ${result.likes}`)
          $('#resultImg').attr('src', result.imageURL)
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
    document.getElementById('name').innerText = `Name: ${data.name}`
    document.getElementById('spf').innerText = `SPF: ${data.spf}`
    document.getElementById('form').innerText = `Form: ${data.form}`
    document.getElementById('type').innerText = `Type: ${data.type}`
    document.getElementById('finish').innerText = `Finish: ${data.finish}`
    let price = Number(data.priceUSD) / Number(data.ounces)
    document.getElementById('price').innerText = `Price: $${price.toFixed(2)} / ounce`
    document.getElementById('ingredientsLabel').innerText = 'Ingredients:'
    for (item of data.ingredients) {
      document.getElementById('ingredients').innerHTML += `<li>${item}</li>`
    }
    document.getElementById('likes').innerText = `Finish: ${data.likes}`
    document.getElementById('resultImg').src = data.imageURL
  } catch(error) {
    console.log(error)
  }
}

// add one like to a sunscreen
async function addLike() {
  const name = this.parentNode.childNodes[3].innerText
  const likes = Number(this.parentNode.childNodes[7].innerText)
  try {
    const response = await fetch('addLike', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'likes': likes
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch(error) {
    console.log(error)
  }
}

// delete a sunscreen
async function deleteSunscreen() {
  const name = this.parentNode.childNodes[3].innerText
  try {
    const response = await fetch('deleteSunscreen', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch(error) {
    console.log(error)
  }
}