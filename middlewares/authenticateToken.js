import jwt from 'jsonwebtoken'

const authenticateToken = (req,res,nxt) =>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({"status":"failed","message":"Access denied(No token Found)"})
    }

    try {
        // const decoded = jwt.decode(token)
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

        jwt.verify(token, process.env.JWT_ACCESS_KEY)
        req.userId = decoded.userId;

        nxt(); 
        
    } catch (error) {
        res.status(401).json({"message":"Invalid Token"})
    }
};

export default authenticateToken;