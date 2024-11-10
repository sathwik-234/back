import {supabase} from "@/app/supabaseSetup"
import { NextResponse } from "next/server"


export const GET = async(req,res)=>{
     
    //getAllUsers
    const {data,error} = await supabase.from('Crew').select('*')
    
    if(error){
        return NextResponse.json({error},{status:500})
    }
    else{
        return NextResponse.json({data},{status:200})
    }
}


export const POST = async(req,res)=>{

    //addUser
    const values = await req.json()

    const tupple = {
        fname : values.fname,
        lname : values.lname,
        password : values.password,
        email : values.email
    }

    const {data,error} = await supabase.from('Users').insert(tupple)

    if(error){
        return NextResponse.json({error},{status:500})
    }
    else{
        return NextResponse.json({msg:"User added"},{status:200})
    }

}
