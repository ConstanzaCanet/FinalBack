import passport from "passport";

export const passportGlobal= (strategy)=>{
    return async(req, res,next)=>{
        passport.authenticate(strategy,function(err,user,info){
            if(err) return next(err);
            if(!user) return res.send({error:info.messages?info.messages:info.toString()});
            req.user = user;
            next();
        })(req,res,next)
    }
}

export const checkAuth = (roles)=>{
    return async(req,res,next)=>{
        if(!req.user) return res.send({error:"Chittsss no estas autorizado compadre!"})
        if(roles.includes(req.user.role.toUpperCase())) next();
        else res.status(403).send({error:"no te encuentras autorizado para este endpoint"})
    }
}