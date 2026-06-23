import { HACKCLUB_AUTH_CLIENT_ID } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const GET = () => {
    const url = `https://auth.hackclub.com/oauth/authorize?client_id=${HACKCLUB_AUTH_CLIENT_ID}&redirect_uri=https://strangerx.vercel.app/oauth/callback&response_type=code&scope=email profile`;

    throw redirect(302, url);
};