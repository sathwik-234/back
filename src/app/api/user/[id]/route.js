import {supabase} from "@/app/supabaseSetup"
import { NextResponse } from "next/server"


export const GET = async(req,{params},res)=>{

    const id = params.id
     
    //getAllUsers
    const {data,error} = await supabase.from('Crew').select('*').eq("id",id).single();
    
    if(error){
        return NextResponse.json({error},{status:500})
    }
    else{
        return NextResponse.json({data},{status:200})
    }
}