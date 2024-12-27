import { supabase } from "@/app/supabaseSetup";
import { NextResponse } from "next/server";

export const GET = async (req,{params},res) =>{

    const {data,error} = await supabase.from('CheckIn').select('*').eq("cms_id",params.cms_id).order('created_at',{ascending:false});

    if(error){
        return NextResponse.json({error},{status:500})
    }

    return NextResponse.json({data},{status:200})

}