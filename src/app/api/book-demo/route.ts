import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(process.env.ERP_URL);
console.log(process.env.ERP_API_KEY);
    const response = await fetch(
      `${process.env.ERP_URL}/api/resource/Lead`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${process.env.ERP_API_KEY}:${process.env.ERP_API_SECRET}`,
        },
        body: JSON.stringify({
          lead_name: body.fullName,
          company_name: body.company,
          email_id: body.email,
          mobile_no: body.phone,
          notes: body.message,
          status: "Lead",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
  console.error("ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      error: error?.message,
      stack: error?.stack,
    },
    { status: 500 }
  );
}
}