import { supabase } from "@/app/supabaseSetup";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const formData = await req.json();
    const { cmsid, name, design, hq } = formData;
    console.log(formData);
    if (!cmsid || !name || !design || !hq) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the crew member already exists
    const { data: crewData, error: crewError } = await supabase
      .from("Crew")
      .select("*")
      .eq("cms_id", cmsid)
      .single(); 
    console.log(crewData);
    if (crewData) {
      return NextResponse.json(
        { message: "There is already a Crew member with that ID" },
        { status: 400 }
      );
    }
    console.log(crewData)
    // Insert the new crew member
    const { data, error } = await supabase.from("Crew").insert([
      {
        cms_id: cmsid,
        crewname: name,
        designation: design,
        hq: hq,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error submitting form data:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
