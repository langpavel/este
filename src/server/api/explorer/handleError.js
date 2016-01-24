
export default function handleError(res, err) {
  const data = {
    error: err.message || err.toString()
  };
  switch (err.code) {
    case 'EACCES':
      return res.status(403).json(data);
    case 'ENOENT':
      return res.status(404).json(data);
    default:
      return res.status(400).json(data);
  }
}
