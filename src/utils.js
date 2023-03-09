const form = document.getElementById('form-input')
const resultDiv = document.getElementById('result')

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const formData = new FormData(event.target);

  const parameters = {
    'username' : formData.get('username'),
    'checksum' : formData.get('checksum'),
    'input_problem' : formData.get('input_problem')
  }

  var formBody = []

  for(var property in parameters) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(parameters[property])

    formBody.push(encodedKey + "=" + encodedValue)
  }

  formBody = formBody.join('&')
  
  const response = await fetch('/process_form_input', {
    method: 'POST',
    headers: {
      'Content-Type'  : 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  });
  
  const result = await response.text();
  resultDiv.innerText = `${result}`;
});
