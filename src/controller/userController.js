import userModel from "../database/schema/userSchema.js";

const userController = {
  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).json({
          status: 'Error',
          message: 'User not found'
        });
      }
      res.status(200).json({
        status: 'Success',
        message: 'User retrieved successfully',
        data: user
      });
    } catch (err) {
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userModel.find();
      res.status(200).json({
        status: 'Success',
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (err) {
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
        error: err.message
      });
    }
  }
}

export default userController;
