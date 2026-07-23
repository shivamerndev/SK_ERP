const handleForm = (callback) => (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  callback(data);
};

export default handleForm