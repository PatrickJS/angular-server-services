
export class ExampleService {
  async getTodo(options: { id: number }) {
    const id = options.id
    console.log('server request', id);
    const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(response => response.json())
      .then(json => {
        console.log(JSON.stringify(json, null, 2));
        return json;
      });
    return data;
  }
}