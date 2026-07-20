import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `token ${process.env.ERP_API_KEY}:${process.env.ERP_API_SECRET}`,
    };

    let leadName = "";
    let isExistingLead = false;

    // Check if Lead already exists
    const existingLeadRes = await fetch(
      `${process.env.ERP_URL}/api/resource/Lead?fields=["name"]&filters=[["email_id","=","${body.email}"]]`,
      {
        headers: {
          Authorization: headers.Authorization,
        },
      }
    );

    const existingLeadData = await existingLeadRes.json();

    if (existingLeadData.data?.length > 0) {
      isExistingLead = true;
      leadName = existingLeadData.data[0].name;
    } else {
      // Create New Lead
      const createLeadRes = await fetch(
        `${process.env.ERP_URL}/api/resource/Lead`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            first_name: body.fullName,
            company_name: body.company,
            email_id: body.email,
            mobile_no: body.phone,
          }),
        }
      );

      const createLeadData = await createLeadRes.json();

      if (!createLeadRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: createLeadData,
          },
          {
            status: createLeadRes.status,
          }
        );
      }

      leadName = createLeadData.data.name;
    }

    // Add message as Comment (optional)
    if (body.message?.trim()) {
      await fetch(`${process.env.ERP_URL}/api/resource/Comment`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          comment_type: "Comment",
          reference_doctype: "Lead",
          reference_name: leadName,
          content: body.message,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      lead: leadName,
      message: isExistingLead
        ? "Existing lead found."
        : "Lead created successfully.",
    });
  } catch (error: any) {
    console.error("Book Demo Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}