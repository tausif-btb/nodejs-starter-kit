const validateRequest = (schema)=>{
    return (req,res,nxt)=>{
        const {error}= schema.validate(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }
        nxt();
    };
};

export default validateRequest;