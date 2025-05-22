import express, { Request, Response } from 'express';
import session from 'express-session';
import path from 'path';
import url from 'url';
import passport from 'passport';

import * as openIdClient from 'openid-client';
import { Strategy } from 'openid-client/passport'

const configuration = await openIdClient.discovery(
  new URL(process.env.OPENID_ISSUER!),
  process.env.OPENID_CLIENT_ID!,
  process.env.OPENID_CLIENT_SECRET!
);

const baseUrl = new URL(process.env.BASE_URL!);

const strategy = new Strategy({
  config: configuration,
  name: 'prefactor',
  callbackURL: new URL('/callback', baseUrl).toString(),
  scope: 'openid profile email'
}, (tokens, done) => {
  // You can do what you like here -- you'll probably want the "sub" claim, as that's
  // the Prefactor user ID.  You'll also want to keep the idToken for use in the logout.
  done(null, {
    ...tokens.claims(),
    idToken: tokens.id_token,
  });
})

passport.use(strategy);

passport.serializeUser((user: Express.User, cb) => {
  console.log('serializeUser', user);
  cb(null, user)
})

passport.deserializeUser((user: Express.User, cb) => {
  console.log('deserializeUser', user);
  return cb(null, user)
})

const app = express();

// Serve static files
app.use(express.static(path.join(path.dirname(url.fileURLToPath(import.meta.url)), '../public')));
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.session());

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/login', passport.authenticate('prefactor'));
app.get('/callback', passport.authenticate('prefactor', { failureRedirect: '/error', successRedirect: '/' }));
app.get('/logout', (req: Request, res: Response) => {
  const idToken = (req.user as any).idToken;

  req.logout(async (err: any) => {
    if (err) {
      return res.status(500).send(err);
    }

    const endSessionUrl = openIdClient.buildEndSessionUrl(configuration, {
      id_token_hint: idToken,
      post_logout_redirect_uri: new URL('/', baseUrl).toString()
    });

    res.redirect(endSessionUrl.toString());
  });
});

// Protected route example
app.get('/profile', async (req: Request, res: Response) => {
  if (req.user) {
    res.json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
