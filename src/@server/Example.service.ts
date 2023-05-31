export class ExampleService {
  async getTodo(options: { id: number }): Promise<any> {
    const id = options.id
    const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(response => response.json())
      .then(json => {
        console.log(JSON.stringify(json, null, 2));
        return json;
      });

    return data;
  }
}