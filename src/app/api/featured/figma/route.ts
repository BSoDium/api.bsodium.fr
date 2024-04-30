export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const figmaId = '999587062272131138';

export async function GET(request: Request) {
  const response = await fetch(`https://www.figma.com/api/hub_files/profile/${figmaId}`, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  }).then((response) => response.json());

  const projects = response?.meta[0];
  
  return new Response(JSON.stringify(projects));
}