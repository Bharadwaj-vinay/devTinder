
#APIs to build

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId

above 2 are combined dynamically as 
    /request/send/:status/:userId

-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId


userRouter
-GET /connections
-GET /requests/received
-GET /feed - gets you the profiles of other users on the platform

status: ignore, interested, accepted, rejected