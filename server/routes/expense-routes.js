import express from 'express'
import authController from '../controllers/auth-Controller'
import expenseController from '../controllers/expense-Controller'

const router = express.Router()

router.route('/api/expenses/current/preview')
  .get(authController.requireSignin, expenseController.currentMonthPreview)

router.route('/api/expenses/by/category')
  .get(authController.requireSignin, expenseController.expenseByCategory)

router.route('/api/expenses/plot')
  .get(authController.requireSignin, expenseController.plotExpenses)

router.route('/api/expenses/category/averages')
  .get(authController.requireSignin, expenseController.averageCategories)

router.route('/api/expenses/yearly')
  .get(authController.requireSignin, expenseController.yearlyExpenses)

router.route('/api/expenses')
  .post(authController.requireSignin, expenseController.create)
  .get(authController.requireSignin, expenseController.listByUser)

router.route('/api/expenses/:expenseId')
  .get(authController.requireSignin, expenseController.read)
  .put(authController.requireSignin, expenseController.hasAuthorization, expenseController.update)
  .delete(authController.requireSignin, expenseController.hasAuthorization, expenseController.remove)

router.param('expenseId', expenseController.expenseByID)

export default router