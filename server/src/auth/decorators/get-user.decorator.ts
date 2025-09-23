import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser= createParamDecorator(
    (data,ctx:ExecutionContext)=>{
        //Contexto en donde se encuentra nest
        
        const req = ctx.switchToHttp().getRequest()
        const user = req.user
        if(!user){
            throw new InternalServerErrorException("User not found in request")
        }

        return (!data)?user:user[data];
    }
)