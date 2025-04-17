const notFound = async (req, res) => {
  res.status(404).json({ message: "Page not found" });
};

export default notFound;
