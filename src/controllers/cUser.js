const getUsers = (_, res) => {
    res.json(res.paginatedResult);
};

export {
  getUsers
};