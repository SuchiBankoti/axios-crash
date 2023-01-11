// AXIOS GLOBAL
axios.defaults.headers.common["X-auth-token"] = "new token"

// GET REQUEST
function getTodos() {
  axios('https://jsonplaceholder.typicode.com/todos?_limit=5').then(data => showOutput(data)).catch(e => console.log(e))
}

// POST REQUEST
function addTodo() {
  axios.post('https://jsonplaceholder.typicode.com/todos', {
    completed: false,
    title: "new one"
  }).then(data => showOutput(data)).catch(e => console.log(e))
}

// PUT/PATCH REQUEST
function updateTodo() {
  axios.patch('https://jsonplaceholder.typicode.com/todos/1',
    { title: "new todo" }).then(data => showOutput(data)).catch(e => console.log(e))
}

// DELETE REQUEST
function removeTodo() {
  axios.delete('https://jsonplaceholder.typicode.com/todos').then(data => showOutput(data)).catch(e => console.log(e))
}

// SIMULTANEOUS DATA
function getData() {
  axios.all(
    [axios.get('https://jsonplaceholder.typicode.com/todos'),
    axios.get('https://jsonplaceholder.typicode.com/posts')]
  ).then(axios.spread((a, b) => console.log(b))).catch(e => console.log(e))
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      "content-type": "app",
      Authorization: "something"
    }
  }
  axios.post('https://jsonplaceholder.typicode.com/todos', { title: "new", completed: false }, config).then(data => showOutput(data)).catch(e => console.log(e))
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: "hello world"
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase()
      return data
    })
  }
  axios(options).then(d => showOutput(d))
}

// ERROR HANDLING
function errorHandling() {
  axios.post('https://jsonplaceholder.typicode.com/todos', {
    completed: false,
    title: "new one"
  }).then(data => showOutput(data)).catch(e => {
    if (e.response) {
      console.log(e.response.data)
      console.log(e.response.status)
      console.log(e.response.headers)
    }
    console.log(e)
  })
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.cancelToken.source()
  axios.get('https://jsonplaceholder.typicode.com/todos', {
    cancelToken: source.token
  }).then(data => showOutput(data)).catch(e => {
    if (axios.isCancel(e)) {
      console.log("request cancel", e.message)
    }
  })
  if (true) {
    source.cancel("request canceled")
  }
}

// INTERCEPTING REQUESTS & RESPONSES

axios.interceptors.request.use(config => {
  console.log(`${config.method} is sent to ${config.url} at ${new Date().getTime()}`)
  return config
}, (e) => {
  return Promise.reject(e)
})
// AXIOS INSTANCES
const axiosInstance = axios.create({
  baseUrl: 'https://jsonplaceholder.typicode.com'
})
axios.get('/comments').then(data => showOutput(data)).catch(e => console.log(e))
// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
