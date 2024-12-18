export default function Form({ formHandler }) {
  return (
    <form onSubmit={formHandler} method="post">
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
