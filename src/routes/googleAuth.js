import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

const clientUrl = process.env.CLIENT_URL

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    session: false
}),
    (req, res) => {
        const token = jwt.sign(user.toJSON(), process.env.SECRET, {
            expiresIn: 86400, // 1 week
          });
          res.cookie('x-auth-cookie', token);
          res.redirect(clientUrl)
    },
)

export default router;