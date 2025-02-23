import { NextRequest, NextResponse } from "next/server";

const apikey = process.env.API_KEY
const baseUrl = "https://sandbox-api.paddle.com"

export async function GET(request: NextRequest) {
  const res = await fetch(`${baseUrl}/products?include=prices&order_by=created_at[ASC]`, {
      headers: {
          Authorization: `Bearer ${apikey}`
      }
  });
  
  const response = await res.json();
  
  if(res.ok) {
      const products = response.data;
      return NextResponse.json({ products }, { status: 200 });
  }
  else {
      return NextResponse.json({response}, {status: 503})
  }
}