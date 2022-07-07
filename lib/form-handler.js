export default function formHandler(req, res) {
  // get the request body
  const body = req.body;

  // log to console for dev
  console.log(`body: ${body}`);

  // check for email
  if (!body.email) {
    return res.status(400).json({ data: "no email provided" });
  }

  // return 200
  res.status(200).json({ data: `${body.email}` });
}
