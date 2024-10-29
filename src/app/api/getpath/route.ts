// // src/app/api/getpath/route.ts
// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function GET() {
//   const filePath = 'D:\\RegistrationOfBSA.txt'; // Path to the file on D drive

//   try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     return NextResponse.json({ content: data });
//   } catch (err: unknown) {
//     console.error('Error reading file:', err); // Log the error
//     if (err instanceof Error) {
//       return NextResponse.json({ error: 'Failed to read file', details: err.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: 'Failed to read file', details: 'Unknown error occurred' }, { status: 500 });
//   }
// }




import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const file = await req.json(); // Process the file from the request body
  // You can process the file here if needed
  return NextResponse.json({ message: 'File received', file }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: 'GET method not implemented' }, { status: 501 });
}
