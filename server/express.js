// Creates an express application
import express from 'express'
// Not neccassary, handles request bodies.
import bodyParser from 'body-parser'
// Allows setting cookies in request objects
import cookieParser from 'cookie-parser'
// attempts to compress response bodies for all requests that go through middleware
import compress from 'compression'
// Middleware functions that set various http headers to secure express app
import helmet from 'helmet'
// Middleware that enables cross-origin resource sharing
import cors from 'cors'
import path from 'path'

// Imports for server side theme and css rendering 
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets'
import theme from '../client/theme'
import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { StaticRouter } from 'react-router-dom'
import ReactDOMServer from 'react-dom/server'
import MainRouter from '../client/MainRouter'
import Template from '../template'

// Initialize app
// import devBundle from './devBundle'
const app = express();
// devBundle.compile(app)

// Import Routes
import userRoutes from './routes/user-routes';
import authRoutes from './routes/auth-routes';
import expenseRoutes from './routes/expense-routes'


// Serves static files from dist folder
const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR,
  'dist')))

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// Routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', expenseRoutes)

// Every get request will have this code called
app.get('*', (req, res) => {
  // Generate CSS styles using Material-UI's ServerStyleSheets
  const sheets = new ServerStyleSheets()
  // renderToString generates markup which renders components specific to the route requested
  const context = {}
  // Return template with markup and CSS styles in the response
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  )
  if (context.url) {
    return res.redirect(303, context.url)
  }
  const css = sheets.toString()
  res.status(200).send(Template({
    markup: markup,
    css: css
  }))
})



// Error handling for auth express jwt
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "error": err.name + ": " + err.message })
  } else if (err) {
    res.status(400).json({ "error": err.name + ": " + err.message })
    console.log(err)
  }
})
// Export app
export default app